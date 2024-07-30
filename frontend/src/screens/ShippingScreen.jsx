import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {

    const cart = useSelector((state) => state.cart);
    const shippingAddress = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const [stateAddress, setStateAddress] = useState(shippingAddress?.stateAddress || '');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, postalCode, country, stateAddress}));
        navigate('/payment');
    };

    //const countryHandler = (e) => {};

    return <FormContainer>
        <CheckoutSteps step1 step2 />

        <h1>Shipping</h1>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='country' className='my-2'>
                <Form.Label>Country</Form.Label>
                <Form.Select 
                    placeholder='Select Country'
                    value={country}
                    onChange={(e)=> setCountry(e.target.value)}
                >
                    <option>Select Country...</option>
                    <option value="United States of America">United States of America</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                </Form.Select>
            </Form.Group>

            <Form.Group controlId='address' className='my-2'>
                <Form.Label>Address</Form.Label>
                <Form.Control 
                    type='text'
                    placeholder='Enter Address'
                    value={address}
                    onChange={(e)=> setAddress(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='city' className='my-2'>
                <Form.Label>City</Form.Label>
                <Form.Control 
                    type='text'
                    placeholder='Enter City'
                    value={city}
                    onChange={(e)=> setCity(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='stateAddress' className='my-2'>
                <Form.Label>State</Form.Label>
                <Form.Select 
                    placeholder='Select State'
                    value={stateAddress}
                    onChange={(e)=> setStateAddress(e.target.value)}
                >
                    <option>Select State...</option>
                    
                    <option value="AL">AL - Alabama</option>
                    <option value="AK">AK - Alaska</option>
                    <option value="AZ">AZ - Arizona</option>
                    <option value="AR">AR - Arkansas</option>
                    <option value="CA">CA - California</option>
                    <option value="CO">CO - Colorado</option>
                    <option value="CT">CT - Connecticut</option>
                    <option value="DE">DE - Delaware</option>
                    <option value="FL">FL - Florida</option>
                    <option value="GA">GA - Georgia</option>
                    <option value="HI">HI - Hawaii</option>
                    <option value="ID">ID - Idaho</option>
                    <option value="IL">IL - Illinois</option>
                    <option value="IN">IN - Indiana</option>
                    <option value="IA">IA - Iowa</option>
                    <option value="KS">KS - Kansas</option>
                    <option value="KY">KY - Kentucky</option>
                    <option value="LA">LA - Louisiana</option>
                    <option value="ME">ME - Maine</option>
                    <option value="MD">MD - Maryland</option>
                    <option value="MA">MA - Massachusetts</option>
                    <option value="MI">MI - Michigan</option>
                    <option value="MN">MN - Minnesota</option>
                    <option value="MS">MS - Mississippi</option>
                    <option value="MO">MO - Missouri</option>
                    <option value="MT">MT - Montana</option>
                    <option value="NE">NE - Nebraska</option>
                    <option value="NV">NV - Nevadaa</option>
                    <option value="NH">NH - New Hampshire</option>
                    <option value="NJ">NJ - New Jersey</option>
                    <option value="NM">NM - New Mexico</option>
                    <option value="NY">NY - New York</option>
                    <option value="NC">NC - North Carolina</option>
                    <option value="ND">ND - North Dakota</option>
                    <option value="OH">OH - Ohio</option>
                    <option value="OK">OK - Oklahoma</option>
                    <option value="OR">OR - Oregon</option>
                    <option value="PA">PA - Pennsylvania</option>
                    <option value="RI">RI - Rhode Island</option>
                    <option value="SC">SC - South Carolina</option>
                    <option value="SD">SD - South Dakota</option>
                    <option value="TN">TN - Tennessee</option>
                    <option value="TX">TX - Texas</option>
                    <option value="UT">UT - Utah</option>
                    <option value="VT">VT - Vermont</option>
                    <option value="VA">VA - Virginia</option>
                    <option value="WA">WA - Washington</option>
                    <option value="WV">WV - West Virginia</option>
                    <option value="WI">WI - Wisconsin</option>
                    <option value="WY">WY - Wyoming</option>
                </Form.Select>
            </Form.Group>

            <Form.Group controlId='postalCode' className='my-2'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control 
                    type='text'
                    placeholder='Enter Postal Code'
                    value={postalCode}
                    onChange={(e)=> setPostalCode(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='my-2'>Proceed</Button>
        </Form>

    </FormContainer>
}

export default ShippingScreen;