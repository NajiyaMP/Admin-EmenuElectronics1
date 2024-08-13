import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import { Button, Modal } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";

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
  const [weight, setWeight] = useState("");
  const [purity, setPurity] = useState("");
  const [details, setDetails] = useState("");
  const [maincategory, setMaincategory] = useState('');
  const [categories, setCategories] = useState('');
  const [getMaincategories, setGetMaincategories] = useState([]);
  const [getCategories, setGetCategories] = useState([]);
  const [getCategoriesById, setGetCategoriesById] = useState([]);
  const [getDishes, setGetDishes] = useState([]);
  const [getDishesById, setGetDishesById] = useState({
    dishes: "",
    price: "",
    description:"",
    Itemnumber: "",
    weight: "",
    purity: "",
    details: "",
  });


  


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleOff = () => setOn(false);
  const [files, setFiles] = useState("");

  // Fetch main categories from the backend
  const fetchMaincategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
      setGetMaincategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/getcategories`);
      setGetCategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch dishes from the backend on component mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin/getdishes`);
        const data = response.data;
        setGetDishes(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [backendUrl]);

  // Fetch main categories and categories on component mount
  useEffect(() => {
    fetchMaincategories();
    fetchCategories();
  }, [backendUrl]);



  // Function to handle POST dishes
  const postCategories = async () => {
    const formData = new FormData();
    formData.append("dishes", dishes);
    formData.append("description", description);
    formData.append("category", categories); // Ensure this is correct
    formData.append("maincategories", maincategory);
    formData.append("price", price);
    formData.append("Itemnumber", Itemnumber);
    formData.append("weight", weight);
    formData.append("purity", purity);
    formData.append("details", details);

    // Append each file to formData
    for (let i = 0; i < image.length; i++) {
      formData.append("image", image[i]);
    }

    try {
        await axios.post(`${backendUrl}/admin/postdishes`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        window.location.reload(); // Refresh page after successful post
    } catch (err) {
        console.log(err);
    }
};


const updateCategories = async () => {
  const formdata = new FormData();
  formdata.append("dishes", getDishesById.dishes);
  formdata.append("description", getDishesById.description);
  formdata.append("price", getDishesById.price);
  formdata.append("maincategories", maincategory); // Ensure maincategory is correctly set
  formdata.append("category", categories); // Ensure categories is correctly set
  formdata.append("Itemnumber", getDishesById.Itemnumber);
  formdata.append("weight", getDishesById.weight);
  formdata.append("purity", getDishesById.purity);
  formdata.append("details", getDishesById.details);
  
  if (files.length > 0) {
    files.forEach((file) => {
      formdata.append("images", file);
    });
  }
  try {
    await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formdata);
    window.location.reload(); // Refresh page after successful update
  } catch (err) {
    console.log(err);
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
      weight: data.weight,
      purity: data.purity,
      details: data.details,
      images: data.images, // Assuming API returns an array of images
    });
    setMaincategory(data.maincategories); // Set selected main category
    setCategories(data.categories); // Set selected category
    console.log(data.price, "this is data");
  } catch (err) {
    console.log(err);
  }
};

