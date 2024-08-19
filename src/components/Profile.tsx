import React, {useState} from "react";

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
  }

const Profile: React.FC<UserProfile> = ({ firstName, lastName, email }) => {
    const [editing, setEditing] = useState(false);
    const [editedData, setEditedData] = useState<UserProfile>({ firstName, lastName, email });
    const [id, setId] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };

      
    React.useEffect(() => {
      const idobj = localStorage.getItem("userId");
        if (idobj) {
          setId(parseInt(idobj, 10));
        }
      }, [])

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // You can perform further actions like updating the user's data
        console.log('Updated Data:', editedData);
        setEditing(false);
      };

      const handleEditClick = () => {
        setEditing(true);
      };

    // Use a default profile picture if none is provided
    const defaultProfilePicture = 'default-profile-picture.png';
  
    return (
      <div className="profile-page">
      <div className="profile-header">
        <h2>Welcome, {firstName} {lastName}</h2>
        <img src={'http://localhost:4941/api/v1/users/' + id + '/image'} alt="Profile" className="profile-picture" />
        {editing && (
          <div className="edit-form-popup">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" value={editedData.firstName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" value={editedData.lastName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={editedData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" />
              </div>
              <div className="form-group">
                <label htmlFor="newProfilePicture">New Profile Picture:</label>
                <input type="file" id="newProfilePicture" accept="image/*" />
              </div>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        )}  

        </div>
          {!editing && (
            <div className="profile-info">
              <button onClick={handleEditClick}>Edit Profile</button>
              <p><strong>First Name:</strong> {firstName}</p>
              <p><strong>Last Name:</strong> {lastName}</p>
              <p><strong>Email:</strong> {email}</p>
            </div>
          )}

    </div>
  );

}

export default Profile;
    