import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { useSelector } from "react-redux";
import LoginIcon from "@mui/icons-material/Login";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StoreIcon from "@mui/icons-material/Store";
import React, { useState, useEffect } from "react";

import axios from "axios";

import Cart from "../Cart/Cart";
import SearchIcon from '@mui/icons-material/Search';

import { Link } from "react-router-dom";

function NavBar(props) {
  const [open, setOpen] = useState(false);
  const products = useSelector((state) => state.cart.products);

  const [searchTerm, setSearchTerm] = useState([]);
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // Pass the searchTerm to the parent component using the onSearch prop
    props.onSearch(searchTerm);
  };

  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">CementO</Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Form className="d-flex" onSubmit={handleSearch}>
              {/* <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={handleChange}
              /> */}
              <Link to={`/products/search`}>
                
                <Button type="submit" variant="outline-success">
                 <SearchIcon/> Search
                </Button>
              </Link>

              <Link className="mr-2" to={`/ImageSearch`}>
                <Button type="submit" variant="outline-success">
                <ImageSearchIcon /> VisualSearch
                </Button>
              </Link>
            </Form>
          </Nav>

          <Nav.Link as={Link} to="/login">
            <LoginIcon />
          </Nav.Link>

          <Nav.Link as={Link} to="/main_register">
            <StoreIcon />
          </Nav.Link>

          <Nav.Link onClick={() => setOpen(!open)}>
            <ShoppingCartOutlinedIcon />
            <span>{products.length}</span>
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
      {open && <Cart />}
    </Navbar>
  );
}

export default NavBar;
