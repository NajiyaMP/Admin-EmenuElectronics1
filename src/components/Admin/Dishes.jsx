import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import { Button, Modal } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";

function Dishes() {
  const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
  const [uid, setUid] = useState("");
  const [show, setShow] = useState(false);
  const [on, setOn] = useState(false);
  const [dishes, setDishes] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState([]);
  const [Itemnumber, setItemnumber] = useState("");
  const [ram, setRam] = useState("");
  const [color, setColor] = useState("");
  const [internalstorage, setInternalstorage] = useState("");
  const [features, setFeatures] = useState("");
  const [maincategory, setMaincategory] = useState('');
  const [categories, setCategories] = useState('');
  const [subcategories, setSubcategories] = useState('');
  const [getMaincategories, setGetMaincategories] = useState([]);
  const [getCategories, setGetCategories] = useState([]);
  const [getSubcategories, setGetSubcategories] = useState([]);
  const [getDishes, setGetDishes] = useState([]);
  const [getDishesById, setGetDishesById] = useState({
    dishes: "",
    price: "",
    description: "",
    Itemnumber: "",
    ram: "",
    color: "",
    internalstorage: "",
    features: "",
    mainCategory: "",
    category: "",
    subcategory: ""
  });

  const handleImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImage(selectedFiles);
  };

  const handleClose = () => {
    setShow(false);
    setUid("");
    setDishes("");
    setDescription("");
    setPrice("");
    setImage([]);
    setItemnumber("");
    setRam("");
    setColor("");
    setInternalstorage("");
    setFeatures("");
    setMaincategory("");
    setCategories("");
    setSubcategories("");
  };
  
  const handleShow = () => setShow(true);
  const handleOff = () => setOn(false);

  // Fetch main categories, categories, and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mainCatResponse, catResponse, subCatResponse, dishesResponse] = await Promise.all([
          axios.get(`${backendUrl}/admin/getmaincategories`),
          axios.get(`${backendUrl}/admin/getcategories`),
          axios.get(`${backendUrl}/admin/getsubcategories`),
          axios.get(`${backendUrl}/admin/getdishes`)
        ]);

        setGetMaincategories(mainCatResponse.data);
        setGetCategories(catResponse.data);
        setGetSubcategories(subCatResponse.data);
        setGetDishes(dishesResponse.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [backendUrl]);

  // Function to handle POST dishes
  const postDishes = async () => {
    const formData = new FormData();
    formData.append("dishes", dishes);
    formData.append("description", description);
    formData.append("category", categories);
    formData.append("maincategories", maincategory);
    formData.append("subcategories", subcategories);
    formData.append("price", price);
    formData.append("color", color);
    formData.append("Itemnumber", Itemnumber);
    formData.append("ram", ram);
    formData.append("internalstorage", internalstorage);
    formData.append("features", features);
    image.forEach(file => formData.append("image", file));

    try {
      await axios.post(`${backendUrl}/admin/postdishes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const updateDishes = async () => {
    const formData = new FormData();
    formData.append("dishes", getDishesById.dishes);
    formData.append("description", getDishesById.description);
    formData.append("price", getDishesById.price);
    formData.append("category", getDishesById.category);
    formData.append("maincategories", getDishesById.mainCategory);
    formData.append("subcategories", getDishesById.subcategory);
    formData.append("color", getDishesById.color);
    formData.append("Itemnumber", getDishesById.Itemnumber);
    formData.append("ram", getDishesById.ram);
    formData.append("internalstorage", getDishesById.internalstorage);
    formData.append("features", getDishesById.features);
    
    if (image.length > 0) {
      image.forEach(file => formData.append("image", file));
    }

    try {
      await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData);
      window.location.reload();
    } catch (err) {
      console.error('Error updating dish:', err);
    }
  };

  const handleOn = async (id) => {
    setOn(true);
    setUid(id);

    try {
      const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
      const data = response.data;
      setGetDishesById({
        dishes: data.dishes,
        price: data.price,
        description: data.description,
        Itemnumber: data.Itemnumber,
        ram: data.ram,
        color: data.color,
        internalstorage: data.internalstorage,
        features: data.features,
        mainCategory: data.mainCategory?._id || '',
        category: data.category?._id || '',
        subcategory: data.subcategory?._id || '',
        image: data.image || [],
      });
      setMaincategory(data.mainCategory?._id || '');
      setCategories(data.category?._id || '');
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setGetDishesById(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    const windowConfirmation = window.confirm("Are you sure to Delete this item");
    if (windowConfirmation) {
      try {
        await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Filtering categories and subcategories based on main category and category
  const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === maincategory);
  const filteredSubcategories = getSubcategories.filter(subCat => subCat.category._id === categories);

  return (
    <div>
      <SideNav />
      <div className="whole">
        <div className="main-contenet">
          <div className="pl-3 row main-row">
            <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
                 style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <h2><b>ITEMS</b></h2>
              <Tooltip className="add_btn" title="Add">
                <IoIosAddCircle className="add_btn" onClick={handleShow} />
              </Tooltip>
            </div>
            <div className="container table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Item Number</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Price</th>
                    <th scope="col">Color</th>
                    <th scope="col">Ram</th>
                    <th scope="col">Internal Storage</th>
                    <th scope="col">Features</th>
                    <th scope="col">Main Category</th>
                    <th scope="col">Category</th>
                    <th scope="col">Sub Category</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getDishes.map((items, index) => (
                    <tr key={index}>
                      <td>
                        <div className="image-container">
                          {items.image.map((image, idx) => (
                            <img key={idx} className="avatar" src={`${backendUrl}/images/${image}`} alt={`Image ${idx + 1}`} />
                          ))}
                        </div>
                      </td>
                      <td>{items.Itemnumber}</td>
                      <td>{items.dishes}</td>
                      <td>{items.description}</td>
                      <td>{items.price}</td>
                      <td>{items.color}</td>
                      <td>{items.ram}</td>
                      <td>{items.internalstorage}</td>
                      <td>{items.features}</td>
                      <td>{items.mainCategory?.maincategories || ""}</td>
                      <td>{items.category?.categories || ""}</td>
                      <td>{items.subcategory?.subcategories || ""}</td>
                      <td className="actions">
                        <Tooltip title="Edit">
                          <FiEdit onClick={() => handleOn(items._id)} className="edit-icon" />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <MdDelete onClick={() => handleDelete(items._id)} className="delete-icon" />
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Item Number</label>
                <input type="text" className="form-control" placeholder="Enter Item Number" value={Itemnumber}
                       onChange={(e) => setItemnumber(e.target.value)} />
              </div>
              <div className="form-group col-md-6">
                <label>Name</label>
                <input type="text" className="form-control" placeholder="Enter Dish Name" value={dishes}
                       onChange={(e) => setDishes(e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Description</label>
                <textarea className="form-control" placeholder="Enter Description" value={description}
                          onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <div className="form-group col-md-6">
                <label>Price</label>
                <input type="number" className="form-control" placeholder="Enter Price" value={price}
                       onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Color</label>
                <input type="text" className="form-control" placeholder="Enter Color" value={color}
                       onChange={(e) => setColor(e.target.value)} />
              </div>
              <div className="form-group col-md-6">
                <label>Ram</label>
                <input type="text" className="form-control" placeholder="Enter Ram" value={ram}
                       onChange={(e) => setRam(e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Internal Storage</label>
                <input type="text" className="form-control" placeholder="Enter Internal Storage" value={internalstorage}
                       onChange={(e) => setInternalstorage(e.target.value)} />
              </div>
              <div className="form-group col-md-6">
                <label>Features</label>
                <input type="text" className="form-control" placeholder="Enter Features" value={features}
                       onChange={(e) => setFeatures(e.target.value)} />
              </div>
            </div>
            <div className="form-row">
            <div className="form-group">
                <label htmlFor="maincategory">Main Category</label>
              
                <select className="form-control" id="maincategory" name="mainCategory"
                        value={getDishesById.mainCategory} onChange={(e) => {
                          setMaincategory(e.target.value);
                          handleUpdateChange(e);
                        }}>
                  <option value="">Select Main Category</option>
                  {getMaincategories.map(mainCat => (
                    <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="categories">Category</label>
                <select className="form-control" id="categories" name="category"
                        value={getDishesById.category} onChange={(e) => {
                          setCategories(e.target.value);
                          handleUpdateChange(e);
                        }}>
                  <option value="">Select Category</option>
                  {filteredCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="subcategories">Subcategory</label>
                <select className="form-control" id="subcategories" name="subcategory"
                        value={getDishesById.subcategory} onChange={handleUpdateChange}>
                  <option value="">Select Subcategory</option>
                  {filteredSubcategories.map(subCat => (
                    <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Upload Image</label>
              <input type="file" className="form-control" onChange={handleImage} multiple />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={postDishes}>Save changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={on} onHide={handleOff} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Item Number</label>
                <input type="text" className="form-control" placeholder="Enter Item Number"
                       name="Itemnumber" value={getDishesById.Itemnumber}
                       onChange={handleUpdateChange} />
              </div>
              <div className="form-group col-md-6">
                <label>Name</label>
                <input type="text" className="form-control" placeholder="Enter Dish Name"
                       name="dishes" value={getDishesById.dishes}
                       onChange={handleUpdateChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Description</label>
                <textarea className="form-control" placeholder="Enter Description"
                          name="description" value={getDishesById.description}
                          onChange={handleUpdateChange}></textarea>
              </div>
              <div className="form-group col-md-6">
                <label>Price</label>
                <input type="number" className="form-control" placeholder="Enter Price"
                       name="price" value={getDishesById.price}
                       onChange={handleUpdateChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Color</label>
                <input type="text" className="form-control" placeholder="Enter Color"
                       name="color" value={getDishesById.color}
                       onChange={handleUpdateChange} />
              </div>
              <div className="form-group col-md-6">
                <label>Ram</label>
                <input type="text" className="form-control" placeholder="Enter Ram"
                       name="ram" value={getDishesById.ram}
                       onChange={handleUpdateChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Internal Storage</label>
                <input type="text" className="form-control" placeholder="Enter Internal Storage"
                       name="internalstorage" value={getDishesById.internalstorage}
                       onChange={handleUpdateChange} />
              </div>
              <div className="form-group col-md-6">
                <label>Features</label>
                <input type="text" className="form-control" placeholder="Enter Features"
                       name="features" value={getDishesById.features}
                       onChange={handleUpdateChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label>Main Category</label>
                <select className="form-control" name="mainCategory" value={getDishesById.mainCategory}
                        onChange={handleUpdateChange}>
                  <option value="">Select Main Category</option>
                  {getMaincategories.map(mainCat => (
                    <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-4">
                <label>Category</label>
                <select className="form-control" name="category" value={getDishesById.category}
                        onChange={handleUpdateChange}>
                  <option value="">Select Category</option>
                  {filteredCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.categories}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-4">
                <label>Sub Category</label>
                <select className="form-control" name="subcategory" value={getDishesById.subcategory}
                        onChange={handleUpdateChange}>
                  <option value="">Select Sub Category</option>
                  {filteredSubcategories.map(subCat => (
                    <option key={subCat._id} value={subCat._id}>{subCat.subcategories}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Upload Image</label>
              <input type="file" className="form-control" onChange={handleImage} multiple />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOff}>Close</Button>
          <Button variant="primary" onClick={updateDishes}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default  Dishes;


// import React, { useEffect, useState } from 'react';
// import { Button, Modal, Form, Table } from 'react-bootstrap';
// import { FiEdit } from "react-icons/fi";
// import axios from 'axios';
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";
// import { MdDelete } from "react-icons/md";
// import SideNav from "./SideNav";

// function Products() {
//     const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//     const [show, setShow] = useState(false);
//     const [editShow, setEditShow] = useState(false);
//     const [products, setProducts] = useState([]);
//     const [mainCategories, setMainCategories] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [subcategories, setSubcategories] = useState([]);
//     const [productData, setProductData] = useState({
//         Itemnumber: '',
//         dishes: '',
//         price: '',
//         description: '',
//         internalstorage: '',
//         color: '',
//         ram: '',
//         features: '',
//         mainCategory: '',
//         category: '',
//         subcategory: '',
//         images: []
//     });
//     const [editProductId, setEditProductId] = useState(null);

//     useEffect(() => {
//         fetchMainCategories();
//         fetchCategories();
//         fetchSubcategories();
//         fetchProducts();
//     }, [backendUrl]);

//     const fetchMainCategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
//             setMainCategories(response.data);
//         } catch (err) {
//             console.error('Error fetching main categories:', err);
//         }
//     };

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getcategories`);
//             setCategories(response.data);
//         } catch (err) {
//             console.error('Error fetching categories:', err);
//         }
//     };

//     const fetchSubcategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getsubcategories`);
//             setSubcategories(response.data);
//         } catch (err) {
//             console.error('Error fetching subcategories:', err);
//         }
//     };

//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getdishes`);
//             setProducts(response.data);
//         } catch (err) {
//             console.error('Error fetching products:', err);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProductData(prevState => ({ ...prevState, [name]: value }));
//     };

//     const handleImageChange = (e) => {
//         setProductData(prevState => ({ ...prevState, images: e.target.files }));
//     };

//     const handleShow = () => setShow(true);
//     const handleClose = () => setShow(false);

//     const handleEditShow = (product) => {
//         setEditProductId(product._id);
//         setProductData({
//             Itemnumber: product.Itemnumber,
//             dishes: product.dishes,
//             price: product.price,
//             description: product.description,
//             internalstorage: product.internalstorage,
//             color: product.color,
//             ram: product.ram,
//             features: product.features,
//             mainCategory: product.mainCategory?._id || '',
//             category: product.category?._id || '',
//             subcategory: product.subcategory?._id || '',
//             images: []
//         });
//         setEditShow(true);
//     };
//     const handleEditClose = () => setEditShow(false);

//     const handleSubmit = async () => {
//         const formData = new FormData();
//         Object.keys(productData).forEach(key => {
//             if (key === 'images') {
//                 Array.from(productData.images).forEach(file => {
//                     formData.append('images', file);
//                 });
//             } else {
//                 formData.append(key, productData[key]);
//             }
//         });

//         try {
//             await axios.post(`${backendUrl}/admin/postdishes`, formData);
//             fetchProducts(); // Refresh products list
//             handleClose();
//         } catch (err) {
//             console.error('Error posting product:', err);
//         }
//     };

//     const handleUpdate = async () => {
//         const formData = new FormData();
//         Object.keys(productData).forEach(key => {
//             if (key === 'images') {
//                 Array.from(productData.images).forEach(file => {
//                     formData.append('images', file);
//                 });
//             } else {
//                 formData.append(key, productData[key]);
//             }
//         });

//         try {
//             await axios.put(`${backendUrl}/admin/putdishes/${editProductId}`, formData);
//             fetchProducts(); // Refresh products list
//             handleEditClose();
//         } catch (err) {
//             console.error('Error updating product:', err);
//         }
//     };

//     const handleDelete = async (id) => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//         if (confirmDelete) {
//             try {
//                 await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//                 fetchProducts(); // Refresh products list
//             } catch (err) {
//                 console.error('Error deleting product:', err);
//             }
//         }
//     };

//     const filteredCategories = categories.filter(cat => cat.maincategoriesData._id === productData.mainCategory);
//     const filteredSubcategories = subcategories.filter(subCat => subCat.category._id === productData.category);

//     return (
//         <div>
//             <SideNav />
//             <div className="whole">
//                 <div className="main-content">
//                     <div className="row main-row">
//                         <div className="col-12 my-3 p-3 montserrat-400" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                             <h2><b>ITEMS</b></h2>
//                             <Tooltip title="Add">
//                                 <IoIosAddCircle className="add-btn" onClick={handleShow} />
//                             </Tooltip>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Add Product Modal */}
//             <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Add Product</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group>
//                             <Form.Label>Item Number</Form.Label>
//                             <Form.Control type="text" name="Itemnumber" value={productData.Itemnumber} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Product</Form.Label>
//                             <Form.Control type="text" name="dishes" value={productData.dishes} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Price</Form.Label>
//                             <Form.Control type="text" name="price" value={productData.price} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Description</Form.Label>
//                             <Form.Control as="textarea" name="description" value={productData.description} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Internal Storage</Form.Label>
//                             <Form.Control type="text" name="internalstorage" value={productData.internalstorage} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Color</Form.Label>
//                             <Form.Control type="text" name="color" value={productData.color} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Ram</Form.Label>
//                             <Form.Control type="text" name="ram" value={productData.ram} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Features</Form.Label>
//                             <Form.Control type="text" name="features" value={productData.features} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Main Category</Form.Label>
//                             <Form.Control as="select" name="mainCategory" value={productData.mainCategory} onChange={handleInputChange}>
//                                 <option value="">Select Main Category</option>
//                                 {mainCategories.map((mainCat) => (
//                                     <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Category</Form.Label>
//                             <Form.Control as="select" name="category" value={productData.category} onChange={handleInputChange}>
//                                 <option value="">Select Category</option>
//                                 {filteredCategories.map((cat) => (
//                                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Subcategory</Form.Label>
//                             <Form.Control as="select" name="subcategory" value={productData.subcategory} onChange={handleInputChange}>
//                                 <option value="">Select Subcategory</option>
//                                 {filteredSubcategories.map((subCat) => (
//                                     <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Images</Form.Label>
//                             <Form.Control type="file" name="images" onChange={handleImageChange} multiple />
//                         </Form.Group>
//                         <Button variant="primary" onClick={handleSubmit}>Submit</Button>
//                     </Form>
//                 </Modal.Body>
//             </Modal>

//             {/* Edit Product Modal */}
//             <Modal show={editShow} onHide={handleEditClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Product</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group>
//                             <Form.Label>Item Number</Form.Label>
//                             <Form.Control type="text" name="Itemnumber" value={productData.Itemnumber} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Product</Form.Label>
//                             <Form.Control type="text" name="dishes" value={productData.dishes} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Price</Form.Label>
//                             <Form.Control type="text" name="price" value={productData.price} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Description</Form.Label>
//                             <Form.Control as="textarea" name="description" value={productData.description} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Internal Storage</Form.Label>
//                             <Form.Control type="text" name="internalstorage" value={productData.internalstorage} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Color</Form.Label>
//                             <Form.Control type="text" name="color" value={productData.color} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Ram</Form.Label>
//                             <Form.Control type="text" name="ram" value={productData.ram} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Features</Form.Label>
//                             <Form.Control type="text" name="features" value={productData.features} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Main Category</Form.Label>
//                             <Form.Control as="select" name="mainCategory" value={productData.mainCategory} onChange={handleInputChange}>
//                                 <option value="">Select Main Category</option>
//                                 {mainCategories.map((mainCat) => (
//                                     <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Category</Form.Label>
//                             <Form.Control as="select" name="category" value={productData.category} onChange={handleInputChange}>
//                                 <option value="">Select Category</option>
//                                 {filteredCategories.map((cat) => (
//                                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Subcategory</Form.Label>
//                             <Form.Control as="select" name="subcategory" value={productData.subcategory} onChange={handleInputChange}>
//                                 <option value="">Select Subcategory</option>
//                                 {filteredSubcategories.map((subCat) => (
//                                     <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Images</Form.Label>
//                             <Form.Control type="file" name="images" onChange={handleImageChange} multiple />
//                         </Form.Group>
//                         <Button variant="primary" onClick={handleUpdate}>Update</Button>
//                     </Form>
//                 </Modal.Body>
//             </Modal>

//             {/* Products Table */}
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Item Number</th>
//                         <th>Product</th>
//                         <th>Price</th>
//                         <th>Description</th>
//                         <th>Internal Storage</th>
//                         <th>Color</th>
//                         <th>Ram</th>
//                         <th>Features</th>
//                         <th>Main Category</th>
//                         <th>Category</th>
//                         <th>Subcategory</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products.map(product => (
//                         <tr key={product._id}>
//                             <td>{product.Itemnumber}</td>
//                             <td>{product.dishes}</td>
//                             <td>{product.price}</td>
//                             <td>{product.description}</td>
//                             <td>{product.internalstorage}</td>
//                             <td>{product.color}</td>
//                             <td>{product.ram}</td>
//                             <td>{product.features}</td>
//                             <td>{product.mainCategory.maincategories}</td>
//                             <td>{product.category.name}</td>
//                             <td>{product.subcategory.name}</td>
//                             <td>
//                                 <FiEdit onClick={() => handleEditShow(product)} style={{ cursor: 'pointer' }} />
//                                 <MdDelete onClick={() => handleDelete(product._id)} style={{ cursor: 'pointer' }} />
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </div>
//     );
// }

// export default Products;



// import React, { useEffect, useState } from 'react';
// import { Button, Modal, Form, Table } from 'react-bootstrap';
// import { FiEdit } from "react-icons/fi";
// import axios from 'axios';
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";
// import { MdDelete } from "react-icons/md";
// import SideNav from "./SideNav";

// function Products() {
//     const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//     const [show, setShow] = useState(false);
//     const [editShow, setEditShow] = useState(false);
//     const [dishes, setDishes] = useState("");
//     const [description, setDescription] = useState("");
//     const [price, setPrice] = useState("");
//     const [image, setImage] = useState([]);
//     const [Itemnumber, setItemnumber] = useState("");
//     const [ram, setRam] = useState("");
//     const [color, setColor] = useState("");
  
//     const [internalstorage, setInternalstorage] = useState("");
//     const [features, setFeatures] = useState("");
//     const [productData, setProductData] = useState({
//         Itemnumber: '',
//         dishes: '',
//         price: '',
//         description: '',
//         internalstorage: '',
//         color: '',
//         ram: '',
//         features: '',
//         mainCategory: '',
//         category: '',
//         subcategory: '',
//         images: []
//     });
//     const [mainCategories, setMainCategories] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [subcategories, setSubcategories] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [editProductId, setEditProductId] = useState(null);

//     useEffect(() => {
//         fetchMainCategories();
//         fetchCategories();
//         fetchSubcategories();
//         fetchProducts();
//     }, [backendUrl]);

//     const fetchMainCategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
//             setMainCategories(response.data);
//         } catch (err) {
//             console.error('Error fetching main categories:', err);
//         }
//     };

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getcategories`);
//             setCategories(response.data);
//         } catch (err) {
//             console.error('Error fetching categories:', err);
//         }
//     };

//     const fetchSubcategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getsubcategories`);
//             setSubcategories(response.data);
//         } catch (err) {
//             console.error('Error fetching subcategories:', err);
//         }
//     };

//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getdishes`);
//             setProducts(response.data);
//         } catch (err) {
//             console.error('Error fetching products:', err);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProductData(prevState => ({ ...prevState, [name]: value }));
//     };

//     const handleImageChange = (e) => {
//         setProductData(prevState => ({ ...prevState, images: e.target.files }));
//     };

//     const handleShow = () => setShow(true);
//     const handleClose = () => setShow(false);

//     const handleEditShow = (product) => {
//         setEditProductId(product._id);
//         setProductData({
//             Itemnumber: product.Itemnumber,
//             dishes: product.dishes,
//             price: product.price,
//             description: product.description,
//             internalstorage: product.internalstorage,
//             color: product.color,
//             ram: product.ram,
//             features: product.features,
//             mainCategory: product.mainCategory?._id || '',
//             category: product.category?._id || '',
//             subcategory: product.subcategory?._id || '',
//             images: product.image || []
//         });
//         setEditShow(true);
//     };
//     const handleEditClose = () => setEditShow(false);

//     const handleSubmit = async () => {
//       const formData = new FormData();
//       Object.keys(productData).forEach(key => {
//           if (key === 'images') {
//               Array.from(productData.images).forEach(file => {
//                   formData.append('images', file);
//               });
//           } else {
//               formData.append(key, productData[key]);
//           }
//       });
  
//       try {
//           await axios.post(`${backendUrl}/admin/postdishes`, formData);
//           fetchProducts(); // Refresh products list
//           handleClose();
//       } catch (err) {
//           console.error('Error posting product:', err);
//       }
//   };

//     const handleUpdate = async () => {
//         const formData = new FormData();
//         Object.keys(productData).forEach(key => {
//             if (key === 'images') {
//                 Array.from(productData.images).forEach(file => {
//                     formData.append('images', file);
//                 });
//             } else {
//                 formData.append(key, productData[key]);
//             }
//         });

//         try {
//             await axios.put(`${backendUrl}/admin/putdishes/${editProductId}`, formData);
//             fetchProducts(); // Refresh products list
//             handleEditClose();
//         } catch (err) {
//             console.error('Error updating product:', err);
//         }
//     };

//     const handleDelete = async (id) => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//         if (confirmDelete) {
//             try {
//                 await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//                 fetchProducts(); // Refresh products list
//             } catch (err) {
//                 console.error('Error deleting product:', err);
//             }
//         }
//     };

//     const filteredCategories = categories.filter(cat => cat.maincategoriesData._id === productData.mainCategory);
//     const filteredSubcategories = subcategories.filter(subCat => subCat.category._id === productData.category);

//     return (
//         <div>
//             <SideNav />
//             <div className="whole">
//                 <div className="main-content">
//                     <div className="row main-row">
//                         <div className="col-12 my-3 p-3 montserrat-400" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                             <h2><b>ITEMS</b></h2>
//                             <Tooltip title="Add">
//                                 <IoIosAddCircle className="add-btn" onClick={handleShow} />
//                             </Tooltip>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Add Product Modal */}
//             <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Add Product</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                             <Form>
//                                 <Form.Group>
//                                     <Form.Label>Item Number</Form.Label>
//                                     <Form.Control type="text" name="Itemnumber" value={productData.Itemnumber} onChange={(e) => setItemnumber(e.target.value)}  />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Product</Form.Label>
//                                     <Form.Control type="text" name="dishes" value={productData.dishes} onChange={(e) => setDishes(e.target.value)} />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Price</Form.Label>
//                                     <Form.Control type="text" name="price" value={productData.price} onChange={(e) => setPrice(e.target.value)} />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Description</Form.Label>
//                                     <Form.Control as="textarea" name="description" value={productData.description} onChange={(e) => setDescription(e.target.value)}/>
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Internal Storage</Form.Label>
//                                     <Form.Control type="text" name="internalstorage" value={productData.internalstorage} onChange={(e) => setInternalstorage(e.target.value)} />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Color</Form.Label>
//                                     <Form.Control type="text" name="color"value={productData.color} onChange={(e) => setColor(e.target.value)}  />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Ram</Form.Label>
//                                     <Form.Control type="text" name="ram" value={productData.ram} onChange={(e) => setRam(e.target.value)} />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Features</Form.Label>
//                                     <Form.Control type="text" name="features" value={productData.features} onChange={(e) => setFeatures(e.target.value)} />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Main Category</Form.Label>
//                                         <select className="form-control" id="maincategory" name="mainCategory"
//                                             value={getDishesById.mainCategory} onChange={(e) => {
//                                             setMaincategory(e.target.value);
//                                             handleUpdateChange(e);
//                                             }}>
//                                             <option value="">Select Main Category</option>
//                                             {getMaincategories.map(mainCat => (
//                                                 <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                                             ))}
//                                         </select>
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Category</Form.Label>
//                                     <select className="form-control" id="categories" name="category"
//                                             value={getDishesById.category} onChange={(e) => {
//                                             setCategories(e.target.value);
//                                             handleUpdateChange(e);
//                                             }}>
//                                     <option value="">Select Category</option>
//                                     {filteredCategories.map(cat => (
//                                         <option key={cat._id} value={cat._id}>{cat.name}</option>
//                                     ))}
//                                     </select>
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Subcategory</Form.Label>
//                                                     <select className="form-control" id="subcategories" name="subcategory"
//                                                 value={getDishesById.subcategory} onChange={handleUpdateChange}>
//                                         <option value="">Select Subcategory</option>
//                                         {filteredSubcategories.map(subCat => (
//                                             <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                                         ))}
//                                         </select>
//                                         </Form.Group>
//                                         <Form.Group>
//                                             <Form.Label>Images</Form.Label>
//                                             <Form.Control type="file" name="images" multiple onChange={handleImageChange} />
//                                         </Form.Group>
//                                     </Form>
//                         </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleClose}>
//                         Close
//                     </Button>
//                     <Button variant="primary" onClick={handleSubmit}>
//                         Save 
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             {/* Edit Product Modal */}
//             <Modal show={editShow} onHide={handleEditClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Product</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group>
//                             <Form.Label>Item Number</Form.Label>
//                             <Form.Control type="text" name="Itemnumber" value={productData.Itemnumber} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Product</Form.Label>
//                             <Form.Control type="text" name="dishes" value={productData.dishes} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Price</Form.Label>
//                             <Form.Control type="text" name="price" value={productData.price} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Description</Form.Label>
//                             <Form.Control as="textarea" name="description" value={productData.description} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Internal Storage</Form.Label>
//                             <Form.Control type="text" name="internalstorage" value={productData.internalstorage} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Color</Form.Label>
//                             <Form.Control type="text" name="color" value={productData.color} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Ram</Form.Label>
//                             <Form.Control type="text" name="ram" value={productData.ram} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Features</Form.Label>
//                             <Form.Control type="text" name="features" value={productData.features} onChange={handleInputChange} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Main Category</Form.Label>
//                             <Form.Control as="select" name="mainCategory" value={productData.mainCategory} onChange={handleInputChange}>
//                                 <option value="">Select Main Category</option>
//                                 {mainCategories.map((mainCat) => (
//                                     <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Category</Form.Label>
//                             <Form.Control as="select" name="category" value={productData.category} onChange={handleInputChange}>
//                                 <option value="">Select Category</option>
//                                 {filteredCategories.map((cat) => (
//                                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Subcategory</Form.Label>
//                             <Form.Control as="select" name="subcategory" value={productData.subcategory} onChange={handleInputChange}>
//                                 <option value="">Select Subcategory</option>
//                                 {filteredSubcategories.length > 0 ? (
//                                     filteredSubcategories.map((subCat) => (
//                                         <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                                     ))
//                                 ) : (
//                                     <option disabled>No Subcategories Available</option>
//                                 )}
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Images</Form.Label>
//                             <Form.Control type="file" name="images" multiple onChange={handleImageChange} />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleEditClose}>
//                         Close
//                     </Button>
//                     <Button variant="primary" onClick={handleUpdate}>
//                         Save Changes
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             {/* Products Table */}
//             <Table striped bordered hover>
//               <thead>
//                   <tr>
//                       <th>Item Number</th>
//                       <th>Product</th>
//                       <th>Price</th>
//                       <th>Description</th>
//                       <th>Internal Storage</th>
//                       <th>Color</th>
//                       <th>Ram</th>
//                       <th>Features</th>
//                       <th>Main Category</th>
//                       <th>Category</th>
//                       <th>Subcategory</th>
//                       <th>Images</th>
//                       <th>Actions</th>
//                   </tr>
//               </thead>
//               <tbody>
//                   {products.map((product) => (
//                       <tr key={product._id}>
//                           <td>{product.Itemnumber}</td>
//                           <td>{product.dishes}</td>
//                           <td>{product.price}</td>
//                           <td>{product.description}</td>
//                           <td>{product.internalstorage}</td>
//                           <td>{product.color}</td>
//                           <td>{product.ram}</td>
//                           <td>{product.features}</td>
//                           <td>{product.mainCategory?.name || 'No Main Category'}</td>
//                           <td>{product.category?.name || 'No Category'}</td>
//                           <td>{product.subcategory?.name || 'No Subcategory'}</td>
//                           <td>
//                         <div className="image-container">
//                           {product.image.map((image, idx) => (
//                             <img key={idx} className="avatar" src={`${backendUrl}/images/${image}`} alt={`Image ${idx + 1}`} />
//                           ))}
//                         </div>
//                       </td>
//                           <td>
//                               <Button variant="outline-primary" onClick={() => handleEditShow(product)}><FiEdit /></Button>{' '}
//                               <Button variant="outline-danger" onClick={() => handleDelete(product._id)}><MdDelete /></Button>
//                           </td>
//                       </tr>
//                   ))}
//               </tbody>
//             </Table>

//         </div>
//     );
// }

// export default Products;





// import React, { useEffect, useState } from 'react';
// import { Button, Modal } from 'react-bootstrap';
// import { FiEdit } from "react-icons/fi";
// import axios from 'axios';
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";
// import SideNav from "./SideNav";
// import { MdDelete } from "react-icons/md";



// function Products() {
//     const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//     const [show, setShow] = useState(false);
//     const [Itemnumber, setItemnumber] = useState('');
//     const [dishes, setDishes] = useState('');
//     const [price, setPrice] = useState('');
//     const [description, setDescription] = useState('');
//     const [internalstorage, setInternalstorage] = useState('');
//     const [color, setColor] = useState('');
//     const [ram, setRam] = useState('');
//     const [features, setFeatures] = useState('');
//     const [mainCategory, setMainCategory] = useState('');
//     const [category, setCategory] = useState('');
//     const [subcategory, setSubcategory] = useState('');
//     const [mainCategories, setMainCategories] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [subcategories, setSubcategories] = useState([]);
//     const [getDishes, setGetDishes] = useState([]);

//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);

//     // Fetch main categories, categories, and subcategories from the backend
//     const fetchMainCategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
//             setMainCategories(response.data);
//         } catch (err) {
//             console.error('Error fetching main categories:', err);
//         }
//     };

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getcategories`);
//             setCategories(response.data);
//         } catch (err) {
//             console.error('Error fetching categories:', err);
//         }
//     };

//     const fetchSubcategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getsubcategories`);
//             setSubcategories(response.data);
//         } catch (err) {
//             console.error('Error fetching subcategories:', err);
//         }
//     };

