import React from "react";
import "./Cart.scss";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useSelector } from "react-redux";
import { removeItem, resetCart } from "../../redux/cartReducer";
import { useDispatch } from "react-redux";
import { makeRequest } from "../../makeRequest";
import Axios from "axios";

import { getToken } from "../../services/LocalStorageService.js";
import { removeToken } from "../../services/LocalStorageService.js";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  let navigate = useNavigate(); // Navigator
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();

  const totalPrice = () => {
    let total = 0;
    products.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total.toFixed(2);
  };


  const config = {
    headers: {
     
      Authorization: `Bearer ${getToken()}`,
    },
  };

 
  const handlePayment = async () => {
    try {
      console.log("customer order product:",products);

      const res = await Axios.post("http://127.0.0.1:8000/order/CreateProductOrder/", {
        products
      },config);

      alert("Thank you for shopping CementO. Your order is confirmed.");
      dispatch(resetCart());
    } catch (error) {

      console.log(error);
      if (error.response.status === 400) {
        alert("Error: Bad Request" + error.message);
      } else if (error.response.status === 401) {
        alert("Session Token Expired :" + error.message);
        removeToken();
        navigate("/login");
      }  else if (error.response.status ===500) {
        alert("Backend server error :" + error.message);
      }
      else {
        alert("Some other error Occured : " + error.message);
      }
    }
  };
  return (
    <div className="cart">
      <h1>Products in Basket </h1>
      {products?.map((item) => (
        <div className="item" key={item.id}>
          <img src={item.img} alt="" />
          <div className="details">
            <h1>{item.title}</h1>
            <p>{item.desc?.substring(0, 100)}</p>
            <div className="price">
              {item.quantity} x RS:{item.price}
            </div>
          </div>
          <DeleteOutlinedIcon
            className="delete"
            onClick={() => dispatch(removeItem(item.id))}
          />
        </div>
      ))}
      <div className="total">
        <span>SUBTOTAL</span>
        <span>RS:{totalPrice()}</span>
      </div>
      <button onClick={handlePayment}>PROCEED TO CHECKOUT</button>
      <span className="reset" onClick={() => dispatch(resetCart())}>
        Reset Cart
      </span>
    </div>
  );
};

export default Cart;
