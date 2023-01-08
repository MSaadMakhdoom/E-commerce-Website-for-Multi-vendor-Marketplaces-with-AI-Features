import "./vendorProduct.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { getToken } from "../../../../services/LocalStorageService.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { version } from "joi";
import { useNavigate } from "react-router-dom";

const VendorProduct = () => {
  const navigate = useNavigate();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const url = "http://127.0.0.1:8000/product-inventory/shopvendor-productlist/";

  const [data, setData] = useState([]);

  //get data from api

  useEffect(() => {
    try {
      axios.get(url, config).then((res) => setData(res.data));
    } catch (error) {
      if (error.response.status === 401) {
        alert("Login Expired. Please Login Again");
        navigate("/login");
      }
      console.log("Error", error);
      alert("Error " + error);

      return;
    }
  }, []);

  // console.log("Vendor Order VendorProduct : ", data);

  // function for login button
  function DeleteHandler(pk) {
    console.log("Product ID: ", pk);
    try {
      let response = axios.delete(
        `http://127.0.0.1:8000/product-inventory/product-delete/${pk}`,
        config
      );
    } catch (error) {
      if (error.response.status === 401) {
        alert("Login Expired. Please Login Again");
        navigate("/login");
      } else alert("Error " + error);

      return;
    }

    alert("Delete Successful");
  }

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Product ID</TableCell>
            <TableCell className="tableCell">Product</TableCell>
            <TableCell className="tableCell">Price</TableCell>
            <TableCell className="tableCell">Color</TableCell>
            <TableCell className="tableCell">Brand</TableCell>
            <TableCell className="tableCell">Available Location</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row?.id}>
              <TableCell className="tableCell">{row?.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img
                    src={`http://127.0.0.1:8000//${row?.image}`}
                    alt={`http://127.0.0.1:8000//${row?.image}`}
                    className="image"
                  />
                  {row?.title}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row?.price}</TableCell>
              <TableCell className="tableCell">{row?.color}</TableCell>
              <TableCell className="tableCell">{row?.brand_name}</TableCell>
              <TableCell className="tableCell">
                {row?.available_location}
              </TableCell>
              <TableCell className="tableCell">
                <Link onClick={() => DeleteHandler(row?.id)}>Delete/</Link>
                <Link to={`/VendorDashboard/${row?.id}`}>Update</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VendorProduct;