//     const fetchDishes = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getdishes`);
//             setGetDishes(response.data);
//         } catch (err) {
//             console.error('Error fetching dishes:', err);
//         }
//     };

//     const handleImage = (e) => {
//         // Handle image file upload
//     };

//     const postProduct = async () => {
//         const data = {
//             Itemnumber,
//             dishes,
//             price,
//             description,
//             internalstorage,
//             color,
//             ram,
//             features,
//             category,
//             mainCategory,
//             subcategory
//         };
//         try {
//             await axios.post(`${backendUrl}/admin/postdishes`, data);
//             handleClose();
//             fetchDishes(); // Refresh products after adding
//         } catch (err) {
//             console.error('Error posting product:', err);
//         }
//     };

//     useEffect(() => {
//         fetchMainCategories();
//         fetchCategories();
//         fetchSubcategories();
//         fetchDishes();
//     }, [backendUrl]);

//     const updateDishes = async () => {
//       const formData = new FormData();
//       formData.append("dishes", getDishesById.dishes);
//       formData.append("description", getDishesById.description);
//       formData.append("price", getDishesById.price);
//       formData.append("categories", categories);
//       formData.append("subcategory", subcategory);
//       formData.append("Itemnumber", getDishesById.Itemnumber);
//       formData.append("internalstorage", getDishesById.internalstorage);
//       formData.append("color", getDishesById.color);
//       formData.append("features", getDishesById.features);
//       formData.append("ram", getDishesById.ram);
  
