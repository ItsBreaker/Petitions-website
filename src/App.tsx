import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Users from "./components/Users";
import User from "./components/User";
import NotFound from "./components/NotFound";
import Petitions from "./components/Petitions";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import CreatePetition from "./components/CreatePetition";
import Petition from "./components/Petition";
import axios from 'axios';

interface User {
  firstName: string,
  lastName: string,
  email: string,
}

const defaultUser:User = {
  firstName: '',
  lastName: '',
  email: ''
}

function App() {
  const [id, setId] = React.useState(0);
  const [user, setUser] = React.useState<User>(defaultUser);
  const [errorFlag, setErrorFlag] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  
  React.useEffect(() => {
    const idobj = localStorage.getItem("userId");
    if (idobj) {
      setId(parseInt(idobj, 10));
    }
  const getUser = () => {
  axios.get('http://localhost:4941/api/v1/users/'+id)
      .then((response) => {
      setErrorFlag(false)
      setErrorMessage("")
      setUser(response.data)
      }, (error) => {
      setErrorFlag(true)
      setErrorMessage(error.toString())
  })
  }
  getUser()
  }, [id])

  const doLogout = () => {
    localStorage.setItem("userId", "")
    localStorage.setItem("authToken","")
    setId(0);
  }



return (
  
  <div className="App">
     <nav className="top-nav">
        <div className="logo">Petitions SENG365</div>
        <ul className="nav-links">
        <li><a href="/">Petitions</a></li>
        {(id !== 0) && (
          <>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/createPetition">Create Petition</a></li>
          <li><a className="nav-button" onClick={doLogout} href="/">Logout</a></li>
          </>
        )}
        {id === 0 && (
          <><li><a className="nav-button" href="/login">Login</a></li>
            <li><a className="nav-button" href="/register">Register</a></li>
          </>
          )}
        </ul>
      </nav>
    <Router>
    <div>
      <Routes>
      <Route path="/users" element={<Users/>}/>
      <Route path="/users/:id" element={<User/>}/>
      <Route path="*" element={<NotFound/>}/>
      <Route path="/" element={<Petitions/>}/>
      <Route path="/petitions/:id" element={<Petition/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/profile" element={<Profile {...user} />}/>
      <Route path="/createpetition" element={<CreatePetition />}/>
    </Routes>
    </div>
    </Router>
    </div>
  );
}

export default App;