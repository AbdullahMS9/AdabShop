import {Navbar, Nav, Container} from 'react-bootstrap';
import {FaShoppingCart,FaUser} from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';
import Adab from '../assets/Adab.png'
//<img src={Adab} alt='Adab' width="200" height="100"/>

const Header = () => {
  return (
    <header>
        <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand> 
                        <img src={Adab} alt='Adab' width="250" height="40"/>
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <LinkContainer to='/cart'>
                            <Nav.Link><FaShoppingCart/> Your Cart</Nav.Link>
                        </LinkContainer>
                        
                        <LinkContainer to='/login'>
                            <Nav.Link href='/login'><FaUser/> Login</Nav.Link>
                        </LinkContainer>
                        
                    </Nav>

                </Navbar.Collapse>

            </Container>
        </Navbar>
    </header>
  )
}

export default Header