//       if (image) {
//         image.forEach(file => formData.append("image", file));
//       }
  
//       try {
//         await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData);
//         window.location.reload();
//       } catch (err) {
//         console.error('Error updating dish:', err);
//       }
//     };
  
//     const handleOn = async (id) => {
//       setOn(true);
//       setUid(id);
  
//       try {
//         const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
//         const data = response.data;
//         setGetDishesById({
//           dishes: data.dishes,
//           price: data.price,
//           description: data.description,
//           Itemnumber: data.Itemnumber,
//           internalstorage: data.internalstorage,
//           color: data.color,
//           ram: data.ram,
//           features: data.features,
//           image: data.image || [],
//         });
//         setMainCategories(data.maincategories || '');
//         setCategories(data.categories || '');
//         setSubcategory(data.subcategories || '');
//       } catch (err) {
//         console.log(err);
//       }
//     };
  
//     const handleUpdateChange = (e) => {
//       const { name, value } = e.target;
//       setGetDishesById((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     };
  
//     // Function to handle deletion of dishes
//     const handleDelete = async (id) => {
//       const windowConfirmation = window.confirm("Are you sure to Delete this item");
//       if (windowConfirmation) {
//         try {
//           await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//           window.location.reload();
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };



//     // Filter categories based on selected main category
//     const filteredCategories = categories.filter(cat => cat.maincategoriesData._id === mainCategory);
    
