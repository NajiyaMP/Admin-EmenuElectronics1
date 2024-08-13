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
 
  const [image, setImage] = useState([]);
  
  const [getBanner, setGetBanner] = useState([]);
const [getBannerById, setGetBannerById] = useState([]);

  
   
 

  const handleImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImage(selectedFiles); // Store multiple files
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleOff = () => setOn(false);
  const [file, setFile] = useState("");

  
  // Fetch dishes from the backend on component mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin/getbanner`);
        const data = response.data;
        setGetBanner(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [backendUrl]);




  // Function to handle POST dishes
  const postDishes = async () => {
    const formData = new FormData();
   

    // Append each file to formData
    for (let i = 0; i < image.length; i++) {
      formData.append("image", image[i]);
    }

    try {
        await axios.post(`${backendUrl}/admin/postbanner`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        window.location.reload(); // Refresh page after successful post
    } catch (err) {
        console.log(err);
    }
};



const updateDishes = async () => {
  const formData = new FormData();
  if (image) {
    image.forEach(file => formData.append("image", file));
  }

  try {
    await axios.put(`${backendUrl}/admin/putbanner/${uid}`, formData);
    window.location.reload(); // Refresh after update
  } catch (err) {
    console.error('Error updating dish:', err);
  }
};

const handleOn = async (id) => {
  setOn(true);
  setUid(id);

  try {
    const response = await axios.get(`${backendUrl}/admin/getbannerbyid/${id}`);
    const data = response.data;
    setGetBannerById({
        image: data.image || [], // Initialize image array
    });
   
  } catch (err) {
    console.log(err);
  }
};

const handleUpdateChange = (e) => {
  const { name, value } = e.target;
  setGetBannerById((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};



    // Function to handle deletion of dishes
    const handleDelete = async (id) => {
      const windowConfirmation = window.confirm("Are you sure to Delete this item");
      if (windowConfirmation) {
        try {
          await axios.delete(`${backendUrl}/admin/deletebanner/${id}`);
          window.location.reload(); // Refresh page after successful deletion
        } catch (err) {
          console.log(err);
        }
      }
    };
  



  // JSX rendering with dynamic data
  return (
    <div>
      <SideNav />
      <div className="whole">
        <div className=" main-contenet">
          <div className="pl-3 row main-row">
            <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
                 style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <h2><b>Banner</b></h2>
              <Tooltip className="add_btn" title="Add">
                <IoIosAddCircle className="add_btn" onClick={handleShow} />
              </Tooltip>
            </div>
            <div className="container table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Image</th>
                    
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {getBanner.map((items, index) => (
                    <tr key={index}>
                      <td>
                        <div className="image-container">
                          {items.image.map((image, idx) => (
                            <img key={idx} className="avatar" src={`${backendUrl}/images/${image}`} alt={`Image ${idx + 1}`} />
                          ))}
                        </div>
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
          <Modal.Title>Add Banners</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input className="my-3 input-style" style={{ width: "100%" }} type="file" name="image"  multiple    onChange={handleImage} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={postDishes}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={on} onHide={handleOff} className="montserrat-400">
        <Modal.Header closeButton>
          <Modal.Title>EDIT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Input fields for adding dishes */}
          <input className="my-3 input-style" style={{ width: "100%" }} type="file" name="image" multiple onChange={handleImage} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOff}>
            Close
          </Button>
          <Button variant="primary" onClick={updateDishes}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
     


    </div>
  );
}

export default Dishes;
