import axios from 'axios';
import React, {useState} from "react";
import {useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const showPassword = () => {
        var passwordType = document.getElementById("password") as HTMLInputElement;
        if (passwordType.type === "password") {
            passwordType.type = "text";
          } else {
            passwordType.type = "password";
          }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:4941/api/v1/users/login', {
          email: email,
          password: password,
          
        }, {
          headers: {
            
          }})
            .then((response) => {
            console.log(response)
            setErrorFlag(false)
            setErrorMessage("")
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("authToken", response.data.token);
            navigate("/");
            window.location.reload();
            }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
      })}


    return (
        <div className="container">
        <h2>Login</h2>
            <div className="form-group">
                <label htmlFor="username">Email</label>
                <input type="text" id="email" name="email" required onChange={handleEmailChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required onChange={handlePasswordChange}/>
                <br/>
                <input type="checkbox" onChange={showPassword}/>Show Password
                <br/>
            </div>
            {errorMessage}
            <button type="submit" onClick={handleSubmit}>Login</button>
    </div>  
    )
}

export default Login;
    