import React, { useEffect, useState } from 'react';
import SideNav from './SideNav';
import { Button, Modal } from 'react-bootstrap';
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import axios from 'axios';
import { Tooltip } from '@mui/material';
import { IoIosAddCircle } from 'react-icons/io';
import SmallNav from './SmallNav';

function Subcategories() {
    const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
    const [uid, setUid] = useState('');
    const [show, setShow] = useState(false);
    const [on, setOn] = useState(false);
    const [subcategories, setSubcategories] = useState(""); 
    const [getSubcategories, setGetSubcategories] = useState([]);
    const [getSubcategoriesById, setGetSubcategoriesById] = useState({ name: "", category: "" });
    const [maincategory, setMaincategory] = useState('');
    const [categories, setCategories] = useState('');
    const [getMaincategories, setGetMaincategories] = useState([]);
    const [getCategories, setGetCategories] = useState([]);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleOff = () => setOn(false);

    // Fetch main categories from the backend
    const fetchMaincategories = async () => {
        try {
            const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
            setGetMaincategories(response.data);
        } catch (err) {
            console.error('Error fetching main categories:', err);
        }
    };

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${backendUrl}/admin/getcategories`);
            setGetCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    // Fetch subcategories from the backend
    const fetchSubcategories = async () => {
        try {
            const response = await axios.get(`${backendUrl}/admin/getsubcategories`);
            setGetSubcategories(response.data);
        } catch (err) {
            console.error('Error fetching subcategories:', err);
        }
    };

    // Post new subcategory to the backend
    const postSubcategories = async () => {
        const data = {
            name: subcategories,
            category: categories, // Assuming categories state holds the selected category ID
            maincategoriesData: maincategory // Add maincategoriesData to the data object
        };
    
        console.log('Data to be posted:', data); // Debug log
    
        try {
            await axios.post(`${backendUrl}/admin/postsubcategories`, data);
            handleClose();
            fetchSubcategories(); // Refresh subcategories after adding
        } catch (err) {
            console.error('Error posting subcategory:', err);
        }
    };
    // Fetch main categories and subcategories on component mount
    useEffect(() => {
        fetchMaincategories();
        fetchCategories();
        fetchSubcategories();
    }, [backendUrl]);

    // Handle edit action for subcategories
    const handleOn = async (id) => {
        setOn(true);
        setUid(id);
        try {
            const response = await axios.get(`${backendUrl}/admin/getsubcategoriesbyid/${id}`);
            setGetSubcategoriesById(response.data);
        } catch (err) {
            console.error('Error fetching subcategory by id:', err);
        }
    };

    // Update changes for subcategory
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setGetSubcategoriesById(prevState => ({ ...prevState, [name]: value }));
    };

    // Update subcategory details
    const updateSubcategory = async () => {
        const data = {
            name: getSubcategoriesById.name,
            category: getSubcategoriesById.category
        };
        try {
            await axios.put(`${backendUrl}/admin/putsubcategories/${uid}`, data);
            handleOff();
            fetchSubcategories(); // Refresh subcategories after updating
        } catch (err) {
            console.error('Error updating subcategory:', err);
        }
    };

    // Delete subcategory
    const handleDelete = async (id) => {
        const windowConfirmation = window.confirm('Are you sure to delete this item?');
        if (windowConfirmation) {
            try {
                await axios.delete(`${backendUrl}/admin/deletesubcategories/${id}`);
                fetchSubcategories(); // Refresh subcategories after deleting
            } catch (err) {
                console.error('Error deleting subcategory:', err);
            }
        }
    };

    // Log data on changes in subcategories and categories
    useEffect(() => {
        console.log('Subcategories:', getSubcategories);
        console.log('Categories:', getCategories);
    }, [getSubcategories, getCategories]);

    // Filter categories based on selected main category
    const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === maincategory);

    return (
        <div>
            <SmallNav />
            <SideNav />
            <div className='whole'>
                <div className="main-content">
                    <div className="pl-3 row main-row">
                        <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2><b>SUBCATEGORIES</b></h2>
                            <Tooltip className='add_btn' title='Add'>
                                <IoIosAddCircle className='add_btn' onClick={handleShow} />
                            </Tooltip>
                        </div>
                        <div className="container table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Subcategory</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Main Category</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getSubcategories.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-black item-text">{item.name}</td>
                                            <td className="text-black item-text">
                                                {item.category ? item.category.name : ''}
                                            </td>
                                            <td className="text-black item-text">
                                                {item.category && item.category.maincategoriesData ? item.category.maincategoriesData.maincategories : ''}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '20%' }}>
                                                    <FiEdit style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleOn(item._id)} />
                                                    <MdDelete style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleDelete(item._id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} className='montserrat-400'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Subcategory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        className='input-style'
                        type="text"
                        placeholder="Subcategory Name"
                        style={{ width: '100%' }}
                        onChange={(e) => setSubcategories(e.target.value)}
                    />
                    <select
                        className="my-3 input-style"
                        onChange={(e) => setMaincategory(e.target.value)}
                        value={maincategory}
                        style={{ width: "100%", marginBottom: '1rem' }}
                    >
                        <option value="">Select Main Category</option>
                        {getMaincategories.map((mainCat) => (
                            <option key={mainCat._id} value={mainCat._id}>
                                {mainCat.maincategories}
                            </option>
                        ))}
                    </select>

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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={postSubcategories}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* <Modal show={show} onHide={handleClose} className='montserrat-400'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Subcategory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input className='input-style' type="text" placeholder="Subcategory Name" style={{ width: '100%' }} onChange={(e) => setSubcategories(e.target.value)} />
                    <select className="my-3 input-style" onChange={(e) => setMaincategory(e.target.value)} value={maincategory} style={{ width: "100%", marginBottom: '1rem' }}>
                        <option value="">Select Main Category</option>
                        {getMaincategories.map((mainCat) => (
                            <option key={mainCat._id} value={mainCat._id}>
                                {mainCat.maincategories}
                            </option>
                        ))}
                    </select>

                  
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

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={postSubcategories}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal> */}

            <Modal show={on} onHide={handleOff} className='montserrat-400'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Subcategory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        value={getSubcategoriesById.name || ''}
                        name='name'
                        className='input-style'
                        type="text"
                        placeholder="Subcategory Name"
                        style={{ width: '100%' }}
                        onChange={handleUpdateChange}
                    />
                    <select className='input-style' onChange={(e) => setMaincategory(e.target.value)} value={maincategory} style={{ width: "100%", marginBottom: '1rem' }}>
                        <option value="">Select Main Category</option>
                        {getMaincategories.map((mainCat) => (
                            <option key={mainCat._id} value={mainCat._id}>
                                {mainCat.maincategories}
                            </option>
                        ))}
                    </select>

                   
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

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleOff}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateSubcategory}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Subcategories;


// import React, { useEffect, useState } from 'react';
// import SideNav from './SideNav';
// import { Button, Modal } from 'react-bootstrap';
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import axios from 'axios';
// import { Tooltip } from '@mui/material';
// import { IoIosAddCircle } from 'react-icons/io';
// import SmallNav from './SmallNav';

// function Subcategories() {
//     const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//     const [uid, setUid] = useState('');
//     const [show, setShow] = useState(false);
//     const [on, setOn] = useState(false);
//     const [subcategories, setSubcategories] = useState('');
//     const [getSubcategories, setGetSubcategories] = useState([]);
//     const [getSubcategoriesById, setGetSubcategoriesById] = useState({ name: "", category: "" });
//     const [maincategory, setMaincategory] = useState('');
//     const [categories, setCategories] = useState('');
//     const [getMaincategories, setGetMaincategories] = useState([]);
//     const [getCategories, setGetCategories] = useState([]);
//     const [getCategoriesById, setGetCategoriesById] = useState([]);
  
//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
//     const handleOff = () => setOn(false);

//     const fetchMaincategories = async () => {
//         try {
//           const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
//           setGetMaincategories(response.data);
//         } catch (err) {
//           console.log(err);
//         }
//       };
    
//       // Fetch categories from the backend
//       const fetchCategories = async () => {
//         try {
//           const response = await axios.get(`${backendUrl}/admin/getcategories`);
//           setGetCategories(response.data);
//         } catch (err) {
//           console.log(err);
//         }
//       };
    
//       useEffect(() => {
//         fetchMaincategories();
//         fetchCategories();
//     }, [backendUrl]);
    
//     const postSubcategories = async () => {
//         const data = {
//             name: subcategories,
//             category: categories // Assuming categories state holds the selected category ID
//         };
//         try {
//             await axios.post(`${backendUrl}/admin/postsubcategories`, data);
//             handleClose();
//             fetchSubcategories();
//         } catch (err) {
//             console.error('Error posting subcategory:', err);
//         }
//     };

//     const fetchSubcategories = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getsubcategories`);
//             setGetSubcategories(response.data);
//         } catch (err) {
//             console.error('Error fetching subcategories:', err);
//         }
//     };

