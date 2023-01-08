import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { getToken } from "../../../services/LocalStorageService.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { version } from "joi";
import { useNavigate } from "react-router-dom";
const List = () => {
  let navigate = useNavigate(); // Navigator

  // const [VendorOrder, setVendorOrder] = useState([]);
  const [data, setData] = useState([]);

  async function LoadOrderList() {
    try {
      let apiResponse = await axios.get(
        "http://127.0.0.1:8000/product-inventory/shopvendor-orderlist/",
        {
          headers: { authorization: `${getToken()}` },
        }
      );
      console.log("API Response Shop Vendor: ", apiResponse.data);
      setData(apiResponse.data);
    } catch (error) {
      console.log("API Call Failed : ", error);
      if (error.response.status === 400) {
        alert("Error: Bad Request" + error.message);
      } else if (error.response.status === 401) {
        alert("Session Expired Login again:" + error.message);
        navigate("/");
      } else {
        alert("Some other error Occured : " + error.message);
      }
    }
    console.log("Vendor Order List : ", data);
  }

  useEffect(() => {
    LoadOrderList();
  }, []);

  // axios.interceptors.request.use(
  //   (config) => {
  //     config.headers.authorization = `Bearer ${getToken()}`;

  //     return config;
  //   },
  //   (error) => {
  //     console.log("Error in Interceptor : ", error);
  //     return Promise.reject(error);
  //   }
  // );

  // const url = "http://127.0.0.1:8000/product-inventory/shopvendor-orderlist/";

  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   try {
  //     console.log("API Call : ", url);
  //     axios.get(url).then((res) => setData(res.data));
  //   } catch (error) {
  //     console.log("API Call Failed : ", error);
  //     if (error.response.status === 400) {
  //       alert("Error: Bad Request" + error.message);
  //     } else if (error.response.status === 401) {
  //       alert("Session Expired :" + error.message);
  //       navigate("/");
  //     } else {
  //       alert("Some other error Occured : " + error.message);
  //     }
  //   }
  // }, []);

  console.log("Vendor Order List : ", data);

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">OrderId</TableCell>
            <TableCell className="tableCell">Product</TableCell>
            <TableCell className="tableCell">Product Price</TableCell>
            <TableCell className="tableCell">OrderQuantity</TableCell>
            <TableCell className="tableCell">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  {moment(row.created_at).format("MM/DD/YYYY")}
                  {"   "}
                  {moment(row.created_at).format("hh:mm:ss")}
                  {/* {row.created_at} */}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.order}</TableCell>
              <TableCell className="tableCell">{row.product}</TableCell>
              <TableCell className="tableCell">{row.price}</TableCell>
              <TableCell className="tableCell">{row.quantity}</TableCell>
              <TableCell className="tableCell">
                <span className="status"> {row?.quantity * row?.price}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