//     // Filter subcategories based on selected category
//     const filteredSubcategories = subcategories.filter(subCat => subCat.category._id === category);

//     return (
//         <div>
//            <SideNav />
//            <div className="whole">
//               <div className=" main-contenet">
//                 <div className="pl-3 row main-row">
//                   <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                     style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
//                     <h2><b>ITEMS</b></h2>
//                     <Tooltip className="add_btn" title="Add">
//                       <IoIosAddCircle className="add_btn" onClick={handleShow} />
//                     </Tooltip>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Add Product</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <div>
//                         <label>Item Number</label>
//                         <input type="text" className="form-control" value={Itemnumber} onChange={(e) => setItemnumber(e.target.value)} />
//                         <label>Product</label>
//                         <input type="text" className="form-control" value={dishes} onChange={(e) => setDishes(e.target.value)} />
//                         <label>Price</label>
//                         <input type="text" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
//                         <label>Description</label>
//                         <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
//                         <label>Internal Storage</label>
//                         <input type="text" className="form-control" value={internalstorage} onChange={(e) => setInternalstorage(e.target.value)} />
//                         <label>Color</label>
//                         <input type="text" className="form-control" value={color} onChange={(e) => setColor(e.target.value)} />
//                         <label>Ram</label>
//                         <input type="text" className="form-control" value={ram} onChange={(e) => setRam(e.target.value)} />
//                         <label>Features</label>
//                         <input type="text" className="form-control" value={features} onChange={(e) => setFeatures(e.target.value)} />

