import React, { useEffect, useState, useContext } from 'react';
import { Form, Table, Button, Modal, Accordion, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function AdminView({ products: propProducts = [], fetchData }) {

	const { user } = useContext(UserContext);

	const [products, setProducts] = useState([]);
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState("");
	const [showAdd, setShowAdd] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [toggle, setToggle] = useState(false);
	const [ordersList, setOrdersList] = useState([]);

	// Fetch products if not provided as prop (optional, in case you want to fetch here too)
	useEffect(() => {
		if (propProducts && Array.isArray(propProducts)) {
			setProducts(propProducts);
		}
	}, [propProducts]);

	const openAdd = () => setShowAdd(true);
	const closeAdd = () => setShowAdd(false);

	const openEdit = (productId) => {
		setId(productId);

		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
			.then(res => res.json())
			.then(data => {
				setName(data.name);
				setDescription(data.description);
				setPrice(data.price);
				setImage(data.image || "");
			});

		setShowEdit(true);
	};

	const closeEdit = () => {
		setName("");
		setDescription("");
		setPrice(0);
		setImage("");
		setShowEdit(false);
	};

	const addProduct = (e) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/products`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price,
				image: image
			})
		})
		.then(res => res.json())
		.then(data => {
			if (data && (data === true || data._id)) {
				Swal.fire({
					position: "top-end",
					icon: "success",
					title: "Product successfully added.",
					showConfirmButton: false,
					timer: 1500,
				});
				setName("");
				setDescription("");
				setPrice(0);
				setImage("");
				closeAdd();
				if (fetchData) fetchData();
			} else {
				Swal.fire({
					position: "top-end",
					icon: "error",
					title: "Something went wrong.",
					showConfirmButton: false,
					timer: 1500,
				});
				closeAdd();
			}
		});
	};

	const editProduct = (e, productId) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price,
				image: image
			})
		})
		.then(res => res.json())
		.then(data => {
			if (data && data.message === 'Product updated successfully') {
				Swal.fire({
					position: "top-end",
					icon: "success",
					title: "Product successfully updated.",
					showConfirmButton: false,
					timer: 1500,
				});
				setName("");
				setDescription("");
				setPrice(0);
				setImage("");
				closeEdit();
				if (fetchData) fetchData();
			} else {
				Swal.fire({
					position: "top-end",
					icon: "error",
					title: "Something went wrong.",
					showConfirmButton: false,
					timer: 1500,
				});
				closeEdit();
			}
		});
	};

	return (
		<React.Fragment>
			{/* Button to open Add Product Modal */}
			<Button variant="primary" className="mb-3" onClick={openAdd}>
				Add Product
			</Button>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Price</th>
						<th>Image</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{products && products.length > 0 ? (
						products.map(product => (
							<tr key={product._id}>
								<td>{product.name}</td>
								<td>{product.description}</td>
								<td>₱{product.price}</td>
								<td>
									{product.image && (
										<img src={product.image} alt={product.name} style={{height: "60px", width: "60px", objectFit: "cover"}} />
									)}
								</td>
								<td>
									<Button
										variant="warning"
										size="sm"
										className="me-2"
										onClick={() => openEdit(product._id)}
									>
										Edit
									</Button>
									{/* Add additional admin actions here if needed */}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="5" className="text-center">No products found.</td>
						</tr>
					)}
				</tbody>
			</Table>

			{/* Add Product Modal */}
			<Modal show={showAdd} onHide={closeAdd}>
				<Form onSubmit={addProduct}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Product</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="productName" className="mb-3">
							<Form.Label>Name:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter product name"
								value={name}
								onChange={e => setName(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group controlId="productDescription" className="mb-3">
							<Form.Label>Description:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter product description"
								value={description}
								onChange={e => setDescription(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group controlId="productPrice" className="mb-3">
							<Form.Label>Price:</Form.Label>
							<Form.Control
								type="number"
								value={price}
								onChange={e => setPrice(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group controlId="productImage" className="mb-3">
							<Form.Label>Image URL:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter image URL"
								value={image}
								onChange={e => setImage(e.target.value)}
								required
							/>
							{image && (
								<div className="mt-2">
									<img src={image} alt="Preview" style={{maxWidth: "100%", maxHeight: "150px"}} />
								</div>
							)}
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={closeAdd}>
							Close
						</Button>
						<Button variant="success" type="submit">
							Submit
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>

			{/* Edit Product Modal */}
			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editProduct(e, id)}>
					<Modal.Header closeButton>
						<Modal.Title>Edit Product</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="productName" className="mb-3">
							<Form.Label>Name:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter product name"
								value={name}
								onChange={e => setName(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group controlId="productDescription" className="mb-3">
							<Form.Label>Description:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter product description"
								value={description}
								onChange={e => setDescription(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group controlId="productPrice" className="mb-3">
							<Form.Label>Price:</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter product price"
								value={price}
								onChange={e => setPrice(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group controlId="productImage" className="mb-3">
							<Form.Label>Image URL:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter image URL"
								value={image}
								onChange={e => setImage(e.target.value)}
								required
							/>
							{image && (
								<div className="mt-2">
									<img src={image} alt="Preview" style={{maxWidth: "100%", maxHeight: "150px"}} />
								</div>
							)}
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={closeEdit}>
							Close
						</Button>
						<Button variant="success" type="submit">
							Submit
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</React.Fragment>
	);
}