//     const handleOn = async (id) => {
//         setOn(true);
//         setUid(id);
//         try {
//             const response = await axios.get(`${backendUrl}/admin/getsubcategoriesbyid/${id}`);
//             setGetSubcategoriesById(response.data);
//         } catch (err) {
//             console.error('Error fetching subcategory by id:', err);
//         }
//     };

//     const handleUpdateChange = (e) => {
//         const { name, value } = e.target;
//         setGetSubcategoriesById(prevState => ({ ...prevState, [name]: value }));
//     };

//     const updateSubcategory = async () => {
//         const data = {
//             name: getSubcategoriesById.name,
//             category: getSubcategoriesById.category
//         };
//         try {
//             await axios.put(`${backendUrl}/admin/putsubcategories/${uid}`, data);
//             handleOff();
//             fetchSubcategories();
//         } catch (err) {
//             console.error('Error updating subcategory:', err);
//         }
//     };
//     const handleDelete = async (id) => {
//         const windowConfirmation = window.confirm('Are you sure to delete this item?');
//         if (windowConfirmation) {
//             try {
//                 await axios.delete(`${backendUrl}/admin/deletesubcategories/${id}`);
//                 fetchSubcategories();
//             } catch (err) {
//                 console.error('Error deleting subcategory:', err);
//             }
//         }
//     };

