import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Message from "../components/Message";
import Loader from "../components/Loader";
import { 
    useGetOrderDetailsQuery, 
    usePayOrderMutation, 
    useGetPayPalClientIdQuery, 
    useDeliverOrderMutation} from "../slices/ordersApiSlice";

const OrderScreen = () => {
    const {id: orderId} = useParams();

    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId);

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();

    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPayPalClientIdQuery();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD',
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending'});
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();                    
                }
            }            
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]); 

    /*
    const address = `${order.shippingAddress.address}, ${order.shippingAddress.city} 
    ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;

    {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
    {order.shippingAddress.postalCode},{' '}
    {order.shippingAddress.country}
    */
   
    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details}).unwrap();
                refetch();
                toast.success('Payment Successful');
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        });
    };

    /**
    async function onApproveTest() {
        await payOrder({ orderId, details: { payer: {} } });
        refetch();
        toast.success('Payment Successful');
    };  */

    function onError(error) {
        toast.error(error.message);
    };

    function createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: order.totalPrice,
                        },
                    },
                ],
            })
            .then((orderId) => {
                return orderId;
            });
    };

    const deliverHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Order Delivered')
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

  return isLoading ? (
    <Loader/>
  ) : error ? (
    <Message variant='danger'>
        {error?.data?.message || error.error}
    </Message>
  ) : (
    <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Name: </strong> {order.user.name}
                        </p>
                        <p>
                            <strong>Email: </strong> {order.user.email}
                        </p>
                        <p>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.stateAddress}
                            {' '}{order.shippingAddress.postalCode},{' '}
                            {order.shippingAddress.country}
                        </p>
                        {order.isPaid 
                            ? order.isDelivered 
                                ? (
                                    <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                ) : (
                                <Message variant='danger'>Delivery pending</Message>
                            ) : <Message variant='danger'>Payment pending...</Message>
                        }
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>{order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message variant='success'>Purchase date: {order.paidAt}</Message>
                        ) : (
                            <Message variant='warning'>Proceed with payment method under Order Summary</Message>
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Order is empty</Message>
                        ) : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x ${item.price} = ${(Math.round(item.qty * item.price * 100)/ 100).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>${ (!(order.itemsPrice%10===0) && order.itemsPrice*100%10===0) ? (order.itemsPrice + '0') : (order.itemsPrice) }</Col> 
                            </Row>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${ (!(order.shippingPrice%10===0) && order.shippingPrice*100%10===0) ? (order.shippingPrice + '0') : (order.shippingPrice) }</Col>
                            </Row>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${ (!(order.taxPrice%10===0) && order.taxPrice*100%10===0) ? (order.taxPrice + '0') : (order.taxPrice) }</Col>
                            </Row>
                            <Row>
                                <Col>Total</Col>
                                <Col>${ (!(order.totalPrice%10===0) && order.totalPrice*100%10===0) ? (order.totalPrice + '0') : (order.totalPrice) }</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (     /** Pay Order Place Holder */
                            <ListGroup.Item>
                                {loadingPay && <Loader />}

                                {isPending ? <Loader /> : (
                                    <div>
                                        {/*
                                            <Button
                                            onClick={onApproveTest}
                                            style={{ marginBottom: '10px' }}
                                            >
                                                Test Pay Order
                                            </Button> */}
                                        <div>
                                            <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            ></PayPalButtons>
                                        </div>
                                    </div>
                                )}
                            </ListGroup.Item>
                        )}

                        {loadingDeliver && <Loader/>}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                    Mark as delivered
                                </Button>
                            </ListGroup.Item>
                        )}

                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  );
};

export default OrderScreen;