//                         <select className="my-3 input-style" onChange={(e) => setMainCategory(e.target.value)} value={mainCategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                             <option value="">Select Main Category</option>
//                             {mainCategories.map((mainCat) => (
//                                 <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                             ))}
//                         </select>

//                         <select className="my-3 input-style" onChange={(e) => setCategory(e.target.value)} value={category} style={{ width: "100%", marginBottom: '1rem' }}>
//                             <option value="">Select Category</option>
//                             {filteredCategories.map((cat) => (
//                                 <option key={cat._id} value={cat._id}>{cat.name}</option>
//                             ))}
//                         </select>

//                         <select className="my-3 input-style" onChange={(e) => setSubcategory(e.target.value)} value={subcategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                             <option value="">Select Subcategory</option>
//                             {filteredSubcategories.length > 0 ? (
//                                 filteredSubcategories.map((subCat) => (
//                                     <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                                 ))
//                             ) : (
//                                 <option value="">No Subcategories Available</option>
//                             )}
//                         </select>

//                         <label>Images</label>
//                         <input type="file" className="form-control" multiple onChange={handleImage} />
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleClose}>Close</Button>
//                     <Button variant="primary" onClick={postProduct}>Save</Button>
//                 </Modal.Footer>
//             </Modal>
//             <Modal show={on} onHide={handleOff}>
//                 <Modal.Header closeButton>
//                   <Modal.Title>Update Dishes</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                   <div>
//                     <label>Item Number</label>
//                     <input type="text" className="form-control" name="Itemnumber" value={getDishesById.Itemnumber || ''} onChange={handleUpdateChange} />
//                     <label>Dishes</label>
//                     <input type="text" className="form-control" name="dishes" value={getDishesById.dishes || ''} onChange={handleUpdateChange} />
//                     <label>Price</label>
//                     <input type="text" className="form-control" name="price" value={getDishesById.price || ''} onChange={handleUpdateChange} />
//                     <label>Description</label>
//                     <textarea className="form-control" name="description" value={getDishesById.description || ''} onChange={handleUpdateChange} />
//                     <label>Internal Storage</label>
//                     <input type="text" className="form-control" name="internalstorage" value={getDishesById.internalstorage || ''} onChange={handleUpdateChange} />
//                     <label>Color</label>
//                     <input type="text" className="form-control" name="color" value={getDishesById.color || ''} onChange={handleUpdateChange} />
//                     <label>Ram</label>
//                     <input type="text" className="form-control" name="ram" value={getDishesById.ram || ''} onChange={handleUpdateChange} />
//                     <label>Features</label>
//                     <input type="text" className="form-control" name="features" value={getDishesById.features || ''} onChange={handleUpdateChange} />
//                     <label>Main Category</label>
//                     <select className="my-3 input-style" onChange={(e) => setMainCategory(e.target.value)} value={mainCategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                           <option value="">Select Main Category</option>
//                           {mainCategories.map((mainCat) => (
//                               <option key={mainCat._id} value={mainCat._id}>
//                                   {mainCat.name}
//                               </option>
//                           ))}
//                       </select>

//                       {/* Dropdown for selecting Category */}
//                       <select className="my-3 input-style" onChange={(e) => setCategory(e.target.value)} value={category} style={{ width: "100%", marginBottom: '1rem' }}>
//                           <option value="">Select Category</option>
//                           {filteredCategories.map((cat) => (
//                               <option key={cat._id} value={cat._id}>
//                                   {cat.name}
//                               </option>
//                           ))}
//                       </select>

//                       {/* Dropdown for selecting Subcategory */}
//                       <select className="my-3 input-style" onChange={(e) => setSubcategory(e.target.value)} value={subcategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                           <option value="">Select Subcategory</option>
//                           {filteredSubcategories.map((subCat) => (
//                               <option key={subCat._id} value={subCat._id}>
//                                   {subCat.name}
//                               </option>
//                           ))}
//                       </select>

//                     <label>Images</label>
//                     <input type="file" className="form-control" multiple onChange={handleImage} />
//                   </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                   <Button variant="secondary" onClick={handleOff}>
//                     Close
//                   </Button>
//                   <Button variant="primary" onClick={updateDishes}>
//                     Save Changes
//                   </Button>
//                 </Modal.Footer>
//               </Modal>

