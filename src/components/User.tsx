import axios from 'axios';
import React from "react";
import {Link, useNavigate, useParams } from "react-router-dom";

const User = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    
    const [user, setUser] = React.useState<User>({firstName:"", lastName:""})
    const deleteUser = (user: User) => {
    axios.delete('http://localhost:3000/api/users/' + id)
    .then((response) => {
    navigate('/users')
    }, (error) => {
    setErrorFlag(true)
    setErrorMessage(error.toString())
    })
    }

    React.useEffect(() => {
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
    
    if (errorFlag) {
        return (
        <div>
        <h1>User</h1>
        <div style={{ color: "red" }}>
        {errorMessage}
        </div>
        <Link to={"/users"}>Back to users</Link>
        </div>
        )
        } else {

        return (
        <div>
        <div className="user-page">
  <h1>User Details</h1>
  <div className="user-info">
    <p><strong>First Name:</strong> {user.firstName}</p>
    <p><strong>Last Name:</strong> {user.lastName}</p>
  </div>
  <div className="user-actions">
    <Link to="/users" className="btn btn-secondary">Back to users</Link>
    <button type="button" className="btn btn-primary">Edit</button>
    <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#deleteUserModal">Delete</button>
  </div>
</div>
        
        
        <div className="modal fade" id="deleteUserModal" tabIndex={-1} role="dialog" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
        <div className="modal-content">
        <div className="modal-header">
        <h5 className="modal-title" id="deleteUserModalLabel">Delete User</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div className="modal-body">
        Are you sure that you want to delete this user?
        </div>
        <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">  Close</button>
        <button type="button" className="btn btn-primary" data-dismiss="modal"
        onClick={() => deleteUser(user)}>
        Delete User
        </button>
        </div>
        </div>
        </div>
        </div>

        </div>
        )
    }
}

export default User;
    