import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import { Button, Modal, Form } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";

function Coupon() {
  const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
  const [uid, setUid] = useState("");
  const [show, setShow] = useState(false);
  const [couponName, setCouponName] = useState("");
  const [discount, setDiscount] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [active, setActive] = useState(false);

  const [getCoupons, setGetCoupons] = useState([]);
  const [getCouponsById, setGetCouponsById] = useState({
    couponName: "",
    discount: "",
    minDiscount: "",
    startingDate: "",
    expiryDate: "",
    active: false
  });

  const handleClose = () => {
    setShow(false);
    setUid("");
    resetForm();
  };
  const handleShow = () => setShow(true);

  // Reset form fields
  const resetForm = () => {
    setCouponName("");
    setDiscount("");
    setMinDiscount("");
    setStartingDate("");
    setExpiryDate("");
    setActive(false);
  };

  // Fetch all coupons
  useEffect(() => {
    const fetchData = async () => {
      try {
        const couponsResponse = await axios.get(`${backendUrl}/admin/coupons`);
        setGetCoupons(couponsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [backendUrl]);

  // Function to handle POST coupons
  const postCoupon = async () => {
    const formData = {
      couponName,
      discount,
      minDiscount,
      startingDate,
      expiryDate,
      active
    };
    try {
      await axios.post(`${backendUrl}/admin/coupon`, formData);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle PUT coupons
  const updateCoupon = async () => {
    const formData = {
      couponName: getCouponsById.couponName,
      discount: getCouponsById.discount,
      minDiscount: getCouponsById.minDiscount,
      startingDate: getCouponsById.startingDate,
      expiryDate: getCouponsById.expiryDate,
      active: getCouponsById.active
    };

    try {
      await axios.put(`${backendUrl}/admin/coupon/${uid}`, formData);
      window.location.reload();
    } catch (err) {
      console.error('Error updating coupon:', err);
    }
  };

  // Function to handle GET coupon by ID
  const handleOn = async (id) => {
    setShow(true);
    setUid(id);

    try {
      const response = await axios.get(`${backendUrl}/admin/coupon/${id}`);
      const data = response.data;
      setGetCouponsById({
        couponName: data.couponName,
        discount: data.discount,
        minDiscount: data.minDiscount,
        startingDate: data.startingDate,
        expiryDate: data.expiryDate,
        active: data.active
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle DELETE coupon by ID
  const handleDelete = async (id) => {
    const windowConfirmation = window.confirm("Are you sure to delete this coupon?");
    if (windowConfirmation) {
      try {
        await axios.delete(`${backendUrl}/admin/coupon/${id}`);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Function to handle change in update form inputs
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setGetCouponsById(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <SideNav />
      <div className="whole">
        <div className="main-content">
          <div className="pl-3 row main-row">
            <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
                 style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <h2><b>COUPONS</b></h2>
              <Tooltip className="add_btn" title="Add">
                <IoIosAddCircle className="add_btn" onClick={handleShow} />
              </Tooltip>
             
            </div>
            {getCoupons.map((data, index) => (
              <div key={index} className="d-flex m-2">
                <div className="card shadow p-2" style={{width: "18rem"}}>
                  <div className="card-body">
                    <h5 className="card-title">{data.couponName}</h5>
                    <p className="card-text">Discount: {data.discount}%</p>
                    <p className="card-text">Minimum Discount: {data.minDiscount}</p>
                    <p className="card-text">Starting Date: {data.startingDate}</p>
                    <p className="card-text">Expiry Date: {data.expiryDate}</p>
                    <p className="card-text">Active: {data.active ? "Yes" : "No"}</p>
                    <div className="d-flex justify-content-between">
                      <Tooltip title="Edit" onClick={() => handleOn(data._id)}>
                        <FiEdit style={{cursor: "pointer"}} />
                      </Tooltip>
                      <Tooltip title="Delete" onClick={() => handleDelete(data._id)}>
                        <MdDelete style={{cursor: "pointer"}} />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{uid ? "Update Coupon" : "Add Coupon"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Coupon Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter coupon name"
                name="couponName"
                value={uid ? getCouponsById.couponName : couponName}
                onChange={(e) => uid ? handleUpdateChange(e) : setCouponName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter discount"
                name="discount"
                value={uid ? getCouponsById.discount : discount}
                onChange={(e) => uid ? handleUpdateChange(e) : setDiscount(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Minimum Discount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter minimum discount"
                name="minDiscount"
                value={uid ? getCouponsById.minDiscount : minDiscount}
                onChange={(e) => uid ? handleUpdateChange(e) : setMinDiscount(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Starting Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter starting date"
                name="startingDate"
                value={uid ? getCouponsById.startingDate : startingDate}
                onChange={(e) => uid ? handleUpdateChange(e) : setStartingDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter expiry date"
                name="expiryDate"
                value={uid ? getCouponsById.expiryDate : expiryDate}
                onChange={(e) => uid ? handleUpdateChange(e) : setExpiryDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Active"
                name="active"
                checked={uid ? getCouponsById.active : active}
                onChange={(e) => uid ? setGetCouponsById(prevState => ({ ...prevState, active: e.target.checked })) : setActive(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={uid ? updateCoupon : postCoupon}>
            {uid ? "Update Coupon" : "Add Coupon"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Coupon;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideNav from "./SideNav";
// import { Button, Modal } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";

// function Coupons() {
//   const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//   const [uid, setUid] = useState("");
//   const [show, setShow] = useState(false);
//   const [mainCategory, setMaincategory] = useState('');
//   const [category, setCategory] = useState('');
//   const [subcategories, setSubcategories] = useState('');
//   const [getMaincategories, setGetMaincategories] = useState([]);
//   const [getCategories, setGetCategories] = useState([]);
//   const [getSubcategories, setGetSubcategories] = useState([]);
//   const [coupons, setCoupons] = useState([]);
//   const [getCouponsById, setGetCouponsById] = useState({
//     couponName: "",
//     discount: "",
//     minDiscount: "",
//     startingDate: "",
//     expiryDate: "",
//     mainCategory: "",
//     category: "",
//     subcategory: ""
//   });


//   const [formData, setFormData] = useState({
//     couponName: "",
//     discount: "",
//     minDiscount: "",
//     startingDate: "",
//     expiryDate: "",
//     mainCategory: "",
//     category: "",
//     subcategory: ""
//   });

//   useEffect(() => {
//     fetchData();
//   }, [backendUrl]);

//   const fetchData = async () => {
//     try {
//       const [mainCatResponse, catResponse, subCatResponse, couponsResponse] = await Promise.all([
//         axios.get(`${backendUrl}/admin/getmaincategories`),
//         axios.get(`${backendUrl}/admin/getcategories`),
//         axios.get(`${backendUrl}/admin/getsubcategories`),
//         axios.get(`${backendUrl}/admin/getcoupon`)
//       ]);

//       setGetMaincategories(mainCatResponse.data);
//       setGetCategories(catResponse.data);
//       setGetSubcategories(subCatResponse.data);
//       setCoupons(couponsResponse.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleClose = () => {
//     setShow(false);
//     setUid("");
//     setFormData({
//       couponName: "",
//       discount: "",
//       minDiscount: "",
//       startingDate: "",
//       expiryDate: "",
//       mainCategory: "",
//       category: "",
//       subcategory: ""
//     });
//   };

//   const handleShow = () => setShow(true);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       if (uid) {
//         await axios.put(`${backendUrl}/admin/putcoupon/${uid}`, formData);
//       } else {
//         await axios.post(`${backendUrl}/admin/postcoupon`, formData);
//       }
//       fetchData();
//       handleClose();
//     } catch (err) {
//       console.error("Error submitting coupon:", err);
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       const response = await axios.get(`${backendUrl}/admin/getcouponbyid/${id}`);
//       const coupon = response.data;
//       setUid(id);
//       setFormData({
//         couponName: coupon.couponName,
//         discount: coupon.discount,
//         minDiscount: coupon.minDiscount,
//         startingDate: coupon.startingDate,
//         expiryDate: coupon.expiryDate,
//         mainCategory: coupon.mainCategory,
//         category: coupon.category,
//         subcategory: coupon.subcategory,
//       });
//       handleShow();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this coupon?");
//     if (confirmDelete) {
//       try {
//         await axios.delete(`${backendUrl}/admin/deletecoupon/${id}`);
//         fetchData();
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };


//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setGetCouponsById(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === mainCategory);
//   const filteredSubcategories = getSubcategories.filter(subCat => subCat.category._id === category);

//   return (
//     <div>
//       <SideNav />
//       <div className="whole">
//         <div className="main-content">
//           <div className="pl-3 row main-row">
//             <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                  style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
//               <h2><b>ADD COUPON</b></h2>
//               <Tooltip className="add_btn" title="Add">
//                 <IoIosAddCircle className="add_btn" onClick={handleShow} />
//               </Tooltip>
//             </div>
//             <div className="container table-responsive">
//               <table className="table table-striped table-bordered">
//                 <thead className="thead-dark">
//                   <tr>
//                     <th scope="col">Coupon Name</th>
//                     <th scope="col">Discount</th>
//                     <th scope="col">Minimum Discount</th>
//                     <th scope="col">Start Date</th>
//                     <th scope="col">End Date</th>
//                     <th scope="col">Main Category</th>
//                     <th scope="col">Category</th>
//                     <th scope="col">Subcategory</th>
//                     <th scope="col">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {coupons.map((coupon, index) => (
//                     <tr key={index}>
//                       <td>{coupon.couponName}</td>
//                       <td>{coupon.discount}</td>
//                       <td>{coupon.minDiscount}</td>
//                       <td>{coupon.startingDate}</td>
//                       <td>{coupon.expiryDate}</td>
//                       <td>{coupon.mainCategory?.maincategories || 'No Main Category'}</td>
//                       <td>{coupon.category?.name || 'No Category'}</td>
//                       <td>{coupon.subcategory?.name || 'No Subcategory'}</td>
//                       <td>
//                         <Tooltip title="Edit">
//                           <Button onClick={() => handleEdit(coupon._id)} className="btn btn-primary">
//                             <FiEdit />
//                           </Button>
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <Button onClick={() => handleDelete(coupon._id)} className="btn btn-danger">
//                             <MdDelete />
//                           </Button>
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
      
//       <Modal show={show} onHide={handleClose} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{uid ? "Edit Coupon" : "Add Coupon"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="container">
//             <form>
//               <div className="form-group">
//                 <label>Coupon Name</label>
//                 <input type="text" className="form-control" name="couponName" value={formData.couponName} onChange={handleInputChange} />
//               </div>
//               <div className="form-group">
//                 <label>Discount</label>
//                 <input type="text" className="form-control" name="discount" value={formData.discount} onChange={handleInputChange} />
//               </div>
//               <div className="form-group">
//                 <label>Minimum Discount</label>
//                 <input type="text" className="form-control" name="minDiscount" value={formData.minDiscount} onChange={handleInputChange} />
//               </div>
//               <div className="form-group">
//                 <label>Start Date</label>
//                 <input type="date" className="form-control" name="startingDate" value={formData.startingDate} onChange={handleInputChange} />
//               </div>
//               <div className="form-group">
//                 <label>End Date</label>
//                 <input type="date" className="form-control" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="maincategory">Main Category</label>
              
//                 <select className="form-control" id="maincategory" name="mainCategory"
//                         value={getCouponsById.mainCategory} onChange={(e) => {
//                           setMaincategory(e.target.value);
//                           handleUpdateChange(e);
//                         }}>
//                   <option value="">Select Main Category</option>
//                   {getMaincategories.map(mainCat => (
//                     <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="categories">Category</label>
//                 <select className="form-control" id="categories" name="category"
//                         value={getCouponsById.category} onChange={(e) => {
//                           setCategory(e.target.value);
//                           handleUpdateChange(e);
//                         }}>
//                   <option value="">Select Category</option>
//                   {filteredCategories.map(cat => (
//                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="subcategories">Subcategory</label>
//                 <select className="form-control" id="subcategories" name="subcategory"
//                         value={getCouponsById.subcategory} onChange={handleUpdateChange}>
//                   <option value="">Select Subcategory</option>
//                   {filteredSubcategories.map(subCat => (
//                     <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                   ))}
//                 </select>
//               </div>
              
              
              
//               <div className="form-group">
//                 <label>Main Category</label>
//                 <select className="form-control" name="mainCategory" value={formData.mainCategory} onChange={handleInputChange}>
//                   <option value="">Select Main Category</option>
//                   {getMaincategories.map(mainCat => (
//                     <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Category</label>
//                 <select className="form-control" name="category" value={formData.category} onChange={handleInputChange}>
//                   <option value="">Select Category</option>
//                   {getCategories.map(cat => (
//                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Subcategory</label>
//                 <select className="form-control" name="subcategory" value={formData.subcategory} onChange={handleInputChange}>
//                   <option value="">Select Subcategory</option>
//                   {getSubcategories.map(subCat => (
//                     <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </form>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>Close</Button>
//           <Button variant="primary" onClick={handleSubmit}>
//             {uid ? "Update" : "Add"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default Coupons;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideNav from "./SideNav";
// import { Button, Modal } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";

// function Dishes() {
//   const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//   const [uid, setUid] = useState("");
//   const [show, setShow] = useState(false);
//   const [on, setOn] = useState(false);
//   const [dishes, setDishes] = useState("");
//   const [discount, setdiscount] = useState("");
//   const [minimumDiscount, setMinimumDiscount] = useState("");
//   const [startDate, setstartDate] = useState("");
//   const [endDate, setendDate] = useState("");
//   const [maincategory, setMaincategory] = useState('');
//   const [categories, setCategories] = useState('');
//   const [subcategories, setSubcategories] = useState('');
//   const [getMaincategories, setGetMaincategories] = useState([]);
//   const [getCategories, setGetCategories] = useState([]);
//   const [getSubcategories, setGetSubcategories] = useState([]);
//   const [getDishes, setGetDishes] = useState([]);
//   const [getDishesById, setGetDishesById] = useState({
//     dishes: "",
//     discount: "",
//     description:"",
//     startDate: "",
//     endDate: "",
//     minimumDiscount:'',
//     mainCategory: "",
//     category: "",
//     subcategory: ""
//   });



//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const handleOff = () => setOn(false);

//   // Fetch main categories, categories, and subcategories
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [mainCatResponse, catResponse, subCatResponse, dishesResponse] = await Promise.all([
//           axios.get(`${backendUrl}/admin/getmaincategories`),
//           axios.get(`${backendUrl}/admin/getcategories`),
//           axios.get(`${backendUrl}/admin/getsubcategories`),
//           axios.get(`${backendUrl}/admin/getcoupon`)
//         ]);

//         setGetMaincategories(mainCatResponse.data);
//         setGetCategories(catResponse.data);
//         setGetSubcategories(subCatResponse.data);
//         setGetDishes(dishesResponse.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchData();
//   }, [backendUrl]);

//   // Function to handle POST dishes
//   const postDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", dishes);
//     formData.append("description", description);
//     formData.append("category", categories);
//     formData.append("maincategories", maincategory);
//     formData.append("subcategories", subcategories);
//     formData.append("discount", discount);
//     formData.append("minimumDiscount", minimumDiscount);
//     formData.append("endDate", endDate);
//     formData.append("startDate", startDate);

//     try {
//       await axios.post(`${backendUrl}/admin/post\coupon`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       window.location.reload();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const updateDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", getDishesById.dishes);
//     formData.append("discount", getDishesById.discount);
//     formData.append("category", getDishesById.category);
//     formData.append("maincategories", getDishesById.mainCategory);
//     formData.append("subcategories", getDishesById.subcategory);
//     formData.append("endDate", getDishesById.endDate);
//     formData.append("startDate", getDishesById.startDate);
//     formData.append("minimumDiscount", getDishesById.minimumDiscount);


 

//     try {
//       await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData);
//       window.location.reload();
//     } catch (err) {
//       console.error('Error updating dish:', err);
//     }
//   };

//   const handleOn = async (id) => {
//     setOn(true);
//     setUid(id);

//     try {
//       const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
//       const data = response.data;
//       setGetDishesById({
//         dishes: data.dishes,
//         discount: data.discount,
//         description: data.description,
//         startDate: data.startDate,
//         endDate: data.endDate,

      
//         mainCategory: data.mainCategory?._id || '',
//         category: data.category?._id || '',
//         subcategory: data.subcategory?._id || '',
//       });
//       setMaincategory(data.mainCategory?._id || '');
//       setCategories(data.category?._id || '');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setGetDishesById(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

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

//   // Filtering categories and subcategories based on main category and category
//   const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === maincategory);
//   const filteredSubcategories = getSubcategories.filter(subCat => subCat.category._id === categories);

//   return (
//     <div>
//       <SideNav />
//       <div className="whole">
//         <div className=" main-contenet">
//           <div className="pl-3 row main-row">
//             <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                  style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
//               <h2><b>ADD COUPON</b></h2>
//               <Tooltip className="add_btn" title="Add">
//                 <IoIosAddCircle className="add_btn" onClick={handleShow} />
//               </Tooltip>
//             </div>
//             <div className="container table-responsive">
//               <table className="table table-striped table-bordered">
//                 <thead className="thead-dark">
//                   <tr>
//                     <th scope="col">maincategory</th>
//                     <th scope="col">category</th>
//                     <th scope="col">subcategory</th>
//                     <th scope="col">Discount</th>
//                     <th scope="col">Minimum-Discoount</th>
//                     <th scope="col">startdate</th>
//                     <th scope="col">end date</th>
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
//                       <td className="text-black item-text">{items.startDate}</td>
//                       <td className="text-black item-text">{items.endDate}</td>
//                       <td className="text-black item-text"><b>{items.dishes}</b></td>
//                       <td className="text-black item-text">{items.discount}</td>
//                       <td className="text-black item-text">{items.minimumDiscount}</td>


//                       <td>{items.mainCategory?.maincategories || 'No Main Category'}</td>
//                       <td>{items.category?.name || 'No Category'}</td>
//                       <td>{items.subcategory?.name || 'No Subcategory'}</td>
//                       <td className="text-black item-text">
//                         <Tooltip title="Edit">
//                           <Button onClick={() => handleOn(items._id)} className="btn btn-primary">
//                             <FiEdit />
//                           </Button>
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <Button onClick={() => handleDelete(items._id)} className="btn btn-danger">
//                             <MdDelete />
//                           </Button>
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
      
//       {/* Modal for adding/editing dishes */}
//       <Modal show={show} onHide={handleClose} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Add/Edit Dishes</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="container">
//             <form> 
//               <label>start date</label>
//                 <input type="text" className="form-control" value={startDate} onChange={(e) => setstartDate(e.target.value)} />   
//               <label>start date</label>
//                 <input type="text" className="form-control" value={startDate} onChange={(e) => setstartDate(e.target.value)} />   

//               <label>End date</label>
//                 <input type="text" className="form-control" value={dishes} onChange={(e) => setDishes(e.target.value)} />
//               <label>Discount</label>
//                 <input type="text" className="form-control" value={discount} onChange={(e) => setdiscount(e.target.value)} />     
//             <label>endDate</label>
//             <input type="text" className="form-control" value={endDate} onChange={(e) => setendDate(e.target.value)} />     

//               <div className="form-group">
//                 <label htmlFor="maincategory">Main Category</label>
              
//                 <select className="form-control" id="maincategory" name="mainCategory"
//                         value={getDishesById.mainCategory} onChange={(e) => {
//                           setMaincategory(e.target.value);
//                           handleUpdateChange(e);
//                         }}>
//                   <option value="">Select Main Category</option>
//                   {getMaincategories.map(mainCat => (
//                     <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="categories">Category</label>
//                 <select className="form-control" id="categories" name="category"
//                         value={getDishesById.category} onChange={(e) => {
//                           setCategories(e.target.value);
//                           handleUpdateChange(e);
//                         }}>
//                   <option value="">Select Category</option>
//                   {filteredCategories.map(cat => (
//                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="subcategories">Subcategory</label>
//                 <select className="form-control" id="subcategories" name="subcategory"
//                         value={getDishesById.subcategory} onChange={handleUpdateChange}>
//                   <option value="">Select Subcategory</option>
//                   {filteredSubcategories.map(subCat => (
//                     <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                   ))}
//                 </select>
//               </div>
              
//             </form>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>Close</Button>
//           <Button variant="primary" onClick={() => {
//             if (uid) {
//               updateDishes();
//             } else {
//               postDishes();
//             }
//             handleClose();
//           }}>
//             {uid ? "Update" : "Add"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

      
//     </div>
//   );
// }

// export default Dishes;