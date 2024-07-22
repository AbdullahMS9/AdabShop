import { useState, useEffect } from "react";
import { Link, /*useNavigate,*/ useParams } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from '../../components/FormContainer';
import { toast } from "react-toastify";
import { 
    useEditProductMutation, 
    useGetProductDetailQuery, 
    useUploadProductImageMutation, 
} from "../../slices/productsApiSlice";

const ProductEditScreen = () => {
    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const { data: product, isLoading, refetch, error} = useGetProductDetailQuery(productId);

    const [editProduct, {isLoading: loadingUpdate}] = useEditProductMutation();

    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();

    //const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCountInStock(product.countInStock);
            setCategory(product.category);
            setDescription(product.description);
        }
    },[product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await editProduct({
                productId,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
            }).unwrap();
            toast.success('Product Successfully Updated');
            refetch();
            //navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const uploadFileHandler = async(e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error); 
        }
    };

  return (
    <>
        <Link to='/admin/productlist' className="btn btn-light my-3">
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit Product: </h1><h5>{name}</h5>
            {loadingUpdate && <Loader/>}
            {isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="my-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="price" className="my-2">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Set Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="image" className="my-2">
                        <Form.Label>Image</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter Image URL"
                            value={image}
                            onChange={ (e) => setImage() }
                        ></Form.Control>
                        <Form.Control
                            type="file"
                            label='Choose file'
                            onChange={uploadFileHandler}
                        ></Form.Control>
                        {loadingUpload && <Loader/>}
                    </Form.Group>

                    <Form.Group controlId="brand" className="my-2">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="countInStock" className="my-2">
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Set Stock"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="category" className="my-2">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="description" className="my-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as='textarea' rows={3}
                            type="text"
                            placeholder="Enter Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="success" className="my-2" style={{ color: 'white'}}>
                        Update
                    </Button>
                </Form>
            )}
        </FormContainer>
    </>
  );
};

export default ProductEditScreen;