//             <table className="table table-striped table-bordered">
//                 <thead className="thead-dark">
//                     <tr>
//                         <th scope="col">Image</th>
//                         <th scope="col">Item Number</th>
//                         <th scope="col">Name</th>
//                         <th scope="col">Description</th>
//                         <th scope="col">Price</th>
//                         <th scope="col">Internal storage</th>
//                         <th scope="col">Color</th>
//                         <th scope="col">Ram</th>
//                         <th scope="col">Features</th>
//                         <th scope="col">Category</th>
//                         <th scope="col">Main Category</th>
//                         <th scope="col">Subcategory</th>
//                         <th scope="col">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {getDishes.map((item, index) => (
//                         <tr key={index}>
//                             <td className="img">
//                                 {item.image && item.image.length > 0 ? (
//                                     <img src={`${backendUrl}/uploads/${item.image[0].filename}`} alt="dish" width="50px" height="50px" />
//                                 ) : (
//                                     "No image available"
//                                 )}
//                             </td>
//                             <td>{item.Itemnumber}</td>
//                             <td>{item.dishes}</td>
//                             <td>{item.description}</td>
//                             <td>{item.price}</td>
//                             <td>{item.internalstorage}</td>
//                             <td>{item.color}</td>
//                             <td>{item.ram}</td>
//                             <td>{item.features}</td>
//                             <td className="text-black item-text">{item.category ? item.category.name : ''}</td>
//                             <td className="text-black item-text">{item.category && item.category.maincategoriesData ? item.category.maincategoriesData.maincategories : ''}</td>
//                             <td>{item.subcategoryData ? item.subcategoryData.subcategory : "No Subcategory"}</td>
//                             <td>
//                                 <MdDelete className="del_btn" onClick={() => handleDelete(item._id)} />
//                                 <FiEdit className="edit_btn" onClick={() => handleEdit(item)} />
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default Products;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideNav from "./SideNav";
// import { Button, Modal } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";
// import { Link } from "react-router-dom";


// function Dishes() {
//   const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//   const [uid, setUid] = useState("");
//   const [show, setShow] = useState(false);
//   const [on, setOn] = useState(false);
//   const [dishes, setDishes] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState([]);
//   const [Itemnumber, setItemnumber] = useState("");
//   const [ram, setRam] = useState("");
//   const [color, setColor] = useState("");
//   const [features, setFeatures] = useState("");
//   const [internalstorage, setInternalstorage] = useState("");
//   const [mainCategories, setMainCategories] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [mainCategory, setMainCategory] = useState('');
//   const [category, setCategory] = useState('');
//   const [subcategory, setSubcategory] = useState('');
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [filteredSubcategories, setFilteredSubcategories] = useState([]);
//   const [getDishes, setGetDishes] = useState([]);
//   const [getDishesById, setGetDishesById] = useState({
//     dishes: "",
//     price: "",
//     description:"",
//     Itemnumber: "",
//     ram: "",
//     internalstorage: "",
//     color: "",
//     features:''
//   });

//   const handleImage = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setImage(selectedFiles);
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const handleOff = () => setOn(false);

//   useEffect(() => {
//     const fetchData = async () => {
//         try {
//             const [mainResponse, catResponse, subResponse] = await Promise.all([
//                 axios.get(`${backendUrl}/admin/getmaincategories`),
//                 axios.get(`${backendUrl}/admin/getcategories`),
//                 axios.get(`${backendUrl}/admin/getsubcategories`)
//             ]);

//             setMainCategories(mainResponse.data);
//             setCategories(catResponse.data);
//             setSubCategories(subResponse.data);
//         } catch (err) {
//             console.error('Error fetching data:', err);
//         }
//     };

//     fetchData();
// }, [backendUrl]);

// useEffect(() => {
//     if (mainCategory) {
//         const filteredCats = categories.filter(cat => cat.maincategoriesData._id === mainCategory);
//         setFilteredCategories(filteredCats);
//         setCategory(''); // Reset category selection
//         setSubcategory(''); // Reset subcategory selection
//     } else {
//         setFilteredCategories([]);
//         setCategory('');
//         setSubcategory('');
//     }
// }, [mainCategory, categories]);

// useEffect(() => {
//     if (category) {
//         const filteredSubs = subCategories.filter(sub => sub.category && sub.category._id === category);
//         setFilteredSubcategories(filteredSubs);
//         setSubcategory(''); // Reset subcategory selection
//     } else {
//         setFilteredSubcategories([]);
//         setSubcategory('');
//     }
// }, [category, subCategories]);

// useEffect(() => {
//     const fetch = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getdishes`);
//             const data = response.data;
//             setGetDishes(data);
//         } catch (err) {
//             console.log(err);
//         }
//     };
//     fetch();
// }, [backendUrl]);

// const postDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", dishes);
//     formData.append("description", description);
//     formData.append("category", category);
//     formData.append("subcategory", subcategory);
//     formData.append("mainCategory", mainCategory);
//     formData.append("price", price);
//     formData.append("Itemnumber", Itemnumber);
//     formData.append("color", color);
//     formData.append("internalstorage", internalstorage);
//     formData.append("ram", ram);
//     formData.append("features", features);

//     for (let i = 0; i < image.length; i++) {
//         formData.append("image", image[i]);
//     }

//     try {
//         await axios.post(`${backendUrl}/admin/postdishes`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         window.location.reload();
//     } catch (err) {
//         console.log(err);
//     }
// };


// const updateDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", getDishesById.dishes);
//     formData.append("description", getDishesById.description);
//     formData.append("price", getDishesById.price);
//     formData.append("category", category);
//     formData.append("subcategory", subcategory);
//     formData.append("Itemnumber", getDishesById.Itemnumber);
//     formData.append("internalstorage", getDishesById.internalstorage);
//     formData.append("color", getDishesById.color);
//     formData.append("features", getDishesById.features);
//     formData.append("ram", getDishesById.ram);

//     if (image.length) {
//         image.forEach(file => formData.append("image", file));
//     }

//     try {
//         await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData);
//         window.location.reload();
//     } catch (err) {
//         console.error('Error updating dish:', err);
//     }
// };
// const handleOn = async (id) => {
//   setOn(true);
//   setUid(id);

//   try {
//       const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
//       const dishData = response.data;

//       setGetDishesById(dishData);
//       setMainCategory(dishData.category?.maincategoriesData?._id || '');
//       setCategory(dishData.category?._id || '');
//       setSubcategory(dishData.subcategory?._id || '');
//   } catch (err) {
//       console.error('Error fetching dish by ID:', err);
//   }
// };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setGetDishesById((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Function to handle deletion of dishes
//   const handleDelete = async (id) => {
//     const windowConfirmation = window.confirm("Are you sure to Delete this item");
//     if (windowConfirmation) {
//       try {
//         await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//         window.location.reload();
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };

//   // Filter categories based on the selected main category
//   return (
//     <div>
//       <SideNav />
//       <div className="whole">
//         <div className=" main-contenet">
//           <div className="pl-3 row main-row">
//             <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400" style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
//               <h2><b>ITEMS</b></h2>
//               <Tooltip className="add_btn" title="Add">
//                 <IoIosAddCircle className="add_btn" onClick={handleShow} />
//               </Tooltip>
//             </div>
//             <div className="container table-responsive">
//             <table className="table table-striped table-bordered">
//     <thead className="thead-dark">
//       <tr>
//         <th scope="col">Image</th>
//         <th scope="col">Item Number</th>
//         <th scope="col">Name</th>
//         <th scope="col">Description</th>
//         <th scope="col">Price</th>
//         <th scope="col">Internal storage</th>
//         <th scope="col">Color</th>
//         <th scope="col">Ram</th>
//         <th scope="col">Features</th>
//         <th scope="col">Category</th>
//         <th scope="col">Main Category</th>
//         <th scope="col">Subcategory</th>
//         <th scope="col">Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {getDishes.map((item, index) => (
//         <tr key={index}>
//           <td className="img">
//             {item.image && item.image.length > 0 ? (
//               <img src={`${backendUrl}/uploads/${item.image[0].filename}`} alt="dish" width="50px" height="50px" />
//             ) : (
//               "No image available"
//             )}
//           </td>
//           <td>{item.Itemnumber}</td>
//           <td>{item.dishes}</td>
//           <td>{item.description}</td>
//           <td>{item.price}</td>
//           <td>{item.internalstorage}</td>
//           <td>{item.color}</td>
//           <td>{item.ram}</td>
//           <td>{item.features}</td>
//           <td className="text-black item-text">
//                        {item.category ? item.category.name : ''}
//                      </td>
//                      <td className="text-black item-text">
//                                                 {item.category && item.category.maincategoriesData ? item.category.maincategoriesData.maincategories : ''}
//                                             </td>
//           <td>{item.subcategoryData ? item.subcategoryData.subcategory : "No Subcategory"}</td>
//           <td>
//             <MdDelete className="del_btn" onClick={() => handleDelete(item._id)} />
//             <FiEdit className="edit_btn" onClick={() => handleOn(item._id)} />
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
             
