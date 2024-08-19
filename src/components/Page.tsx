import axios from 'axios';
import React from "react";
import {Link, useNavigate, useParams } from "react-router-dom";

const Page = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    
    const [users, setUsers] = React.useState < Array < User >> ([])

    React.useEffect(() => {
        getUsers()
        }, [])
            const getUsers = () => {
            axios.get('http://localhost:4941/api/v1/petitions')
            .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            console.log(response.data)
            setUsers(response.data)
            }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
            })
    }

const list_of_petitions = () => {
    try {
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
        )}
        catch {
            return (
                <div>
                
                <h1>No Petitions</h1>
        
                </div>
                ) 
        }
    }

    
    if (errorFlag) {
        return (
        <div>
        <h1>Petitions</h1>
        <div style={{ color: "red" }}>
        {errorMessage}
        </div>
        <Link to={"/users"}>Back to users</Link>
        </div>
        )
        } else {
        return (
        <div>
        
        {list_of_petitions()}

        </div>
        )
    }
}

export default Page;
    