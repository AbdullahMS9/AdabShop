import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Form, Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from '../components/Meta';
import { useGetProductDetailQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import { addToCart } from '../slices/cartSlice';
import '../assets/styles/PictureSelector.css';

const ProductScreen = () => {
    const {id:productId} = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [mL, setML] = useState(3);
    const [color, setColor] = useState('black'); // Default color
    const [feature, setFeature] = useState('');

    const { data: product, 
        isLoading, refetch, error } = useGetProductDetailQuery(productId);

    // Calculate price based on selected mL
    const basePrice = product?.price;
    const priceIncrementPerML = basePrice/3; // Adjust this value as needed
    const adjustedPrice = basePrice + (mL - 3) * priceIncrementPerML; //base price is considering 3ml option as default


    const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const addToCartHandler = () => {
        dispatch(addToCart({...product, qty, mL, color, feature }));
        navigate('/cart');
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({
                productId,
                rating,
                comment
            }).unwrap();
            refetch();
            toast.success('Review successfully submitted');
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0); // Scrolls to the top of the page when the component is mounted
    }, []);

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>
                Go Back
            </Link>

            { isLoading? (<Loader />) 
                : ((error) ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) 
                    : (
                        <>
                            <Meta title={product.name} />
                            <Row>
                                <Col md={5}>
                                    <Image src={product.image} alt={product.name} fluid />
                                </Col>
                                <Col md={4}>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <h3>{product.name}</h3>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Price: ${adjustedPrice.toFixed(2)}
                                        </ListGroup.Item>
                                        <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col md={3}>
                                    <Card>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Price:</Col>
                                                    <Col>
                                                        <strong>${(adjustedPrice * qty).toFixed(2)}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Status:</Col>
                                                    <Col>
                                                        <strong>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            {product.countInStock > 0 && (
                                                <>
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>Select Bottle Size/ mL:</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <div className="ml-options">
                                                                    <div
                                                                        className={`ml-option ${mL === 3 ? 'selected' : ''}`}
                                                                        onClick={() => {
                                                                            setML(3);
                                                                            setColor('black');
                                                                            setFeature('None');
                                                                        }}
                                                                    >
                                                                        <Image fluid src="../uploads/3mLBottle.png" className="ml-option-img"/>
                                                                        3mL Clear Bottle
                                                                    </div>

                                                                    <div
                                                                        className={`ml-option ${(mL === 5 && feature === '') 
                                                                            ? 'selected' : ''}`}
                                                                        
                                                                        onClick={() => {
                                                                            setML(5); 
                                                                            setColor('black');
                                                                            setFeature('');
                                                                        }}
                                                                    >
                                                                        <Image fluid src="../uploads/5mLBottle.png" className="ml-option-img"/>
                                                                        5mL Clear Bottle
                                                                    </div>

                                                                    {/*
                                                                    <div
                                                                        className={`ml-option ${(mL === 5 && feature ==='Refill') 
                                                                            ? 'selected' : ''}`}
                                                                        
                                                                        onClick={() => {
                                                                            setML(5); 
                                                                            setColor('black');
                                                                            setFeature('Refill');
                                                                        }}
                                                                    >
                                                                        <Image fluid src="../uploads/5mLRefillBottle.png" className="ml-option-img"/>
                                                                        5mL Refillable Bottle
                                                                    </div>
                                                                    */}

                                                                    <div
                                                                        className={`ml-option ${(mL === 5 && feature === 'Colored') 
                                                                            ? 'selected' : ''}`}
                                                                        
                                                                        onClick={() => {
                                                                            setML(5); 
                                                                            setColor('black');
                                                                            setFeature('Colored');
                                                                        }}
                                                                    >
                                                                        <Image fluid src="../uploads/5mLBottle.png" className="ml-option-img"/>
                                                                        5mL Bottle
                                                                    </div>

                                                                    <div
                                                                        className={`ml-option ${mL === 8 ? 'selected' : ''}`}
                                                                        onClick={() => {setML(8); setColor('black');}}
                                                                    >
                                                                        <Image fluid src="../uploads/8mLBottle.png" className="ml-option-img"/>
                                                                        8mL Retractable Bottle
                                                                    </div>
                                                                    
                                                                    <div
                                                                        className={`ml-option ${mL === 10 ? 'selected' : ''}`}
                                                                        onClick={() => {setML(10); setColor('black');}}
                                                                    >
                                                                        <Image fluid src="../uploads/10mLBottle.png" className="ml-option-img"/>
                                                                        10mL Glass Bottle
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>

                                                    {/* Conditionally Render Color Options */}
                                                    {(mL === 5 && feature === 'Colored') && ( // Show color options only if 5mL is selected
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>Bottle Color:</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <div className="color-options">
                                                                        {['black', 'red', 'lightgray', 'gold', 'pink', 'purple', 'blue'].map(c => (
                                                                            <div
                                                                                key={c}
                                                                                className={`color-option ${color === c ? 'selected' : ''}`}
                                                                                style={{ backgroundColor: c }}
                                                                                onClick={() => setColor(c)}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row className="text-center">
                                                                <Col>
                                                                    {(color === 'lightgray') ? 'white' : color}
                                                                </Col>
                                                            </Row>
                                                            {/*
                                                            <Row>
                                                                <div>
                                                                    <label>
                                                                        <input 
                                                                        type="checkbox" 
                                                                        checked={(mL===5) && color==='black'} 
                                                                        onChange={() => setColor("black")} 
                                                                        />
                                                                        Black Refillable Bottle
                                                                    </label>
                                                                </div>
                                                            </Row>
                                                            */}
                                                        </ListGroup.Item>
                                                    )}
                                                    {mL === 8 && ( // Show color options only if 5mL is selected
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>Bottle Color:</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <div className="color-options">
                                                                        {['black', 'red', 'lightgray', 'blue'].map(c => (
                                                                            <div
                                                                                key={c}
                                                                                className={`color-option ${color === c ? 'selected' : ''}`}
                                                                                style={{ backgroundColor: c }}
                                                                                onClick={() => setColor(c)}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row className="text-center">
                                                                <Col>
                                                                    {(color === 'lightgray') ? 'white' : color}
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                    )}
                                                    {mL === 10 && ( // Show color options only if 10mL is selected
                                                        <ListGroup.Item>
                                                            <Row>
                                                                <Col>Bottle Color:</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <div className="color-options">
                                                                        {['black', 'red', 'lightgray', 'gold'].map(c => (
                                                                            <div
                                                                                key={c}
                                                                                className={`color-option ${color === c ? 'selected' : ''}`}
                                                                                style={{ backgroundColor: c }}
                                                                                onClick={() => setColor(c)}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row className="text-center">
                                                                <Col>
                                                                    {(color === 'lightgray') ? 'white' : color}
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                    )}


                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>Qty</Col>
                                                            <Col>
                                                                <Form.Control 
                                                                    as = 'select'
                                                                    value = {qty}
                                                                    onChange = {(e) => setQty(Number(e.target.value))}
                                                                >
                                                                    {[...Array(product.countInStock).keys()].map((x) => (
                                                                        <option key = {x + 1} value = {x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    ))}
                                                                </Form.Control>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                </>  
                                            )}

                                            <ListGroup.Item>
                                                <Button 
                                                    className="btn-block" 
                                                    type="button" 
                                                    disabled={product.countInStock === 0}
                                                    onClick={addToCartHandler}>
                                                    Add to Cart
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>
                            <Row className='review'>
                                <Col md={6}>
                                    <h2>Reviews:</h2>
                                    {product.reviews.length === 0 && <Message>No Reviews</Message>}
                                    <ListGroup variant='flush'>
                                        {product.reviews.map(review => (
                                            <ListGroup.Item key={review._id}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} />
                                                <p>{review.createdAt.substring(0,10)}</p>
                                                <p>{review.comment}</p>
                                            </ListGroup.Item>
                                        ))}
                                        <ListGroup.Item>
                                            <h2>Write a review</h2>
                                            {loadingReview && <Loader/>}
                                            {userInfo ? (
                                                <Form onSubmit={ submitReviewHandler }>
                                                    <Form.Group controlId='rating' className='my-2'>
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Control
                                                            as='select'
                                                            value={rating}
                                                            onChange={(e) => setRating(Number(e.target.value))}
                                                        >
                                                            <option value=''>Select...</option>
                                                            <option value='1'>1 - Bad</option>
                                                            <option value='2'>2 - Poor</option>
                                                            <option value='3'>3 - Fair</option>
                                                            <option value='4'>4 - Good</option>
                                                            <option value='5'>5 - Excellent</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group controlId='comment' className='my-2'>
                                                        <Form.Label>Comment</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            rows={3}
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                        ></Form.Control>
                                                    </Form.Group>
                                                    <Button disabled={loadingReview} type='submit' variant='primary'>
                                                        Submit
                                                    </Button>
                                                </Form>
                                            ) : (
                                                <Message>Please <Link to='/login'>sign in</Link> to write a review{' '}</Message>
                                            )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </>
                    )
                )
            }
        
        </>
    );
};

export default ProductScreen;