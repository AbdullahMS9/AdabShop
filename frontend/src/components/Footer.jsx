import {Container, Row, Col} from 'react-bootstrap'

const Footer = () => {
    const curYear = new Date().getFullYear();

  return (
    <footer>
        <Container>
            <Row>
                <Col className='text-center py-3'>
                    <p>AdabNY &copy; {curYear}</p>
                    <p>Contact Us: support@adabny.com</p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer