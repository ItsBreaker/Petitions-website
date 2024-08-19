import axios from 'axios';
import React,{useState} from "react";
import {Link} from "react-router-dom";

interface Petition {
    categoryId: number,
    creationDate: string;
    numberOfSupporters: number;
    ownerFirstName: string;
    ownerId: number;
    ownerLastName: string;
    petitionId: number;
    supportingCost: number;
    title: string;
  }

  interface Category {
    categoryId: number;
    name: string;
  }

const Petitions = () => {
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    
    const [petitions, setPetitions] = React.useState < Array < Petition >> ([])
    const [searchQuery, setSearchQuery] = useState('');
    const [index, setIndex] = useState(1);

    const [categories, setCategories] = React.useState < Array < Category >> ([])
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedCategories, setSelectedCategories] = useState < Array < Category >> ([]);
    const [maxSupportCost, setMaxSupportCost] = useState<number | undefined>(undefined);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [id, setId] = React.useState(0);

    
   
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(event.target.value);
    };

        const handleCategoryChange = (category: Category) => {
          setSelectedCategories(prevSelectedCategories => {
            if (prevSelectedCategories.some(cat => cat.categoryId === category.categoryId)) {
              return prevSelectedCategories.filter(cat => cat.categoryId !== category.categoryId);
            } else {
              return [...prevSelectedCategories, category];
            }
          });
        };

      const handleMaxSupportCostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          setMaxSupportCost(value ? parseFloat(value) : undefined);
        };
  
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

    React.useEffect(() => {
        getUsers()
        getCategories()
        const idobj = localStorage.getItem("userId");
          if (idobj) {
            setId(parseInt(idobj, 10));
          }
        }, [])
    
        const getUsers = () => {
            axios.get('http://localhost:4941/api/v1/petitions')
            .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setPetitions(response.data.petitions)
            }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
            })
        }

        const getCategories = () => {
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

        const displaySpecificUsers = () => {
                axios.get('http://localhost:4941/api/v1/petitions/'+index.toString())
            .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setPetitions(response.data.petitions)
            setIndex(index+1)
            console.log(index)
            }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
            })

        }

        const sortPetitions = (petitions: Array<Petition>, option: string) => {
          switch (option) {
            case 'ascAlpha':
              return [...petitions].sort((a, b) => a.title.localeCompare(b.title));
            case 'descAlpha':
              return [...petitions].sort((a, b) => b.title.localeCompare(a.title));
            case 'ascCost':
              return [...petitions].sort((a, b) => a.supportingCost - b.supportingCost);
            case 'descCost':
              return [...petitions].sort((a, b) => b.supportingCost - a.supportingCost);
            case 'ascDate':
              return [...petitions].sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
            case 'descDate':
              return [...petitions].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
            default:
              return petitions;
          }
        };
      
        const filteredPetitions = petitions.filter(item => {
          const matchesSearchQuery = item.title.includes(searchQuery);
          const matchesMaxCost = maxSupportCost ? item.supportingCost <= maxSupportCost : true;
          const matchesCategory = selectedCategories.length
            ? selectedCategories.some(category => category.categoryId === item.categoryId)
            : true;
      
          return matchesSearchQuery && matchesMaxCost && matchesCategory;
        });
      
        const sortedPetitions = sortPetitions(filteredPetitions, selectedOption);
      
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPetitions = sortedPetitions.slice(startIndex, endIndex);
      
        const totalPages = Math.ceil(sortedPetitions.length / pageSize);
      
        const handleNextPage = () => {
          if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
          }
        };
      
        const handlePreviousPage = () => {
          if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
          }
        };
      
        const handleFirstPage = () => {
          setCurrentPage(1);
        };
      
        const handleLastPage = () => {
          setCurrentPage(totalPages);
        };
      

        const getSpecificUsers = (ownerId: number,q: string,supportingCost: number, categoryIds: number, startIndex: number, count: number) => {
            var whereConditions = "";
            if (!(ownerId === 0)) {
                whereConditions = whereConditions + 'ownerId=' + ownerId.toString()
            }
            if (!(supportingCost === 0)) {
                whereConditions = whereConditions + '&supportingCost=' + supportingCost.toString()
            }
            if (!(categoryIds === 0)) {
                whereConditions = whereConditions + '&categoryIds=' + categoryIds.toString()
            }
            if (!(startIndex === 0)) {
                whereConditions = whereConditions + '&startIndex=' + startIndex.toString()
            }
            if (!(count === 0)) {
                whereConditions = whereConditions + '&count=' + count.toString()
            }
            axios.get('http://localhost:4941/api/v1/petitions?'+whereConditions)
            .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setPetitions(response.data.petitions)
            }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
            })
        }


const list_of_petitions = () => {
    try {
        
        return  paginatedPetitions.map((item) => (
          <tr key={item.petitionId}>
            <th scope="row">{item.title}</th>
            <td>{item.creationDate}</td>
            <td>{item.numberOfSupporters}</td>
            <td>${item.supportingCost}.00</td>
            <td>{item.categoryId}</td>
            <td>{item.ownerFirstName} {item.ownerLastName}</td>
            <td>
              <div className="action-buttons">
                <Link to={`/petitions/${item.petitionId}`} className="btn btn-link">Go to petition</Link>
              </div>
            </td>
          </tr>

          
        ))}
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
            <h1>Petitions</h1>
            <div className="searchBar">
                <input style={{width:'300px'}} type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search..." />
                <button style={{width:'100px'}} type="submit" onClick={displaySpecificUsers}>Search</button>
            </div>
      
      
      <div className='menu'>

        <div className='sortBar'>
          <label htmlFor="sortDropdown">Sort by: </label>
          <select id="sortDropdown" value={selectedOption} onChange={handleSelectChange}>
          <option value="">Select Sorting Option</option>
          <option value="ascAlpha">Ascending Alphabetically</option>
          <option value="descAlpha">Descending Alphabetically</option>
          <option value="ascCost">Ascending by Supporting Cost</option>
          <option value="descCost">Descending by Supporting Cost</option>
          <option value="ascDate">Chronologically by Creation Date</option>
          <option value="descDate">Reverse Chronologically by Creation Date</option>
        </select>

        <label style={{marginTop:'20px'}} htmlFor="filterBy">Filter by supporting cost: </label>
          $<input type="number"
          id="filterByCost"
          value={maxSupportCost !== undefined ? maxSupportCost : ''}
          onChange={handleMaxSupportCostChange}/>
      </div>

      <div className='filterBar'>
      <label htmlFor="filterBy">Filter by category: </label>
      <br/>
        {categories.map(item => (
             <div key={item.categoryId}>
             <input
               type="checkbox"
               value={item.name}
               onChange={() => handleCategoryChange(item)}
             />
             {item.name}
           </div>
        ))}
      </div>

    </div>



       <table>
  <thead>
    <tr>
      <th scope="col">Title</th>
      <th scope="col">Creation Date</th>
      <th scope="col">Number of Supporters</th>
      <th scope="col">Supporting Cost</th>
      <th scope="col">Category ID</th>
      <th scope="col">Owner Name</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
  {list_of_petitions()}
  </tbody>
</table>

  <div className="pagination">
        <button onClick={handleFirstPage} disabled={currentPage === 1}>First</button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        <button onClick={handleLastPage} disabled={currentPage === totalPages}>Last</button>
      </div>
      {sortedPetitions.length === 0 && <div>No petitions found</div>}
    </div>
  
        )
    }
}

export default Petitions;
    