const handleUpdateChange = (e) => {
  const { name, value } = e.target;
  setGetDishesById((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};

const handleImage = (e) => {
  const selectedFiles = Array.from(e.target.files);
  setFiles(selectedFiles);
};

// const updateCategories = async () => {
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

// const handleImage = (e) => {
//   const setUpImage = Array.from(e.target.files);
//   setImage(setUpImage);
// };
  

    // Function to handle deletion of dishes
    const handleDelete = async (id) => {
      const windowConfirmation = window.confirm("Are you sure to Delete this item");
      if (windowConfirmation) {
        try {
          await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
          window.location.reload(); // Refresh page after successful deletion
        } catch (err) {
          console.log(err);
        }
      }
    };
  

  //filtering of categories by its corresponding main category
  
  
  const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === maincategory);


  // JSX rendering with dynamic data
  return (
    <div>
      <SideNav />
      <div className="whole">
        <div className=" main-contenet">
          <div className="pl-3 row main-row">
            <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
                 style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <h2 style={{color:"#b20769"}}><b>ITEMS</b></h2>
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
                    <th scope="col">Weight</th>
                    <th scope="col">Purity</th>
                    <th scope="col">Details</th>
                    <th scope="col">Category</th>
                    <th scope="col">Main Category</th>
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
                      <td className="text-black item-text">₹ {items.price}</td>
                      <td className="text-black item-text">{items.weight}</td>
                      <td className="text-black item-text">{items.purity}</td>
                      <td className="text-black item-text">{items.details}</td>
                      <td className="text-black item-text">
                        {items.category ? items.category.name : ''}
                      </td>
                      <td className="text-black item-text">
                        {items.category && items.category.maincategoriesData ? items.category.maincategoriesData.maincategories : ''}
                      </td>
                      <td>
                        <Tooltip title="Edit">
                          <FiEdit style={{ color: "black", cursor: "pointer" }} onClick={() => handleOn(items._id)} />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <MdDelete style={{ color: "black", cursor: "pointer" }} onClick={() => handleDelete(items._id)} />
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

      {/* Modal for adding dishes */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add jewellery products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Input fields for adding dishes */}
          <input className="my-3 input-style" style={{ width: "100%" }} type="file" name="image"  multiple    onChange={handleImage} />
          <input className="input-style" placeholder="item-number" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setItemnumber(e.target.value)} />
          <input className="input-style" placeholder="products" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setDishes(e.target.value)} />
          <textarea className="input-style" placeholder="description" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setDescription(e.target.value)}></textarea>

          {/* Dropdown for selecting Main Category */}
          <select className="my-3 input-style" onChange={(e) => setMaincategory(e.target.value)} value={maincategory} style={{ width: "100%", marginBottom: '1rem' }}>
            <option value="">Select Main Category</option>
            {getMaincategories.map((mainCat) => (
              <option key={mainCat._id} value={mainCat._id}>
                {mainCat.maincategories}
              </option>
            ))}
          </select>

          {/* Dropdown for selecting Category */}

          <select
                className="my-3 input-style"
                onChange={(e) => setCategories(e.target.value)}
                value={categories}
                style={{ width: "100%", marginBottom: '1rem' }}
            >
                <option value="">Select Category</option>
                {filteredCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
          </select>

         

          {/* Input fields for other details */}
          <input className="input-style" placeholder="Price" type="number" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setPrice(e.target.value)} />
          <input className="input-style" placeholder="weight" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setWeight(e.target.value)} />
          <input className="input-style" placeholder="purity" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setPurity(e.target.value)} />
          <textarea className="input-style" placeholder="details" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setDetails(e.target.value)}></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={postCategories}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={on} onHide={handleOff} className="montserrat-400">
        <Modal.Header closeButton>
          <Modal.Title>edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Input fields for adding dishes */}
          <input className="my-3 input-style" style={{ width: "100%" }} type="file" name="image" multiple onChange={handleUpdateChange}/>
          <input className="input-style" placeholder="item-number" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="Itemnumber" value={getDishesById.Itemnumber} onChange={handleUpdateChange} />
          <input className="input-style" placeholder="products" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="dishes" value={getDishesById.dishes} onChange={handleUpdateChange} />
          <textarea className="input-style" placeholder="description" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="description" value={getDishesById.description} onChange={handleUpdateChange}></textarea>

          {/* Dropdown for selecting Main Category */}
          <select className="my-3 input-style" onChange={(e) => setMaincategory(e.target.value)} value={maincategory} style={{ width: "100%", marginBottom: '1rem' }}>
            <option value="">Select Main Category</option>
            {getMaincategories.map((mainCat) => (
              <option key={mainCat._id} value={mainCat._id}>
                {mainCat.maincategories}
              </option>
            ))}
          </select>

          {/* Dropdown for selecting Category */}
          <select className="my-3 input-style" onChange={(e) => setCategories(e.target.value)} value={categories} style={{ width: "100%", marginBottom: '1rem' }}>
            <option value="">Select Category</option>
            {filteredCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Input fields for other details */}
          <input className="input-style" placeholder="Price" type="number" style={{ width: "100%", marginBottom: '1rem' }} name="price" value={getDishesById.price} onChange={handleUpdateChange} />
          <input className="input-style" placeholder="weight" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="weight" value={getDishesById.weight} onChange={handleUpdateChange} />
          <input className="input-style" placeholder="purity" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="purity" value={getDishesById.purity} onChange={handleUpdateChange} />
          <textarea className="input-style" placeholder="details" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="details" value={getDishesById.details} onChange={handleUpdateChange}></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOff}>
            Close
          </Button>
          <Button variant="primary" onClick={updateCategories}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
     


    </div>
  );
}

