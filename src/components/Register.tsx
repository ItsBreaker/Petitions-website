import axios from 'axios';
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

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
        // Submit data to server
        axios.post('http://localhost:4941/api/v1/users/register', {
          "firstName": firstName,
          "lastName": lastName,
          "email": email,
          "password": password,
          
        }, {
          headers: {
            
          }})
            .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            navigate("/login");
            }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
      })}


    return (
        <div className="container">
        <h2>Register</h2>
            <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" required onChange={handleFirstNameChange} />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" required onChange={handleLastNameChange} />
            </div>
            <div className="form-group">
                <label htmlFor="profileImg">Profile Image</label>
                <input type="file" id="profileImg" name="profileImg" />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email"  name="email" required onChange={handleEmailChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" onChange={handlePasswordChange} required />
                <br/>
                <input type="checkbox" onChange={showPassword}/>Show Password
                <br/>
            </div>
            {errorMessage}
            <button type="submit" onClick={handleSubmit}>Register</button>
    </div>  
    )
}

export default Register;
    