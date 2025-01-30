import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { connect } from "react-redux";

const PageConnexionMecanicien = ({ setUser }) => 
{	
  	const [messageErreur, setMessageErreur] = useState('');
  	const navigate = useNavigate();

  	const gererConnexion = async (e) =>
	{
		e.preventDefault();
		const donneeFormulaire = new FormData(e.target);

		try 
		{
			const reponse = await axios.post('https://dummyjson.com/users/login', 
			{
				username: donneeFormulaire.get('username'),
				password: donneeFormulaire.get('mdp'),
			});

			if (reponse.status === 200) 
			{
                try 
                {
                    const reponsInfoSupp = await axios.get(`https://dummyjson.com/users/${reponse.data.id}`);

                    if (reponsInfoSupp.status === 200)
                    {
                        const infoSupplementaire = {adresse:{adresse: reponsInfoSupp.data.address.address}, tel: reponsInfoSupp.data.phone};
                        const utilisateurComplet = 
                        {
                            ...reponse.data,
                            ...infoSupplementaire
                        };
    
                        setUser(utilisateurComplet);
                        navigate('/pagemecanicien');
                    }
                    else
                    {
                        setMessageErreur("Erreur lors de la récupération des informations!");
                    }
                    
                }
                catch (error) 
                {
                    setMessageErreur("Erreur lors de la récupération des informations!", error);
                }
                
			} 
			else 
			{
				setMessageErreur("Erreur lors de la connexion!");
			}
		} 
		catch (error) 
		{
			setMessageErreur("Erreur lors de la connexion!",error);
		}
	};

  	return(
  	  <div className="login-container">
  	    <h1>Connexion Mécanicien</h1>
  	    <form onSubmit={gererConnexion} className="login-form">
  	      <input type="text" name="username" placeholder="Nom d'utilisateur" required />
  	      <input type="password" name="mdp" placeholder="Mot de passe" required />
  	      <button type="submit">Se connecter</button>
  	      {messageErreur && <p className="error-message">{messageErreur}</p>}
  	    </form>
  	  </div>
  	);
};

const mapDispatchToProps = (dispatch) => ({
    setUser: (user) => dispatch({type: 'SET_USER',payload:user}),
});

export default connect(null,mapDispatchToProps)(PageConnexionMecanicien);