//               <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Add Dish</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <div>
//                         <label>Item Number</label>
//                         <input type="text" className="form-control" value={Itemnumber} onChange={(e) => setItemnumber(e.target.value)} />
//                         <label>product</label>
//                         <input type="text" className="form-control" value={dishes} onChange={(e) => setDishes(e.target.value)} />
//                         <label>Price</label>
//                         <input type="text" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
//                         <label>Description</label>
//                         <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
//                         <label>Internal Storage</label>
//                         <input type="text" className="form-control" value={internalstorage} onChange={(e) => setInternalstorage(e.target.value)} />
//                         <label>Color</label>
//                         <input type="text" className="form-control" value={color} onChange={(e) => setColor(e.target.value)} />
//                         <label>Ram</label>
//                         <input type="text" className="form-control" value={ram} onChange={(e) => setRam(e.target.value)} />
//                         <label>Features</label>
//                         <input type="text" className="form-control" value={features} onChange={(e) => setFeatures(e.target.value)} />

//                         {/* Dropdown for selecting Main Category */}
//                         <select
//                             className="my-3 input-style"
//                             onChange={(e) => setMainCategory(e.target.value)}
//                             value={mainCategory}
//                             style={{ width: "100%", marginBottom: '1rem' }}
//                         >
//                             <option value="">Select Main Category</option>
//                             {mainCategories.map((mainCat) => (
//                                 <option key={mainCat._id} value={mainCat._id}>
//                                     {mainCat.name ? mainCat.name : mainCat._id}
//                                 </option>
//                             ))}
//                         </select>

//                         {/* Dropdown for selecting Category */}
//                         <select className="my-3 input-style" onChange={(e) => setCategory(e.target.value)} value={category} style={{ width: "100%", marginBottom: '1rem' }}>
//                             <option value="">Select Category</option>
//                             {filteredCategories.map((cat) => (
//                                 <option key={cat._id} value={cat._id}>
//                                     {cat.name}
//                                 </option>
//                             ))}
//                         </select>

//                         {/* Dropdown for selecting Subcategory */}
//                         <select className="my-3 input-style" onChange={(e) => setSubcategory(e.target.value)} value={subcategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                             <option value="">Select Subcategory</option>
//                             {filteredSubcategories.length > 0 ? (
//                                 filteredSubcategories.map((subCat) => (
//                                     <option key={subCat._id} value={subCat._id}>
//                                         {subCat.name}
//                                     </option>
//                                 ))
//                             ) : (
//                                 <option value="">No Subcategories Available</option>
//                             )}
//                         </select>

//                         <label>Images</label>
//                         <input type="file" className="form-control" multiple onChange={handleImage} />
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleClose}>
//                         Close
//                     </Button>
//                     <Button variant="primary" onClick={postDishes}>
//                         Save 
//                     </Button>
//                 </Modal.Footer>
//               </Modal>
//               <Modal show={on} onHide={handleOff}>
//                 <Modal.Header closeButton>
//                   <Modal.Title>Update Dishes</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                   <div>
//                     <label>Item Number</label>
//                     <input type="text" className="form-control" name="Itemnumber" value={getDishesById.Itemnumber || ''} onChange={handleUpdateChange} />
//                     <label>Dishes</label>
//                     <input type="text" className="form-control" name="dishes" value={getDishesById.dishes || ''} onChange={handleUpdateChange} />
//                     <label>Price</label>
//                     <input type="text" className="form-control" name="price" value={getDishesById.price || ''} onChange={handleUpdateChange} />
//                     <label>Description</label>
//                     <textarea className="form-control" name="description" value={getDishesById.description || ''} onChange={handleUpdateChange} />
//                     <label>Internal Storage</label>
//                     <input type="text" className="form-control" name="internalstorage" value={getDishesById.internalstorage || ''} onChange={handleUpdateChange} />
//                     <label>Color</label>
//                     <input type="text" className="form-control" name="color" value={getDishesById.color || ''} onChange={handleUpdateChange} />
//                     <label>Ram</label>
//                     <input type="text" className="form-control" name="ram" value={getDishesById.ram || ''} onChange={handleUpdateChange} />
//                     <label>Features</label>
//                     <input type="text" className="form-control" name="features" value={getDishesById.features || ''} onChange={handleUpdateChange} />
//                     <label>Main Category</label>
//                     <select
//                         className="my-3 input-style"
//                         onChange={(e) => setMainCategory(e.target.value)}
//                         value={mainCategory}
//                         style={{ width: "100%", marginBottom: '1rem' }}
//                     >
//                         <option value="">Select Main Category</option>
//                         {mainCategories.map((mainCat) => (
//                             <option key={mainCat._id} value={mainCat._id}>
//                                 {mainCat.name}
//                             </option>
//                         ))}
//                     </select>

//                       {/* Dropdown for selecting Category */}
//                       <select className="my-3 input-style" onChange={(e) => setCategory(e.target.value)} value={category} style={{ width: "100%", marginBottom: '1rem' }}>
//                           <option value="">Select Category</option>
//                           {filteredCategories.map((cat) => (
//                               <option key={cat._id} value={cat._id}>
//                                   {cat.name}
//                               </option>
//                           ))}
//                       </select>

//                       {/* Dropdown for selecting Subcategory */}
//                       <select className="my-3 input-style" onChange={(e) => setSubcategory(e.target.value)} value={subcategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                           <option value="">Select Subcategory</option>
//                           {filteredSubcategories.map((subCat) => (
//                               <option key={subCat._id} value={subCat._id}>
//                                   {subCat.name}
//                               </option>
//                           ))}
//                       </select>

//                     <label>Images</label>
//                     <input type="file" className="form-control" multiple onChange={handleImage} />
//                   </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                   <Button variant="secondary" onClick={handleOff}>
//                     Close
//                   </Button>
//                   <Button variant="primary" onClick={updateDishes}>
//                     Save Changes
//                   </Button>
//                 </Modal.Footer>
//               </Modal>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dishes;

//multiple fileipload working vcode not update button

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideNav from "./SideNav";
// import { Button, Modal } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";
// import { Link } from "react-router-dom";

// function Dishes() {
//   const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//   const [uid, setUid] = useState("");
//   const [show, setShow] = useState(false);
//   const [on, setOn] = useState(false);
//   const [dishes, setDishes] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState([]);
//   const [Itemnumber, setItemnumber] = useState("");
//   const [weight, setWeight] = useState("");
//   const [purity, setPurity] = useState("");
//   const [details, setDetails] = useState("");
//   const [maincategory, setMaincategory] = useState('');
//   const [categories, setCategories] = useState('');
//   const [getMaincategories, setGetMaincategories] = useState([]);
//   const [getCategories, setGetCategories] = useState([]);
//   const [getCategoriesById, setGetCategoriesById] = useState([]);
//   const [getDishes, setGetDishes] = useState([]);
//   const [getDishesById, setGetDishesById] = useState({
//     dishes: "",
//     price: "",
//     description:"",
//     Itemnumber: "",
//     weight: "",
//     purity: "",
//     details: "",
//   });


//   const handleImage = (e) => {
//     const setUpImage = Array.from(e.target.files);
//     setImage(setUpImage);
//   };


//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const handleOff = () => setOn(false);
//   const [file, setFile] = useState("");

//   // Fetch main categories from the backend
//   const fetchMaincategories = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
//       setGetMaincategories(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Fetch categories from the backend
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/admin/getcategories`);
//       setGetCategories(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Fetch dishes from the backend on component mount
//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/admin/getdishes`);
//         const data = response.data;
//         setGetDishes(data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetch();
//   }, [backendUrl]);

//   // Fetch main categories and categories on component mount
//   useEffect(() => {
//     fetchMaincategories();
//     fetchCategories();
//   }, [backendUrl]);



//   // Function to handle POST dishes
//   const postCategories = async () => {
//     const formData = new FormData();
//     formData.append("dishes", dishes);
//     formData.append("description", description);
//     formData.append("category", categories); // Ensure this is correct
//     formData.append("maincategories", maincategory);
//     formData.append("price", price);
//     formData.append("Itemnumber", Itemnumber);
//     formData.append("weight", weight);
//     formData.append("purity", purity);
//     formData.append("details", details);

