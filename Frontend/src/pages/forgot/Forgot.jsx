import { useState } from "react";
import { Link } from "react-router-dom";
import "./forgot.scss";
import axios from "axios";
import Joi from "joi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  let navigate = useNavigate(); // Navigator
  // State Handler in input feilds
  const [state, setState] = useState(() => {
    return {
      email: "",
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
    

    // If Validation Passed
    console.log("shop vendor Ready to Register : ", state);

    try {
      // If Got the error 409 Confilic Error
      await axios.post("http://127.0.0.1:8000/email-link/", {
        email: state.email,
      });
    } catch (error) {
      //    Check weather this was code=409
      if (!error.response) {
        alert("--- Error: Server Not Responding --- " + error.message);
      } else if (error.response.status === 409) {
        alert("Error");
      } else {
        alert("Error Occured" + error.message);
      }
      return;
    }

    alert("Password Change Link sent to your email. Please check your inbox.");
    navigate("/login");
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Forgot Password </h1>
          <form>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleInput}
            />

            <Link>
              <button onClick={handleSubmitButton}>
                Reset Password Link in Email
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
