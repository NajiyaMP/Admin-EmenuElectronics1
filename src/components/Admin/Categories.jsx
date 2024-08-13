import React, { useEffect, useState } from 'react';
import SideNav from './SideNav';
import { Button, Modal } from 'react-bootstrap';
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import axios from 'axios';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { IoIosAddCircle } from 'react-icons/io';
import SmallNav from './SmallNav';

function Categories() {
    const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
    const [uid, setUid] = useState('');
    const [show, setShow] = useState(false);
    const [on, setOn] = useState(false);
    const [categories, setCategories] = useState('');
    const [getCategories, setGetCategories] = useState([]);
    const [getCategoriesById, setGetCategoriesById] = useState({ categories: "" });
    const [maincategory, setMaincategory] = useState(''); // State for main category
    const [getMaincategories, setGetMaincategories] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleOff = () => setOn(false);




    const postCategories = async () => {
        const data = {
            name: categories, // Assuming categories is the category name
            maincategoriesData: maincategory // Use maincategory state here
        };
        try {
            await axios.post(`${backendUrl}/admin/postcategories`, data);
            handleClose(); // Close modal after successful post
            fetchCategories(); // Refresh categories after adding a new one
        } catch (err) {
            console.error('Error posting category:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${backendUrl}/admin/getcategories`);
            setGetCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };
    
    const fetchMainCategories = async () => {
        try {
            const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
            setGetMaincategories(response.data);
        } catch (err) {
            console.error('Error fetching main categories:', err);
        }
    };


    const handleOn = async (id) => {
        setOn(true);
        setUid(id);
        try {
            const response = await axios.get(`${backendUrl}/admin/getcategoriesbyid/${id}`);
            setGetCategoriesById(response.data); // Ensure response.data matches your category schema
        } catch (err) {
            console.error('Error fetching category by id:', err);
        }
    };
    
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setGetCategoriesById(prevState => ({ ...prevState, [name]: value }));
    };
    
    const updateCategory = async () => {
        const data = {
            name: getCategoriesById.name,
            maincategoriesData: getCategoriesById.maincategoriesData
        };
        try {
            await axios.put(`${backendUrl}/admin/putcategories/${uid}`, data);
            handleOff();
            fetchCategories(); // Refresh categories after updating
        } catch (err) {
            console.error('Error updating category:', err);
        }
    };
    
   
      
        

    const handleDelete = async (id) => {
        const windowConfirmation = window.confirm('Are you sure to delete this item?');
        if (windowConfirmation) {
            try {
                await axios.delete(`${backendUrl}/admin/deletecategories/${id}`);
                fetchCategories(); // Refresh categories after deletion
            } catch (err) {
                console.error('Error deleting category:', err);
            }
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchMainCategories();
    }, [backendUrl]);
    
    useEffect(() => {
        console.log('Categories:', getCategories);
        console.log('Main Categories:', getMaincategories);
    }, [getCategories, getMaincategories]);

    return (
        <div>
            <SmallNav />
            <SideNav />
            <div className='whole'>
                <div className="main-content">
                    <div className="pl-3 row main-row">
                        <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2><b>CATEGORIES</b></h2>
                            <Tooltip className='add_btn' title='Add'>
                                <IoIosAddCircle className='add_btn' onClick={handleShow} />
                            </Tooltip>
                        </div>
                        <div className="container table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Category</th>
                                        <th scope="col">Main Category</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {getCategories.map((items, index) => (
                                            <tr key={index}>
                                                <td className="text-black item-text">{items.name}</td>
                                                <td className="text-black item-text">
                                                    {items.maincategoriesData ? items.maincategoriesData.maincategories : 'N/A'}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '20%' }}>
                                                        <FiEdit style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleOn(items._id)} />
                                                        <MdDelete style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleDelete(items._id)} />
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
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input className='input-style' type="text" placeholder="Category Name" style={{ width: '100%' }} onChange={(e) => setCategories(e.target.value)} />
                    <select className='input-style' onChange={(e) => setMaincategory(e.target.value)} style={{ width: '100%', marginTop: '10px' }}>
                        <option value="">Select Main Category</option>
                        {getMaincategories.map((mainCat) => (
                            <option key={mainCat._id} value={mainCat._id}>
                                {mainCat.maincategories}
                            </option>
                        ))}
                    </select>
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
                        
            <Modal show={on} onHide={handleOff} className='montserrat-400'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input 
                        value={getCategoriesById.name || ''} // Assuming 'name' is the category name
                        name='name'
                        className='input-style' 
                        type="text" 
                        placeholder="Category Name" 
                        style={{ width: '100%' }} 
                        onChange={handleUpdateChange} 
                    />
                    <select 
                        className='input-style' 
                        value={getCategoriesById.maincategoriesData || ''} // Assuming 'maincategoriesData' holds the main category ID
                        name='maincategoriesData' 
                        onChange={handleUpdateChange} 
                        style={{ width: '100%', marginTop: '10px' }}>
                        <option value="">Select Main Category</option>
                        {getMaincategories.map((mainCat) => (
                            <option key={mainCat._id} value={mainCat._id}>
                                {mainCat.maincategories}
                            </option>
                        ))}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleOff}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateCategory}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Categories;