export default Dishes;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function Categories() {
//     const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//     const [show, setShow] = useState(false);
//     const [categories, setCategories] = useState('');
//     const [getCategories, setGetCategories] = useState([]);
//     const [maincategory, setMaincategory] = useState(''); // State for main category
//     const [getMaincategories, setGetMaincategories] = useState([]);

//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getcategories`);
//             setGetCategories(response.data);
//         } catch (err) {
//             console.error('Error fetching categories:', err);
//         }
//     };
    
//     const fetchMainCategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
//             setGetMaincategories(response.data);
//         } catch (err) {
//             console.error('Error fetching main categories:', err);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//         fetchMainCategories();
//     }, [backendUrl]);

//     // Filter categories based on main category selection
//     const filteredCategories = getCategories.filter(category => category.maincategoriesData.toString() === maincategory.toString());

//     return (
//         <div>
//             <div className="form-group">
//                 <label htmlFor="mainCategory">Main Category:</label>
//                 <select
//                     className="form-control"
//                     value={maincategory}
//                     onChange={(e) => setMaincategory(e.target.value)}
//                 >
//                     <option value="">Select Main Category</option>
//                     {getMaincategories.map((mainCat) => (
//                         <option key={mainCat._id} value={mainCat._id}>
//                             {mainCat.maincategories}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <div className="form-group">
//                 <label htmlFor="category">Category:</label>
//                 <select
//                     className="form-control"
//                     value={categories}
//                     onChange={(e) => setCategories(e.target.value)}
//                 >
//                     <option value="">Select Category</option>
//                     {filteredCategories.map((cat) => (
//                         <option key={cat._id} value={cat._id}>
//                             {cat.categories}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <button onClick={handleShow}>Add Category</button>
//             {/* Add modal or form for adding categories */}
//         </div>
//     );
// }

// export default Categories;


// import React, { useEffect, useState } from "react";
// import SideNav from "./SideNav";
// import { Button, Modal } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";
// import axios from "axios";
// import { Link } from "react-router-dom";

// function Dishes() {
//   const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//   const [uid, setUid] = useState("");
//   const [show, setShow] = useState(false);
//   const [on, setOn] = useState(false);
//   const [dishes, setDishes] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState("");
//   const [Itemnumber, setItemnumber] = useState("");
//   const [weight, setWeight] = useState("");
//   const [purity, setPurity] = useState("");
//   const [details, setDetails] = useState("");
//   const [maincategory, setMaincategory] = useState('');
//   const [categories, setCategories] = useState('');
//   const [getMaincategories, setGetMaincategories] = useState([]);
//   const [getCategories, setGetCategories] = useState([]);
//   const [getDishes, setGetDishes] = useState([]);
//   const [getDishesById, setGetDishesById] = useState({
//     dishes: "",
//     price: "",
//     description:"",
//     Itemnumber: "",
//     weight: "",
//     purity: "",
//     details: "",
//     categories: ""
//   });

//   // Fetch main categories from backend
//   const fetchMaincategories = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
//       setGetMaincategories(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Fetch categories from backend
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/admin/getcategories`);
//       setGetCategories(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Fetch dishes from backend on component mount
//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/admin/getdishes`);
//         setGetDishes(response.data);
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
//   }, [backendUrl]); // Fetch data whenever backendUrl changes or component mounts

//   // Function to handle form submission for adding new dish
//   const postCategories = async () => {
//     const formdata = new FormData();
//     formdata.append("dishes", dishes);
//     formdata.append("description", description);
//     formdata.append("categories", categories);
//     formdata.append("maincategories", maincategory);
//     formdata.append("price", price);
//     formdata.append("image", image);
//     formdata.append("Itemnumber", Itemnumber);
//     formdata.append("weight", weight);
//     formdata.append("purity", purity);
//     formdata.append("details", details);

//     try {
//       await axios.post(`${backendUrl}/admin/postdishes`, formdata);
//       window.location.reload(); // Refresh page after successful submission (not recommended for production)
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Function to handle edit button click
//   const handleOn = async (id) => {
//     setOn(true);
//     setUid(id);

//     try {
//       const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
//       const data = response.data;
//       setGetDishesById({
//         dishes: data.dishes,
//         price: data.price,
//         description: data.description,
//         Itemnumber: data.Itemnumber,
//         weight: data.weight,
//         purity: data.purity,
//         details: data.details,
//         categories: data.categories
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Function to handle changes in the edit form inputs
//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setGetDishesById((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Function to handle update action for dishes
//   const updateCategories = async () => {
//     const formdata = new FormData();
//     formdata.append("dishes", getDishesById.dishes);
//     formdata.append("description", getDishesById.description);
//     formdata.append("price", getDishesById.price);
//     formdata.append("categories", getDishesById.categories);
//     formdata.append("Itemnumber", getDishesById.Itemnumber);
//     formdata.append("weight", getDishesById.weight);
//     formdata.append("purity", getDishesById.purity);
//     formdata.append("details", getDishesById.details);
//     formdata.append("image", image);

//     try {
//       await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formdata);
//       window.location.reload(); // Refresh page after successful update (not recommended for production)
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Function to handle delete action for dishes
//   const handleDelete = async (id) => {
//     const windowConfirmation = window.confirm("Are you sure to Delete this item");
//     if (windowConfirmation) {
//       try {
//         await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//         window.location.reload(); // Refresh page after successful deletion (not recommended for production)
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };

//   // Filtered categories based on main category selection
//   const filteredCategories = getCategories.filter(category => category.maincategoriesData.toString() === maincategory.toString());

//   return (
//     <div>
//       <SideNav />
//       <div className="whole">
//         <div className=" main-contenet">
//           <div className="pl-3 row main-row">
//             <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//               style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <h
