import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Message from "../components/Message";
import Loader from "../components/Loader";
import '../assets/styles/PictureSelector.css';
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

    // Function to get image source based on mL size
    const getImageSrc = (mL) => {
        if (mL === 3) {
            return "../uploads/3mLBottle.png"; // Image for 3mL
        } else if (mL === 5) {
            return "../uploads/image-1722436691313.png"; // Image for 5mL
        }
        // Add more conditions if there are other sizes
        return ""; // Default empty string if no image is available
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
                                    <Card key={index} className="my-1">
                                        <ListGroup.Item>
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
                                                    {item.qty} x ${(item.price*item.mL/3).toFixed(2)} = ${(item.qty * item.price * item.mL/3).toFixed(2)}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={1}>
                                                    <Image fluid className="ml-option-img" src={getImageSrc(item.mL)} alt={`${item.mL}mL bottle`} />
                                                </Col>
                                                <Col md={2}>
                                                    {item.mL}mL
                                                </Col>
                                                <Col>
                                                    {(item.color) === 'lightgray' ? 'white' : item.color}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    </Card>
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
                                <Col>${ order.itemsPrice.toFixed(2) }</Col> 
                            </Row>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${ order.shippingPrice.toFixed(2) }</Col>
                            </Row>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${ order.taxPrice.toFixed(2) }</Col>
                            </Row>
                            <Row>
                                <Col>Total</Col>
                                <Col>${ order.totalPrice.toFixed(2) }</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (     /** Pay Order Place Holder */
                            <ListGroup.Item>
                                {loadingPay && <Loader />}

                                {isPending ? <Loader /> : (
                                    <div>
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