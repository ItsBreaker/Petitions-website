import axios from 'axios';
import React from "react";
import {Link} from 'react-router-dom';



const Users = () => {

const [users, setUsers] = React.useState < Array < User >> ([])
const [errorFlag, setErrorFlag] = React.useState(false)
const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        getUsers()
        }, [])
            const getUsers = () => {
            axios.get('http://localhost:4941/api/v1/users')
            .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setUsers(response.data)
            }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
            })
    }

const list_of_users = () => {
        return users.map((item: User) =>
        <tr key={item.firstName}>
        <th scope="row">{item.firstName}</th>
        <td>{item.lastName}</td>
        <td><Link to={"/users/" + item.firstName+item.lastName}>Go to user</Link></td>
        <td>
        <button type="button">Delete</button>
        <button type="button">Edit</button>
        </td>
        </tr>
        )
    }
    


if (errorFlag) {
    return (
    <div>
    <h1>Users</h1>
    <div style={{ color: "red" }}>
    {errorMessage}
    </div>
    </div>
    )
    } else {
    return (
    <div>
    <h1>Users</h1>
    <table className="table">
    <thead>
    <tr>
    <th scope="col">#</th>
    <th scope="col">username</th>
    <th scope="col">link</th>
    <th scope="col">actions</th>
    </tr>
    </thead>
    <tbody>
    {list_of_users()}
    </tbody>
    </table>
    </div>
    )
}
    


}

export default Users;