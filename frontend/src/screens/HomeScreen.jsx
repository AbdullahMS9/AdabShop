import { useParams } from 'react-router-dom';
import {Row, Col, Image} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import VialsBannerHD from '../assets/VialsBannerHD.png';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const {data, isLoading, error} = useGetProductsQuery({ keyword, pageNumber });

  return (
    <>
      { !keyword ? (<>
          <ProductCarousel/>
        </>) : (
          <Link to='/' className='btn btn-dark mb-4' style={{ color: 'white' }}>Go Back</Link>
      )}
      { isLoading? (<Loader />) 
        : (error? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) 
          : ( <>
                <Meta />

                <h1> Latest Products </h1>
                <Row>
                    {(data.products.length !== 0) ? (data.products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product}/>
        
                        </Col>
                      ))
                    ):(
                      <Message variant='danger'>No products found</Message>
                    )}
                </Row>

                <div className="d-flex justify-content-center">
                  <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''}/>
                </div>
                <div className="d-flex justify-content-center">
                  <Image className='mb-4' src={VialsBannerHD} alt={' '} width='100%' height='auto' />
                </div>
              </>
            )
          )
        }
       

    </>
  )
}

export default HomeScreen