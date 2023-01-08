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


function Register() {
  let navigate = useNavigate(); // Navigator
  // State Handler in input feilds
  const [state, setState] = useState(() => {
    return {
      username: "",
      email: "",
      password: "",
      password2: "",
    
      Customer_phone: "",
      Customer_address: "",
    };
  });
  // function to handle the inputs
  function handleInput(event) {
    let { name, value } = event.target;
    console.log(name, value);
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }
  function validateRegistrationInput(data) {
    const registerValidation = Joi.object({
      username: Joi.string().min(3).required(),
      email: Joi.string()
        .min(6)
        .email({ tlds: { allow: false } })
        .required(),
    });
    return registerValidation.validate(data);
  }

  let handleSubmitButton = async () => {
    console.log("Initial Data :  ", state);
    // validate Input Feilds
    // let { error } = validateRegistrationInput(state);
    // if (error) {
    //   alert("Error Validation : " + error.message);
    //   return;
    // }

    // If Validation Passed
    console.log("Customer Ready to Register : ", state);

    try {
      // If Got the error 409 Confilic Error
      await axios.post("http://127.0.0.1:8000/customer/register/", {
        username: state.username,
        email: state.email,
        password: state.password,
        password2: state.password2,
        Customer_phone: state.Customer_phone,
        Customer_address: state.Customer_address,
      });
    } catch (error) {
      //    Check weather this was code=409
      if (!error.response) {
        alert("--- Error: Server Not Responding --- " + error.message);
      } else if (error.response.status === 400) {
        alert("Bad Request Error Occured } " + error.message);
      } else {
        alert("Some other error Occured } " + error.message);
      }
      return;
    }

    alert("Registration Successfull");
    navigate("/login");
  };

  return (
    <div>
      <Navbar />

      <MDBContainer fluid className="p-3 my-5">
        <MDBRow>
          <MDBCol col="10" md="6">
            <img src={logo} class="img-fluid" alt="Phone image" />
          </MDBCol>

          <MDBCol col="4" md="6">
            <h3>Welcome to CementO Customer Register</h3>

            <MDBInput
              wrapperClass="mb-4"
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleInput}
            />

            <MDBInput
              wrapperClass="mb-4"
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleInput}
            />

            <MDBInput
              wrapperClass="mb-4"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleInput}
            />
            <MDBInput
              wrapperClass="mb-4"
              type="password"
              placeholder="Confirm Password"
              name="password2"
              onChange={handleInput}
            />

 
            <MDBInput
              wrapperClass="mb-4"
              type="text"
              placeholder="Customer_phone"
              name="Customer_phone"
              onChange={handleInput}
            />
            <MDBInput
              wrapperClass="mb-4"
              type="text"
              placeholder="Customer_address"
              name="Customer_address"
              onChange={handleInput}
            />

            <button
              class="btn btn-primary w-100 h-10"
              onClick={handleSubmitButton}
            >
              Register
            </button>

            <p>
              Account?<Link to="/login">login</Link>{" "}
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <Footer />
    </div>
  );
}

export default Register;