//     useEffect(() => {
//         fetchSubcategories();
//         fetchMaincategories();
//     }, [backendUrl]);

//     useEffect(() => {
//         console.log('Subcategories:', getSubcategories);
//         console.log('Categories:', getCategories);
//     }, [getSubcategories, getCategories]);

//   //filtering of categories by its corresponding main category
//   const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === maincategory);

//     return (
//         <div>
//             <SmallNav />
//             <SideNav />
//             <div className='whole'>
//                 <div className="main-content">
//                     <div className="pl-3 row main-row">
//                         <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                             <h2><b>SUBCATEGORIES</b></h2>
//                             <Tooltip className='add_btn' title='Add'>
//                                 <IoIosAddCircle className='add_btn' onClick={handleShow} />
//                             </Tooltip>
//                         </div>
//                         <div className="container table-responsive">
//                             <table className="table table-striped table-bordered">
//                                 <thead className="thead-dark">
//                                     <tr>
//                                         <th scope="col">Subcategory</th>
//                                         <th scope="col">Category</th>
//                                         <th scope="col">Main Category</th>
//                                         <th scope="col">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {getSubcategories.map((item, index) => (
//                                         <tr key={index}>
//                                             <td className="text-black item-text">{item.name}</td>
//                                             <td className="text-black item-text">
//                                                 {item.category ? item.category.name : ''}
//                                             </td>
//                                             <td className="text-black item-text">
//                                                 {item.category && item.category.maincategoriesData ? item.category.maincategoriesData.maincategories : ''}
//                                             </td>                                            <td>
//                                                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '20%' }}>
//                                                     <FiEdit style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleOn(item._id)} />
//                                                     <MdDelete style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleDelete(item._id)} />
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Modal show={show} onHide={handleClose} className='montserrat-400'>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Add Subcategory</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <input className='input-style' type="text" placeholder="Subcategory Name" style={{ width: '100%' }} onChange={(e) => setSubcategories(e.target.value)} />
//                     <select className="my-3 input-style" onChange={(e) => setMaincategory(e.target.value)} value={maincategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                         <option value="">Select Main Category</option>
//                         {getMaincategories.map((mainCat) => (
//                             <option key={mainCat._id} value={mainCat._id}>
//                                 {mainCat.maincategories}
//                             </option>
//                         ))}
//                     </select>

//                     {/* Dropdown for selecting Category */}
//                     <select
//                         className="my-3 input-style"
//                         onChange={(e) => setCategories(e.target.value)}
//                         value={categories}
//                         style={{ width: "100%", marginBottom: '1rem' }}
//                     >
//                         <option value="">Select Category</option>
//                         {filteredCategories.map((cat) => (
//                             <option key={cat._id} value={cat._id}>
//                                 {cat.name}
//                             </option>
//                         ))}
//                     </select>

//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleClose}>
//                         Close
//                     </Button>
//                     <Button variant="primary" onClick={postSubcategories}>
//                         Save
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={on} onHide={handleOff} className='montserrat-400'>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Subcategory</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <input
//                         value={getSubcategoriesById.name || ''}
//                         name='name'
//                         className='input-style'
//                         type="text"
//                         placeholder="Subcategory Name"
//                         style={{ width: '100%' }}
//                         onChange={handleUpdateChange}
//                     />
//                     <select className='input-style' onChange={(e) => {
//                         setMaincategories(e.target.value);
//                         fetchCategoriesByMaincategory(e.target.value);
//                     }} style={{ width: '100%', marginTop: '10px' }} value={getSubcategoriesById.category ? getSubcategoriesById.category._id : ''}>
//                         <option value="">Select Main Category</option>
//                         {getMaincategories.map((mainCat) => (
//                             <option key={mainCat._id} value={mainCat._id}>
//                                 {mainCat.maincategories}
//                             </option>
//                         ))}
//                     </select>
//                     {/* Dropdown for selecting Category */}
//                     <select className='input-style' onChange={(e) => setGetSubcategoriesById(e.target.value)} style={{ width: '100%', marginTop: '10px' }} value={getSubcategoriesById.category ? getSubcategoriesById.category._id : ''}>
//                         <option value="">Select Category</option>
//                         {filteredCategories.map((cat) => (
//                             <option key={cat._id} value={cat._id}>
//                                 {cat.name}
//                             </option>
//                         ))}
//                     </select>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleOff}>
//                         Close
//                     </Button>
//                     <Button variant="primary" onClick={updateSubcategory}>
//                         Save Changes
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// }

// export default Subcategories;


