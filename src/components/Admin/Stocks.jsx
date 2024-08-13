
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { IoIosAddCircle } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { Link } from "react-router-dom";
import SideNav from "./SideNav";

function Stocks() {
  const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
  const [show, setShow] = useState(false);
  const [getCategories, setGetCategories] = useState([]);
  const [formData, setFormData] = useState({
    metaltype: "",
    code: "",
    // branch: "",
    description: "",
    karat: "",
    stdpurity: "",
    makingcharge: "",
    // parent: "",
    // otherdescription: "",
    maincategories: "",
    categories: "",
    unit: "",
    modelcode: "",
    costcenter: "",
    type: "",
    brand: "",
    design: "",
    vendor: "",
    hsn: "",
    hsmaster: "",
    country: "",
    size: "",
    color: "",
    venderref: "",
    // price1: "",
    // price2: "",
    // price3: "",
    // price4: "",
    // price5: "",
    // detailss: "",
    // standardcost: "",
    // salesdiscount: "",
    // maximumstock: "",
    // recorderlevel: "",
    // recorderquantity: "",
    // saleschargeon: "",
    // purcost: "",
    // saleprice: "",
    // seqcode: "",
    // location: "",
    // createdon: "",
    // by: "",
    // firsttransaction: "",
    // lasttransaction: "",
    // mt5ratetype: "",
    // inpieces: "",
    // createbarcodes: "",
    // passpuritydiffrence: "",
    // includestoneweight: "",
    // askpercentage: "",
    // vatonmaking: "",
    // avoidalloy: "",
    // abcmaster: "",
    // asksupplier: "",
    // alloyitem: "",
    // dustitem: "",
    // excludetax: "",
    // ozfactor: "",
    // fineoz: "",
    // packingsize: "",
    // defsalepurity: "",
    // askweightage: "",
    // makingnetwork: "",
    // dyestrip: "",
    // kundan: "",
    // allownegativestock: "",
    // blockweightinsale: "",
    // allowlesscost: "",
    // finisheditem: "",
    // excludefromtransfer: "",
    // blockinalltransaction: "",
    // blockinallreports: "",
    // qtyroundoff: "",
    // kundanrate: "",
    // popstockfilter: "",
    // linksubcode: "",
    // stamprate: "",
    // image: null
  });

  const handleShow = async () => {
    setShow(true);
    try {
      const response = await axios.get(`${backendUrl}/admin/getcategories`);
      const data = response.data;
      setGetCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const postStocks = async () => {
    const formdata = new FormData();
    Object.keys(formData).forEach((key) => {
      formdata.append(key, formData[key]);
    });

    try {
      await axios.post(`${backendUrl}/admin/poststocks`, formdata);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <SideNav />
      <div className="whole">
        <div className=" container main-content">
          <div className="pl-3 row main-row">
            <div
              className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2 style={{color:"#b20769"}}><b>Stock Details</b></h2>
              <Tooltip className="add_btn" title="Add">
                <Link>
                  <IoIosAddCircle className="add_btn" onClick={handleShow} />
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      
      <Modal className="montserrat-400" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(formData).map((key, index) => (
            key !== "image" ? (
              <input
                key={index}
                name={key}
                placeholder={key}
                type="text"
                style={{ width: "100%", marginBottom: '1rem' }}
                onChange={handleChange}
              />
            ) : (
              <input
                key={index}
                style={{ width: "100%", marginBottom: "1rem" }}
                type="file"
                name="image"
                onChange={handleChange}
              />
            )
          ))}

          <select
            onChange={handleChange}
            name="categories"
            value={formData.categories}
            className="my-3"
            style={{ width: "100%", marginBottom: '1rem' }}
          >
            <option value="">Select Category..</option>
            {getCategories.map((item, index) => (
              <option key={index} value={item._id}>
                {item.categories}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name="maincategories"
            value={formData.maincategories}
            className="my-3"
            style={{ width: "100%", marginBottom: '1rem' }}
          >
            <option value="">Select Main Category..</option>
            {getCategories.map((item, index) => (
              <option key={index} value={item._id}>
                {item.maincategories}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={postStocks}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Stocks;
