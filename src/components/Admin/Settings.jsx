import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import SideNav from './SideNav';
import { Tooltip } from '@mui/material';
import { IoIosAddCircle } from 'react-icons/io';
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { Link } from 'react-router-dom';

function Settings() {
  const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
  const [show, setShow] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    image: '',
    companyName: '',
    address: '',
    mapLink: '',
    contact: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/getsettings`);
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const resetForm = () => {
    setForm({
      image:'' ,
      companyName: '',
      address: '',
      mapLink: '',
      contact: ''
    });
    setEditId(null);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      if (editId) {
        await axios.put(`${backendUrl}/admin/putsettings/${editId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${backendUrl}/admin/postsettings`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      fetchProfiles();
      handleClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleEdit = (profile) => {
    setForm(profile);
    setEditId(profile._id);
    handleShow();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/admin/deletesettings/${id}`);
      fetchProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <div>
      <SideNav />
      <div className='whole'>
        <div className="main-contenet">
          <div className="pl-3 row main-row">
            <div className="col-6 my-sm-0 my-md-5 p-3 montserrat-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2><b>COMPANY PROFILE</b></h2>
              <Tooltip className='add_btn' title='Add'>
                <Link>
                  <IoIosAddCircle className='add_btn' onClick={handleShow} />
                </Link>
              </Tooltip>
            </div>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{editId ? 'Edit Profile' : 'Add Profile'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="my-3 input-style"
                  style={{ width: '100%' }}
                />
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  className="input-style"
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="input-style"
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
                <input
                  type="text"
                  name="mapLink"
                  value={form.mapLink}
                  onChange={handleInputChange}
                  placeholder="Enter Google Maps link"
                  className="input-style"
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
                <input
                  type="number"
                  name="contact"
                  value={form.contact}
                  onChange={handleInputChange}
                  placeholder="Contact"
                  className="input-style"
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Company</th>
                  <th>Address</th>
                  <th>Map Link</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile._id}>
                    <td>
                      <div className="image-container">
                        {profile.image.map((image, idx) => (
                          <img key={idx} className="avatar" src={`${backendUrl}/images/${image}`} alt={`Image ${idx + 1}`} />
                        ))}
                      </div>
                    </td>
                    <td>{profile.companyName}</td>
                    <td>{profile.address}</td>
                    <td>
                      <a href={profile.mapLink} target="_blank" rel="noopener noreferrer">
                        View Map
                      </a>
                    </td>
                    <td>{profile.contact}</td>
                    <td>
                      <FiEdit style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleEdit(profile)} />
                      <MdDelete style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleDelete(profile._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;