//     // Append each file to formData
//     for (let i = 0; i < image.length; i++) {
//       formData.append("image", image[i]);
//     }

//     try {
//         await axios.post(`${backendUrl}/admin/postdishes`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         window.location.reload(); // Refresh page after successful post
//     } catch (err) {
//         console.log(err);
//     }
// };

//   const updateCategories = async () => {
//   const formdata = new FormData();
//   formdata.append("dishes", getDishesById.dishes);
//   formdata.append("description", getDishesById.description);
//   formdata.append("price", getDishesById.price);
//   formdata.append("maincategories", maincategory); // Ensure maincategory is correctly set
//   formdata.append("category", categories); // Ensure categories is correctly set
//   formdata.append("Itemnumber", getDishesById.Itemnumber);
//   formdata.append("weight", getDishesById.weight);
//   formdata.append("purity", getDishesById.purity);
//   formdata.append("details", getDishesById.details);
//   if (file) {
//     formdata.append("image", file);
//   }

//   try {
//     await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formdata);
//     window.location.reload(); // Refresh page after successful update
//   } catch (err) {
//     console.log(err);
//   }
// };

// const handleOn = async (id) => {
//   setOn(true);
//   setUid(id);

//   try {
//     const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
//     const data = response.data;
//     setGetDishesById({
//       dishes: data.dishes,
//       price: data.price,
//       description: data.description,
//       Itemnumber: data.Itemnumber,
//       weight: data.weight,
//       purity: data.purity,
//       details: data.details,
//       image: data.image,
//     });
//     setMaincategory(data.maincategories); // Set selected main category
//     setCategories(data.categories); // Set selected category
//     console.log(data.price, "this is data");
//   } catch (err) {
//     console.log(err);
//   }
// };

// const handleUpdateChange = (e) => {
//   const { name, value } = e.target;
//   setGetDishesById((prevState) => ({
//     ...prevState,
//     [name]: value,
//   }));
// };

// // const handleImage = (e) => {
// //   setFile(e.target.files[0]);
// // };
  

//     // Function to handle deletion of dishes
//     const handleDelete = async (id) => {
//       const windowConfirmation = window.confirm("Are you sure to Delete this item");
//       if (windowConfirmation) {
//         try {
//           await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//           window.location.reload(); // Refresh page after successful deletion
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };
  

//   //filtering of categories by its corresponding main category
//   const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === maincategory);


//   // JSX rendering with dynamic data
//   return (
//     <div>
//       <SideNav />
//       <div className="whole">
//         <div className=" main-contenet">
//           <div className="pl-3 row main-row">
//             <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                  style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
//               <h2 style={{color:"#b20769"}}><b>ITEMS</b></h2>
//               <Tooltip className="add_btn" title="Add">
//                 <IoIosAddCircle className="add_btn" onClick={handleShow} />
//               </Tooltip>
//             </div>
//             <div className="container table-responsive">
//               <table className="table table-striped table-bordered">
//                 <thead className="thead-dark">
//                   <tr>
//                     <th scope="col">Image</th>
//                     <th scope="col">Item Number</th>
//                     <th scope="col">Name</th>
//                     <th scope="col">Description</th>
//                     <th scope="col">Price</th>
//                     <th scope="col">Weight</th>
//                     <th scope="col">Purity</th>
//                     <th scope="col">Details</th>
//                     <th scope="col">Category</th>
//                     <th scope="col">Main Category</th>
//                     <th scope="col">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {getDishes.map((items, index) => (
//                     <tr key={index}>
//                       <td>
//                         <div className="image-container">
//                           {items.image.map((image, idx) => (
//                             <img key={idx} className="avatar" src={`${backendUrl}/images/${image}`} alt={`Image ${idx + 1}`} />
//                           ))}
//                         </div>
//                       </td>
//                       <td className="text-black item-text">{items.Itemnumber}</td>
//                       <td className="text-black item-text"><b>{items.dishes}</b></td>
//                       <td className="text-black item-text">{items.description}</td>
//                       <td className="text-black item-text">₹ {items.price}</td>
//                       <td className="text-black item-text">{items.weight}</td>
//                       <td className="text-black item-text">{items.purity}</td>
//                       <td className="text-black item-text">{items.details}</td>
//                       <td className="text-black item-text">
//                         {items.category ? items.category.name : ''}
//                       </td>
//                       <td className="text-black item-text">
//                         {items.category && items.category.maincategoriesData ? items.category.maincategoriesData.maincategories : ''}
//                       </td>
//                       <td>
//                         <Tooltip title="Edit">
//                           <FiEdit style={{ color: "black", cursor: "pointer" }} onClick={() => handleOn(items._id)} />
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <MdDelete style={{ color: "black", cursor: "pointer" }} onClick={() => handleDelete(items._id)} />
//                         </Tooltip>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
               
              
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal for adding dishes */}
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add jewellery products</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* Input fields for adding dishes */}
//           <input className="my-3 input-style" style={{ width: "100%" }} type="file" name="image"  multiple    onChange={handleImage} />
//           <input className="input-style" placeholder="item-number" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setItemnumber(e.target.value)} />
//           <input className="input-style" placeholder="products" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setDishes(e.target.value)} />
//           <textarea className="input-style" placeholder="description" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setDescription(e.target.value)}></textarea>

//           {/* Dropdown for selecting Main Category */}
//           <select className="my-3 input-style" onChange={(e) => setMaincategory(e.target.value)} value={maincategory} style={{ width: "100%", marginBottom: '1rem' }}>
//             <option value="">Select Main Category</option>
//             {getMaincategories.map((mainCat) => (
//               <option key={mainCat._id} value={mainCat._id}>
//                 {mainCat.maincategories}
//               </option>
//             ))}
//           </select>

//           {/* Dropdown for selecting Category */}

//           <select
//                 className="my-3 input-style"
//                 onChange={(e) => setCategories(e.target.value)}
//                 value={categories}
//                 style={{ width: "100%", marginBottom: '1rem' }}
//             >
//                 <option value="">Select Category</option>
//                 {filteredCategories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                         {cat.name}
//                     </option>
//                 ))}
//           </select>

         

//           {/* Input fields for other details */}
//           <input className="input-style" placeholder="Price" type="number" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setPrice(e.target.value)} />
//           <input className="input-style" placeholder="weight" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setWeight(e.target.value)} />
//           <input className="input-style" placeholder="purity" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setPurity(e.target.value)} />
//           <textarea className="input-style" placeholder="details" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setDetails(e.target.value)}></textarea>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={postCategories}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={on} onHide={handleOff} className="montserrat-400">
//         <Modal.Header closeButton>
//           <Modal.Title>Add jewellery products</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* Input fields for adding dishes */}
//           <input className="my-3 input-style" style={{ width: "100%" }} type="file" name="image" multiple onChange={handleImage} />
//           <input className="input-style" placeholder="item-number" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="Itemnumber" value={getDishesById.Itemnumber} onChange={handleUpdateChange} />
//           <input className="input-style" placeholder="products" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="dishes" value={getDishesById.dishes} onChange={handleUpdateChange} />
//           <textarea className="input-style" placeholder="description" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="description" value={getDishesById.description} onChange={handleUpdateChange}></textarea>

//           {/* Dropdown for selecting Main Category */}
//           <select className="my-3 input-style" onChange={(e) => setMaincategory(e.target.value)} value={maincategory} style={{ width: "100%", marginBottom: '1rem' }}>
//             <option value="">Select Main Category</option>
//             {getMaincategories.map((mainCat) => (
//               <option key={mainCat._id} value={mainCat._id}>
//                 {mainCat.maincategories}
//               </option>
//             ))}
//           </select>

//           {/* Dropdown for selecting Category */}
//           <select className="my-3 input-style" onChange={(e) => setCategories(e.target.value)} value={categories} style={{ width: "100%", marginBottom: '1rem' }}>
//             <option value="">Select Category</option>
//             {filteredCategories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           {/* Input fields for other details */}
//           <input className="input-style" placeholder="Price" type="number" style={{ width: "100%", marginBottom: '1rem' }} name="price" value={getDishesById.price} onChange={handleUpdateChange} />
//           <input className="input-style" placeholder="weight" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="weight" value={getDishesById.weight} onChange={handleUpdateChange} />
//           <input className="input-style" placeholder="purity" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="purity" value={getDishesById.purity} onChange={handleUpdateChange} />
//           <textarea className="input-style" placeholder="details" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="details" value={getDishesById.details} onChange={handleUpdateChange}></textarea>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleOff}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={updateCategories}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>
     


//     </div>
//   );
// }

// export default Dishes;
