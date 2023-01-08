import React from "react";
import { MDBContainer, MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";
import logo from "./back.svg";
import Navbar from "../../components/Nav/Navbar";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { Context, useState } from "react";
import Joi from "joi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storeToken } from "../../services/LocalStorageService";
import "./login.css";
function App() {
  const navigate = useNavigate();

  const [state, setState] = useState(() => {
    return {
      username: "",
      password: "",
    };
  }); // State to take input

  // input handler onChange function
  function inputHandler(event) {
    let { name, value } = event.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  }

  //Login Input validator
  function validateLoginInput(data) {
    const loginValidation = Joi.object({
      username: Joi.string()
        .min(6)
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().min(6).required(),
    });
    return loginValidation.validate(data);
  }

  // function for login button
  let loginButtonHandler = async () => {
    // let { error } = validateLoginInput(state);
    // if (error) {
    //   alert(error.details[0].message);
    //   return;
    // }
    try {
      let response = await axios.post("http://127.0.0.1:8000/Login_api/", {
        username: state.username,
        password: state.password,
      });
      console.log("Response", response.data.is_customer);
      console.log("Response", response.data.is_vendor);
      if (response.data.is_customer === true) {
        alert("Login Successful");
        storeToken(response.data.tokens.access);
        navigate("/");
      } else if (response.data.is_vendor === true) {
        alert("Login Successful");
        storeToken(response.data.tokens.access);
        navigate("/VendorDashboard");
      } else {
        alert("Login Failed");
        return;
      }
    } catch (error) {
      alert("Invalid Credentials" + error);
      console.log("Error", error);
    }
  };

  return (
    <div>
      <Navbar />

      <MDBContainer fluid className="p-3 my-5">
        <MDBRow>
          <MDBCol col="10" md="5">
            <img src={logo} class="img-fluid" alt="Phone image" />
          </MDBCol>

          <MDBCol col="4" md="6">
            <h3>Login</h3>
            <MDBInput
              wrapperClass="mb-4"
              placeholder="User Name"
              id="form1"
              type="email"
              name="username"
              onChange={inputHandler}
            />
            <MDBInput
              wrapperClass="mb-4"
              placeholder="Password"
              id="form2"
              type="password"
              name="password"
              onChange={inputHandler}
            />

            <div className="d-flex justify-content-between mx-4 mb-4">
              <Link to="/forgotPassword">Forgot Password</Link>
            </div>
            <button
              class="btn btn-primary w-100 h-10"
              onClick={loginButtonHandler}
            >
              Sigin
            </button>

            <p>
              Don't have an account?<Link to="/register">Register</Link>{" "}
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <Footer />
    </div>
  );
}

export default App;
