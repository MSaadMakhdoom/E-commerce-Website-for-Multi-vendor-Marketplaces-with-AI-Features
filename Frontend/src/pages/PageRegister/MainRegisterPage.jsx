import React from "react";
import { MDBContainer, MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";
import logo from "./back.svg";
import Navbar from "../../components/Nav/Navbar";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import "./login.css";
function PageRegister() {
  return (
    <div>
      <Navbar />

      <MDBContainer fluid className="p-3 my-5">
        <MDBRow>
          <MDBCol col="10" md="5">
            <img src={logo} class="img-fluid" alt="Phone image" />
          </MDBCol>

          <MDBCol col="4" md="6">
            <h1 className="text-center">Welcome to CementO</h1>
            <br />
            <br />
            <br />
            <div class="text-center">
              <Link to="/Customerregister">
                <Button variant="primary" size="lg">
                  Customer Register
                </Button>
              </Link>
            </div>
            <br />
            <div class="text-center">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  {" "}
                  Shop vendor Register
                </Button>
              </Link>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <Footer />
    </div>
  );
}

export default PageRegister;
