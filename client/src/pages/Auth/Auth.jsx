import React from "react";
import "./Auth.css";
import Logo from "../../img/logo.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logIn, signUp } from "../../actions/AuthAction";
const Auth = () => {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.authReducer.loading)
  const [isSignUp, setIsSignUp] = useState(true);
  console.log(loading)
  const [data, setData] = useState({ firstName: '', lastName: "", email: '', password: "", confirmPassword: "" })
  const [confirmPassword, setconfirmPassword] = useState(true)
  const handleInputField = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }
  const handleSubmitButton = (e) => {
    e.preventDefault();
    if (isSignUp) {
      data.password === data.confirmPassword ? dispatch(signUp(data)) : setconfirmPassword(false);
    } else {
      dispatch(logIn(data))
    }
  }
  return (
    <div className="Auth">
      {/* left side */}
      <div className="a-left">
        <img src={Logo} alt="" />
        <div className="Webname">
          <h1>ZKC Media</h1>
          <h6>Explore the ideas throughout the world</h6>
        </div>
      </div>
      {/* right side */}
      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmitButton}>
          <h3>{isSignUp ? "Sign Up" : "Log In"}</h3>
          {isSignUp &&
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="infoInput"
                name="firstName"
                onChange={handleInputField}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="infoInput"
                name="lastName"
                onChange={handleInputField}
              />
            </div>
          }

          <div>
            <input
              type="text"
              className="infoInput"
              name="email"
              placeholder="Email"
              onChange={handleInputField}
            />
          </div>
          <div>
            <input
              type="password"
              className="infoInput"
              name="password"
              placeholder="Password"
              onChange={handleInputField}
            />
            {isSignUp &&
              <input
                type="password"
                className="infoInput"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleInputField}
              />
            }
          </div>
          <span style={{ display: confirmPassword ? 'none' : 'block', color: 'red', fontsize: '10px', alignSelf: 'flex-end', marginRight: '5px' }}>
            *Confirm password is not match
          </span>

          <div>
            <span style={{ fontSize: '12px', cursor: 'pointer' }} onClick={() => setIsSignUp((previousValue) => !previousValue)}>{isSignUp ? "Already have an account. Log In!" : "Don't have an account. Sign Up!"} </span>
          </div>
          <button className="button infoButton" type="submit" disabled={loading}>{loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}</button>
        </form>
      </div>
    </div >
  );
};
// function LogIn() {
//   return (
<div className="a-right">
  <form className="infoForm authForm">
    <h3>Log In</h3>

    <div>
      <input
        type="text"
        placeholder="Username"
        className="infoInput"
        name="username"
      />
    </div>

    <div>
      <input
        type="password"
        className="infoInput"
        placeholder="Password"
        name="password"
      />
    </div>

    <div>
      <span style={{ fontSize: "12px" }}>
        Don't have an account Sign up
      </span>
      <button className="button infoButton">Login</button>
    </div>
  </form>
</div>

export default Auth;
