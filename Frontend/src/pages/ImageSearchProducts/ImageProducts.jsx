import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Nav/Navbar";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@material-ui/core";

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchResults, setSearchResults] = useState({
    Pattern: "",
    Product_category: "",
    Style: "",
    available_location: "",
    brand_name: "",
    categoryfk: -1,
    color: "",
    date_added: "",
    description: "",
    id: 0,
    image: "",
    in_stock: false,
    is_active: false,
    latitude: -1,
    longitude: -1,
    price: "",
    product_slug: "",
    qty: 1,
    shape: "",
    thumbnail: "",
    title: "",
    vendorfk: -1,
  });

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!image) {
      return alert("Img Not Found");
    }

    const formData = new FormData();
    formData.append("image", image);
    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/product-inventory/upload-image/",
        formData
      );
      let values = await response.data;
      console.log("Response Data : ", values);
      console.log("values Pattern : ", values.Pattern);

      setSearchResults(values);

      console.log("Search Result", searchResults);
      setLoading(false);
    } catch (error) {

      console.error(error);
      if (error.response.status === 400) {
        alert("Error: Bad Request" + error.message);
      } else if (error.response.status === 404) {
        alert("Image prodct not avalible:" + error.message);
       
      } else {
        alert("Some other error Occured : " + error.message);
      }
    }
  };

  let imagePreview;
  if (image) {
    imagePreview = (
      <Card style={{ height: "250px", width: "20em" }}>
        <div class="card shadow-sm">
          <img
            class="img-fluid"
            style={{ height: "250px", width: "20em" }}
            src={URL.createObjectURL(image)}
            alt="preview"
          />
        </div>
      </Card>
    );
  }

  let SearchimagePreview;
  if (searchResults.id) {
    SearchimagePreview = (
      <Card style={{ height: "300px", width: "20em" }}>
        <Link className="link" to={`/product/${searchResults?.id}`}>
          <div class="col">
            <div class="card shadow-sm">
              <img
                class="img-fluid"
                style={{ height: "250px", width: "20em" }}
                src={`http://127.0.0.1:8000//${searchResults?.image}`}
                alt={`http://127.0.0.1:8000//${searchResults?.image}`}
              />
              <div class="card-body">
                <p class="card-text">{searchResults?.title}</p>

                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">RS:{searchResults?.price}</small>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <form onSubmit={handleUpload}>
          <Grid container spacing={2}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <input type="file" onChange={handleImageChange} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Search
              </Button>
            </Grid>
          </Grid>
        </form>

        {imagePreview}
        <h1> Search Result</h1>

        {loading ? "Loading...." : SearchimagePreview}
      </Container>

      <Footer />
    </>
  );
}

export default ImageUpload;
