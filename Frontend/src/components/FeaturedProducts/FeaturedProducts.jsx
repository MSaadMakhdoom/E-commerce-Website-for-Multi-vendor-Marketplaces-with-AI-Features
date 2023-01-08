import React from "react";
import "./FeaturedProducts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const FeaturedProducts = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = data.slice(startIndex, startIndex + itemsPerPage);

  //
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.get(`http://127.0.0.1:8000/product-inventory/product-list/`);
  //     setData(response.data);
  //   };
  //   fetchData();
  // }, []);

  async function loadProduct() {
    try {
      setLoading(true);
      let apiResponse = await axios.get(
        `http://127.0.0.1:8000/product-inventory/product-list/`
      );
      setData(apiResponse.data);
    } catch (error) {
      console.log("API Call Failed : ", error);
      setError(true);
    }
    setLoading(false);
    console.log("Product List : ", data);
  }

  useEffect(() => {
    loadProduct();
    // window.location.reload();
  }, []);

  return (
    <div class="album py-5 ">
      <div class="container">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {error
            ? "Some error occured"
            : loading
            ? "loading"
            : displayedItems?.map((item) => (
                <Link className="link" to={`/product/${item?.id}`}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`http://127.0.0.1:8000//${item?.image}`}
                        alt={`http://127.0.0.1:8000//${item?.image}`}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item?.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Shape:{item?.shape}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          RS:{item?.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item?.brand_name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              ))}
        </div>
      </div>

      <Pagination className="pagination justify-content-center">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map(
          (page) => (
            <Pagination.Item
              key={page}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          )
        )}
        <Pagination.Next
          disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </Pagination>
    </div>
  );
};

export default FeaturedProducts;
