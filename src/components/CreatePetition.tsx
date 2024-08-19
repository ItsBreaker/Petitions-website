import React, { useState } from 'react';
import axios from 'axios';
import {useParams } from "react-router-dom";

interface SupportTier {
  title: string;
  description: string;
  amount: number;
}

interface Category {
  categoryId: number;
  name: string;
}


const CreatePetitionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supportTiers, setSupportTiers] = useState<SupportTier[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);
  //const [editedData, setEditedData] = useState<Petition>({  });

  const {id} = useParams();
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")


      const handleEditClick = () => {
        setEditing(true);
      };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
  };

  const handleSupportTierChange = (index: number, field: keyof SupportTier, value: string | number) => {
    setSupportTiers(prevTiers => {
      const updatedTiers = [...prevTiers];
      updatedTiers[index] = {
        ...updatedTiers[index],
        [field]: value
      };
      return updatedTiers;
    });
  };

  const handleAddSupportTier = () => {
    if (supportTiers.length < 3) {
      setSupportTiers(prevTiers => [...prevTiers, { title: '', description: '', amount: 0 }]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif') {
        setImage(file);
      } else {
        alert('Only PNG, JPEG, and GIF files are allowed.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit data to server
    console.log('Petition Data:', { title, description, categoryId, supportTiers, image });
    axios.post('http://localhost:4941/api/v1/petitions/', {
      title: title,
      description: description,
      categoryId: categoryId,
      supportTiers: supportTiers,
      
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }})
        .then((response) => {
        setErrorFlag(false)
        setErrorMessage("")
        console.log(response.data)
        setCategories(response.data)
        }, (error) => {
        setErrorFlag(true)
        setErrorMessage(error.toString())
  })
};

  const [categories, setCategories] = React.useState([])


  React.useEffect(() => {
    const getCateogries = () => {
    axios.get('http://localhost:4941/api/v1/petitions/categories')
        .then((response) => {
        setErrorFlag(false)
        setErrorMessage("")
        setCategories(response.data)
        }, (error) => {
        setErrorFlag(true)
        setErrorMessage(error.toString())
    })
    }
    getCateogries()
    }, [])

  return (
    <div>
    {!editing && (
    <div className="create-petition-page">
      <h2>Create Petition</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={handleDescriptionChange} required />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select value={categoryId} onChange={handleCategoryChange} required>
            <option value="">Select a category</option>
            {categories.map((category: Category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Support Tiers:</label>
          {supportTiers.map((tier, index) => (
            <div key={index} className="support-tier">
              <input type="text" value={tier.title} onChange={(e) => handleSupportTierChange(index, 'title', e.target.value)} placeholder="Title" required />
              <textarea value={tier.description} onChange={(e) => handleSupportTierChange(index, 'description', e.target.value)} placeholder="Description" required />
              <input type="number" value={tier.amount} onChange={(e) => handleSupportTierChange(index, 'amount', parseInt(e.target.value))} placeholder="Amount" required />
            </div>
          ))}
          {supportTiers.length < 3 && <button type="button" onClick={handleAddSupportTier}>Add Support Tier</button>}
        </div>
        <div className="form-group">
          <label>Image:</label>
          <input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} required />
        </div>
        <button type="submit">Submit</button>
        <button type="submit" style={{marginLeft:"30px"}} onClick={handleEditClick}>Edit</button>
      </form>
    </div>
        )}

        {editing && (
          <div className="create-petition-page">
          <h2>Edit Petition</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input type="text" value={title} onChange={handleTitleChange} required />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea value={description} onChange={handleDescriptionChange} required />
            </div>
            <div className="form-group">
            <select value={categoryId} onChange={handleCategoryChange} required>
            <option value="">Select a category</option>
            {categories.map((category: Category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
            </div>
            <div className="form-group">
              <label>Support Tiers:</label>
              {supportTiers.map((tier, index) => (
                <div key={index} className="support-tier">
                  <input type="text" value={tier.title} onChange={(e) => handleSupportTierChange(index, 'title', e.target.value)} placeholder="Title" required />
                  <textarea value={tier.description} onChange={(e) => handleSupportTierChange(index, 'description', e.target.value)} placeholder="Description" required />
                  <input type="number" value={tier.amount} onChange={(e) => handleSupportTierChange(index, 'amount', parseInt(e.target.value))} placeholder="Amount" required />
                </div>
              ))}
              {supportTiers.length < 3 && <button type="button" onClick={handleAddSupportTier}>Add Support Tier</button>}
            </div>
            <div className="form-group">
              <label>Image:</label>
              <input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} required />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        )}
        </div>
  );
}

export default CreatePetitionPage;
