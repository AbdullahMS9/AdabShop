import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import '../assets/styles/PictureSelector.css';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = async (product, qty, mL, color) => {
        dispatch(addToCart({...product, qty, mL, color}));
    };
    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping')
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

    return (
        <>
            <Link to='/' className="btn btn-light my-3">
                <i>Return to shopping</i>
            </Link>
            <Row>
                <Col md={8}>
                    <h1 style={{marginBottom: '20px'}}>Your Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <Message variant='warning'>
                            Your cart is empty. <Link to='/'>Go Back</Link>
                        </Message>
                    ) : (
                        <ListGroup variant='flush'>
                            {cartItems.map((item) => (
                                <Card className='my-1' key={item._id}>
                                    <ListGroup.Item >
                                        <Row>
                                            <Col md={2}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col md={4}>
                                                <Link to={`/product/${item._id}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={2}>
                                                ${Number(item.price*item.mL/3).toFixed(2)}
                                            </Col>
                                            <Col md={2}>
                                                <Form.Control 
                                                    as = 'select'
                                                    value = {item.qty} 
                                                    onChange = {(e) => addToCartHandler(item, Number(e.target.value), item.mL, item.color)}
                                                >
                                                    {[...Array(item.countInStock).keys()].map((x) => (
                                                        <option key = {x + 1} value = {x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                            <Col md={1}>
                                                <Button type='button' variant='light' onClick={ () => removeFromCartHandler(item._id)}>
                                                    <FaTrash/>
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={2} />
                                            <Col md={4}>
                                                <Image fluid className="ml-option-img" src={getImageSrc(item.mL)} alt={`${item.mL}mL bottle`} />
                                                {item.mL}mL
                                            </Col>
                                            <Col >
                                                {(item.color) === 'lightgray' ? 'white' : item.color}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                </Card>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>
                                    Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                                </h2>
                                ${cartItems.reduce((acc, item) => acc + item.qty * (item.price*item.mL/3), 0).toFixed(2)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                                    Proceed To Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default CartScreen;