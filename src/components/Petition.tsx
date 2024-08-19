import axios from 'axios';
import React from "react";
import {Link, useNavigate, useParams } from "react-router-dom";

interface Petition {
  categoryId: number;
  creationDate: string;
  numberOfSupporters: number;
  ownerFirstName: string;
  ownerId: number;
  ownerLastName: string;
  petitionId: number;
  supportingCost: number;
  title: string;
  description: string;
  heroImage: string;
  moneyRaised: number;
  supportTiers: SupportTier[];
}

interface SupportTier {
  title: string;
  description: string;
  cost: number;
}

interface Supporter {
  supportId: number;
  supportTierId: number;
  message: string;
  supporterId: number;
  supporterFirstName: string;
  supporterLastName: string;
  timestamp: string;
}


const defaultPetition: Petition = {
  categoryId: 0,
  creationDate: '',
  numberOfSupporters: 0,
  ownerFirstName: '',
  ownerId: 0,
  ownerLastName: '',
  petitionId: 0,
  supportingCost: 0,
  title: '',
  description: '',
  heroImage: '',
  moneyRaised: 0,
  supportTiers: [],
};



const Petition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [petition, setPetition] = React.useState<Petition>(defaultPetition);
  const [similarPetitions, setSimilarPetitions] = React.useState<Petition[]>([]);
  const [supporters, setSupporters] = React.useState<Supporter[]>([]);
  const [petitionImage, setPetitionImage] = React.useState('');

  const deletePetition = (petition: Petition) => {
    axios.delete('http://localhost:4941/api/v1/petitions/' + id)
      .then((response) => {
        navigate('/');
      }, (error) => {
        setErrorFlag(true);
        setErrorMessage(error.toString());
      });
  };


      const getSupporters = () => {
        axios.get('http://localhost:4941/api/v1/petitions/' + id + '/supporters')
          .then((response) => {
            setErrorFlag(false);
            setErrorMessage('');
            setSupporters(response.data);
          }, (error) => {
            setErrorFlag(true);
            setErrorMessage(error.toString());
          });
      };

      const getPetitionImage = () => {
        axios.get('http://localhost:4941/api/v1/petitions/' + id + '/image')
          .then((response) => {
            setErrorFlag(false);
            setErrorMessage('');
            setPetitionImage(response.data);
            console.log(petitionImage)
          }, (error) => {
            setErrorFlag(true);
            setErrorMessage(error.toString());
          });
      };

    const fetchSimilarPetitions = (categoryId: number, ownerId: number) => {
      axios.get(`http://localhost:4941/api/v1/petitions/?categoryId=${categoryId}&ownerId=${ownerId}`)
        .then((response) => {
          setSimilarPetitions(response.data);
        }, (error) => {
          console.error('Error fetching similar petitions:', error);
        });
      }


    React.useEffect(() => {
      const getPetition = () => {
        axios.get('http://localhost:4941/api/v1/petitions/' + id)
          .then((response) => {
            setErrorFlag(false);
            setErrorMessage('');
            setPetition(response.data);
            fetchSimilarPetitions(response.data.categoryId, response.data.ownerId);
          }, (error) => {
            setErrorFlag(true);
            setErrorMessage(error.toString());
          });
      };

    getPetition();
    getSupporters();
    getPetitionImage();
  }, [id]);

    if (errorFlag) {
        return (
        <div>
        <h1>User</h1>
        <div style={{ color: "red" }}>
        {errorMessage}
        </div>
        <Link to={"/"}>Back to petitions</Link>
        </div>
        )
        } else {

        return (
        <div>
        <div className="petition-page">
        <div className="petition-details">
            <h1>{petition.title}</h1>
            <img src={'http://localhost:4941/api/v1/petitions/' + id + '/image'} alt="Hero" className="hero-image" />
            <p>Created on: {petition.creationDate}</p>
            <h4>{petition.description}</h4>
            <div className="owner-info">
              <h4>Owner: {petition.ownerFirstName} {petition.ownerLastName}</h4>
            </div>
            <h4>Number of Supporters: {petition.numberOfSupporters}</h4>
            <h4>Total Money Raised: ${petition.moneyRaised}</h4>
            <br/>
            <h2>Support Tiers</h2>
            <div className="support-tiers">
              {petition.supportTiers && petition.supportTiers.length > 0 ? (
                petition.supportTiers.map((tier, index) => (
                  <div key={index} className="support-tier">
                    <h3>{tier.title}</h3>
                    <p>{tier.description}</p>
                    <p>Cost: ${tier.cost}</p>
                  </div>
                ))
              ) : (
                <p>No support tiers available</p>
              )}
            </div>

            <h2>Supporters</h2>
            {supporters && supporters.length > 0 ? (
              <div className="supporters-list">
                {supporters.map((supporter, index) => (
                  <div key={index} className="supporter">
                    <p>{supporter.supporterFirstName} {supporter.supporterLastName}</p>
                    <p>Message: {supporter.message}</p>
                    <p>{new Date(supporter.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No supporters yet</p>
            )}

            <h2>Similar Petitions</h2>
            <div className="similar-petitions">
              {similarPetitions.length > 0 ? (
                similarPetitions.map((similarPetition) => (
                  <div key={similarPetition.petitionId} className="similar-petition">
                    <h3>{similarPetition.title}</h3>
                    <img src={similarPetition.heroImage} alt="Hero" className="hero-image" />
                    <p>Created on: {similarPetition.creationDate}</p>
                    <p>{similarPetition.description}</p>
                    <div className="owner-info">
                      <p>Owner: {similarPetition.ownerFirstName} {similarPetition.ownerLastName}</p>
                    </div>
                    <p>Number of Supporters: {similarPetition.numberOfSupporters}</p>
                    <p>Total Money Raised: ${similarPetition.moneyRaised}</p>
                  </div>
                ))
              ) : (
                <p>No similar petitions available</p>
              )}
            </div>
          </div>
          </div>
        
        
        <div className="modal fade" id="deleteUserModal" tabIndex={-1} role="dialog" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
        <div className="modal-content">
        <div className="modal-header">
        <h5 className="modal-title" id="deleteUserModalLabel">Delete Petition</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div className="modal-body">
        Are you sure that you want to delete this petition?
        </div>
        <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">  Close</button>
        <button type="button" className="btn btn-primary" data-dismiss="modal"
        onClick={() => deletePetition}>
        Delete Petition
        </button>
        </div>
        </div>
        </div>
        </div>

        </div>
        )
    }
}

export default Petition;
    