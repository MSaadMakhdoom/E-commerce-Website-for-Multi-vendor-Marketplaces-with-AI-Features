import "./addproduct.scss";

import { getToken } from "../../../services/LocalStorageService.js";
import { useEffect, useState } from "react";
import Axios from "axios";

import { useNavigate } from "react-router-dom";

const List = () => {
  let navigate = useNavigate(); // Navigator
  const [errors, setErrors] = useState([]);

  const url = "http://127.0.0.1:8000/product-inventory/product-create/";

  const [data, setData] = useState({
    categoryfk: "",
    vendorfk: "",
    title: "",
    product_slug: "",
    color: "",
    Style: "",
    Pattern: "",
    shape: "",

    Product_category: "",
    description: "",
    price: "",
    qty: "",
    brand_name: "",
    available_location: "",
  });

  const [postimage, setPostImage] = useState(null);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const submit = async (e) => {
    e.preventDefault();
    let formData = new FormData();

    formData.append("image", postimage.image[0]);

    formData.append("categoryfk", data.categoryfk);
    formData.append("vendorfk", data.vendorfk);
    formData.append("title", data.title);
    formData.append("product_slug", data.product_slug);
    formData.append("color", data.color);
    formData.append("Style", data.Style);
    //
    formData.append("Pattern", data.Pattern);
    formData.append("shape", data.shape);
    formData.append("Product_category", data.Product_category);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("qty", data.qty);
    //
    formData.append("brand_name", data.brand_name);
    formData.append("available_location", data.available_location);

    // Axios.post(url, formData, config)
    //   .then((res) => {
    //     console.log(res.formData);
    //   })
    //   .catch((e) => {
    //     alert("Some error Occured " + e.response.data.errors);
    //     setErrors(e.response.data.errors);
    //     return
    //   });

    try {
      await Axios.post(url, formData, config);
      alert("Product add Successfull");
      navigate("/VendorDashboard");
    } catch (error) {
      if (error.response.status === 400) {
        alert("Error: Bad Request" + error.message);
      } else if (error.response.status === 401) {
        alert("Session Expired :" + error.message);
        navigate("/");
      } else {
        alert("Some other error Occured : " + error.message);
      }
      // alert("Error" + e.response.data.errors + " ->" + e.response);
      // setErrors(e.response.data.errors);
    }
  };

  function handle(e) {
    if ([e.target.name] == "image") {
      setPostImage({
        image: e.target.files,
      });
      console.log(e.target.files);
    } else {
      const newdata = { ...data };
      newdata[e.target.id] = e.target.value.trim();
      setData(newdata);
      console.log(newdata);
    }
  }

  return (
    <div>
      <form onSubmit={(e) => submit(e)}>
        <div className="form-group">
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <label className="small mb-1">Product Name</label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="title"
                value={data.title}
                placeholder="Enter Product title"
              />
            </div>

            <div className="col-md-6">
              <label className="small mb-1">*Category</label>
              <select
                onChange={(e) => handle(e)}
                class="form-control"
                name="category"
                id="categoryfk"
                value={data.categoryfk}
              >
                <option value=""></option>
                <option value="1">Tiles</option>
                <option value="2">Marbles</option>
                <option value="3">Doors</option>
                <option value="4">Electronics</option>
                <option value="5">Furnitures</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <label className="small mb-1">Color</label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="color"
                value={data.color}
                placeholder="Enter Product color"
              />
            </div>

            <div className="col-md-6">
              <label className="small mb-1">Style</label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="Style"
                value={data.Style}
                placeholder="Enter Product Style Look"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <label className="small mb-1" for="inputEmail">
                Pattern
              </label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="Pattern"
                value={data.Pattern}
                placeholder="Enter Product Pattern"
              />
            </div>

            <div className="col-md-6">
              <label className="small mb-1">Shape</label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="shape"
                value={data.shape}
                placeholder="Enter Product shape"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <label className="small mb-1">Product category</label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="Product_category"
                value={data.Product_category}
                placeholder="Enter Product category"
              />
            </div>

            <div className="col-md-6">
              <label className="small mb-1">Description</label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="description"
                value={data.description}
                placeholder="Enter Product discription"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <label className="small mb-1">Price</label>

              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="price"
                value={data.price}
                placeholder="Enter Product Price"
              />
            </div>

            <div className="col-md-6">
              <label className="small mb-1">Quantity in Packet</label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="qty"
                value={data.qty}
                placeholder="Enter Product quantity in packet"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <label className="small mb-1">Brand name</label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="brand_name"
                value={data.brand_name}
                placeholder="Enter Product Brand"
              />
            </div>

            <div className="col-md-6">
              <label className="small mb-1">Available location</label>
              <input
                onChange={(e) => handle(e)}
                type="text"
                class="form-control form-control-user"
                id="available_location"
                value={data.available_location}
                placeholder="Enter Product available location"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
    
            </div>
            <div className="col-md-6">
              <label>Product Image</label>
              <input
                accept="image/*"
                id="image"
                name="image"
                type="file"
                onChange={(e) => handle(e)}
                className="form-control"
                placeholder="Enter Product Image"
              />
            </div>
          </div>
        </div>

        <button class="btn btn-primary btn-user btn-block">Add Product</button>
      </form>
    </div>
  );
};

export default List;
