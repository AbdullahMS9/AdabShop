import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading? <Loader/> : error ? <Message variant='danger'>{error}</Message> 
    : (
    <Carousel pause='hover' className='bg-primary mb-4'>
        {products.map((product) => (
            <Carousel.Item key={product._id} >
                <Link to={`/product/${product._id}`} className="d-flex justify-content-center">
                    {(window.screen.width >= 1280) 
                        ? (
                            <Image src={product.image} alt={product.name} fluid width='50%' height='auto' />
                        ) : (
                            <Image src={product.image} alt={product.name} fluid width='100%' height='auto' />
                        ) }
                    <Carousel.Caption className='carousel-caption'>
                        <h2>
                            {product.name} (${product.price})
                        </h2>
                    </Carousel.Caption>
                </Link>
            </Carousel.Item>
        ))}
    </Carousel>
  );
};

export default ProductCarousel;