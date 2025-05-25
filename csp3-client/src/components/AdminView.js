// ... (imports remain unchanged)

export default function AdminView(){

	const { user } = useContext(UserContext);

	const [products, setProducts] = useState([]);
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState(""); // <-- ADD THIS
	const [showAdd, setShowAdd] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [toggle, setToggle] = useState(false);
	const [ordersList, setOrdersList] = useState([]);

	const openAdd = () => setShowAdd(true);
	const closeAdd = () => setShowAdd(false);

	const openEdit = (productId) => {
		setId(productId);

		fetch(`${ process.env.REACT_APP_API_URL }/products/${ productId }`)
		.then(res => res.json())
		.then(data => {
			setName(data.name);
			setDescription(data.description);
			setPrice(data.price);
			setImage(data.image || ""); // <-- ADD THIS
		});

		setShowEdit(true);

	};

	const closeEdit = () => {
		setName("");
		setDescription("");
		setPrice(0);
		setImage(""); // <-- ADD THIS
		setShowEdit(false);
	};

	const addProduct = (e) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/products`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price,
				image: image // <-- ADD THIS
			})
		})
		.then(res => res.json())
		.then(data => {

			if (data === true) {

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
				setImage(""); // <-- ADD THIS
				closeAdd();

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

		fetch(`${process.env.REACT_APP_API_URL}/products/${ productId }`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price,
				image: image // <-- ADD THIS
			})

		})
		.then(res => res.json())
		.then(data => {

			if (data.message === 'Product updated successfully') {

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
				setImage(""); // <-- ADD THIS
				closeEdit();

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

	// ... (rest of existing code is unchanged)

	return(
		<React.Fragment>
			{/* ... (rest of your JSX remains unchanged) */}
			<Modal show={showAdd} onHide={closeAdd}>
				<Form onSubmit={e => addProduct(e)}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Product</Modal.Title>
					</Modal.Header>
					<Modal.Body>
							<Form.Group controlId="productName">
								<Form.Label>Name:</Form.Label>
								<Form.Control 
									type="text"
									placeholder="Enter product name"
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</Form.Group>
							<Form.Group controlId="productDescription">
								<Form.Label>Description:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter product description"
									value={description}
									onChange={e => setDescription(e.target.value)}
									required
								/>
							</Form.Group>
							<Form.Group controlId="productPrice">
								<Form.Label>Price:</Form.Label>
								<Form.Control
									type="number"
									value={price}
									onChange={e => setPrice(e.target.value)}
									required
								/>
							</Form.Group>
							<Form.Group controlId="productImage">
								<Form.Label>Image URL:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter image URL"
									value={image}
									onChange={e => setImage(e.target.value)}
								/>
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
			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editProduct(e, id)}>
					<Modal.Header closeButton>
						<Modal.Title>Edit Product</Modal.Title>
					</Modal.Header>
					<Modal.Body>
							<Form.Group controlId="productName">
								<Form.Label>Name:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter product name"
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</Form.Group>
							<Form.Group controlId="productDescription">
								<Form.Label>Description:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter product description"
									value={description}
									onChange={e => setDescription(e.target.value)}
									required
								/>
							</Form.Group>
							<Form.Group controlId="productPrice">
								<Form.Label>Price:</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter product price"
									value={price}
									onChange={e => setPrice(e.target.value)}
									required
								/>
							</Form.Group>
							<Form.Group controlId="productImage">
								<Form.Label>Image URL:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter image URL"
									value={image}
									onChange={e => setImage(e.target.value)}
								/>
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