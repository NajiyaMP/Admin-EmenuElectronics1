import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import { Button, Modal } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";

function Couponsdemo() {
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
    description:"",
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

  const handleClose = () => setShow(false);
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
        <div className=" main-contenet">
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

                    <th scope="col">internalstorage</th>
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
                      <td className="text-black item-text">{items.Itemnumber}</td>
                      <td className="text-black item-text"><b>{items.dishes}</b></td>
                      <td className="text-black item-text">{items.description}</td>
                      <td className="text-black item-text">{items.price}</td>
                      <td className="text-black item-text">{items.color}</td>

                      <td className="text-black item-text">{items.ram}</td>
                      <td className="text-black item-text">{items.internalstorage}</td>
                      <td className="text-black item-text">{items.features}</td>
                      <td>{items.mainCategory?.maincategories || 'No Main Category'}</td>
                      <td>{items.category?.name || 'No Category'}</td>
                      <td>{items.subcategory?.name || 'No Subcategory'}</td>
                      <td className="text-black item-text">
                        <Tooltip title="Edit">
                          <Button onClick={() => handleOn(items._id)} className="btn btn-primary">
                            <FiEdit />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button onClick={() => handleDelete(items._id)} className="btn btn-danger">
                            <MdDelete />
                          </Button>
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
      
      {/* Modal for adding/editing dishes */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add/Edit Dishes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form> 
              <label>Item Number</label>
                <input type="text" className="form-control" value={Itemnumber} onChange={(e) => setItemnumber(e.target.value)} />   
              <label>Product</label>
                <input type="text" className="form-control" value={dishes} onChange={(e) => setDishes(e.target.value)} />
              <label>Price</label>
                <input type="text" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />     
              <label>Description</label>       
                <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
              <label>Internal Storage</label>
                <input type="text" className="form-control" value={internalstorage} onChange={(e) => setInternalstorage(e.target.value)} />                 
              <label>Color</label>                 
                <input type="text" className="form-control" value={color} onChange={(e) => setColor(e.target.value)} />
              <label>Ram</label>
                <input type="text" className="form-control" value={ram} onChange={(e) => setRam(e.target.value)} />
              <label>Features</label>                
                <input type="text" className="form-control" value={features} onChange={(e) => setFeatures(e.target.value)} />
             
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
              <div className="form-group">
                <label htmlFor="image">Upload Images</label>
                <input type="file" className="form-control-file" id="image" multiple onChange={handleImage} />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={() => {
            if (uid) {
              updateDishes();
            } else {
              postDishes();
            }
            handleClose();
          }}>
            {uid ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>

      
    </div>
  );
}

export default Couponsdemo;