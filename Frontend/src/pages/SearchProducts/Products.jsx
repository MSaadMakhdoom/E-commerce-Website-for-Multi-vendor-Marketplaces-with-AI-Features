import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  CardGroup,
  FormControl,
  Button,
} from "react-bootstrap";

import axios from "axios";
import { Link } from "react-router-dom";
function SidebarFilter() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    price: 10000,
    category: "",
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/product-inventory/product-list/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        // handle the error here
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/product-inventory/Category-list/")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        // handle the error here
      });
  }, []);

  const handlePriceChange = (event) => {
    const newFilters = {
      ...filters,
      price: event.target.value,
    };
    setFilters(newFilters);
  };

  const handleCategoryChange = (event) => {
    const newFilters = {
      ...filters,
      category: event.target.value,
    };
    setFilters(newFilters);
  };

  const filteredItems = products.filter((item) => {
    const { price, category } = filters;

    console.log(
      "Filter price",
      filters.price,
      "DataType",
      typeof filters.price
    );
    console.log(
      "Item",
      item.categoryfk,
      "Price",
      item.price,
      "DataType",
      typeof item.categoryfk
    );
    return (
      item.price <= parseInt(price) &&
      (category === "" || item.categoryfk === parseInt(category))
    );
  });

  console.log("Filtered-->", filteredItems);

  // search box
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // send request to API and save data
    axios
      .get(`http://127.0.0.1:8000/product-inventory/search/${searchTerm}/`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        // handle the error here
      });
  };

  return (
    <Container>
      <Row>
        <Form inline className="d-flex" onSubmit={handleSearch}>
          <FormControl
            type="text"
            placeholder="Search"
            className="me-1"
            onChange={handleChange}
          />

          <Button variant="outline-success" onClick={handleSearch}>
            Search
          </Button>
        </Form>
        <Col md={3}>
          <Form>
            <Form.Group controlId="formFilterCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={filters.category}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formFilterPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="range"
                min="0"
                max="100000"
                value={filters.price}
                onChange={handlePriceChange}
              />
              <Form.Label>Price: {filters.price}</Form.Label>
            </Form.Group>
          </Form>
        </Col>
        <Col md={9}>
          <CardGroup class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mx-2 my-2">
            {filteredItems.map((product) => (
              <Link className="link" to={`/product/${product?.id}`}>
                <Card key={product.id}>
                  <Card.Img
                    variant="top"
                    style={{ height: "200px" }}
                    src={`http://127.0.0.1:8000//${product?.image}`}
                  />
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>{product.brand_name}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">RS:{product.price}</small>
                  </Card.Footer>
                </Card>
              </Link>
            ))}
          </CardGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default SidebarFilter;
