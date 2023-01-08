import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { getToken } from "../../../services/LocalStorageService.js";
import { useEffect, useState } from "react";
import axios from "axios";
const Widget = ({ type }) => {
  const [totalAmount, setTotalAmount] = useState(0);

  const [totalOrder, setTotalOrder] = useState(0);

  const [uniqueIDCount, setUniqueIDCount] = useState(0);

  axios.interceptors.request.use(
    (config) => {
      config.headers.authorization = `Bearer ${getToken()}`;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const url = "http://127.0.0.1:8000/product-inventory/shopvendor-orderlist/";

  const [order, setOrder] = useState([]);

  useEffect(() => {
    axios.get(url).then((res) => setOrder(res.data));
  }, []);

  

  // Calculate the total amount when the order items change
  useEffect(() => {
    let total = 0;
    for (const item of order) {
      total += parseInt(item.price);
    }
    setTotalAmount(total);
  }, [order]);



  // Calculate the total amount when the order items change
  useEffect(() => {
    let totalOrder = 0;
    for (const item of order) {
      totalOrder += 1
    }
    setTotalOrder(totalOrder);
  }, [order]);


// Calculate the count of unique IDs when the data changes
useEffect(() => {
  const uniqueIDs = new Set();
  for (const item of order) {
    uniqueIDs.add(item.order);
  }
  setUniqueIDCount(uniqueIDs.size);
}, [order]);


  let data;
  console.log("Order List Total price: ", totalAmount);
  //temporary
  const amount = totalAmount;
  const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        total:uniqueIDCount,
        isMoney: false,
        link: "See all users",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        total:totalOrder,
        isMoney: false,
        link: "View all orders",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        total:amount,
        isMoney: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        total:amount,
        isMoney: true,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "RS"} {data.total}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
