import React, { useState } from 'react';
import '../css/Inscription.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PageInscription = () =>
{
    const [messageErreur, setMessageErreur] = useState('');
    const navigate = useNavigate();

    const gererSoumission = async (e) => 
    {
        e.preventDefault();
        const donneeFormulaire = new FormData(e.target);
        if (donneeFormulaire.get("confmdp") !== donneeFormulaire.get("mdp")) 
        {
            setMessageErreur('Les mots de passe ne correspondent pas.');
            return;
        }
        
        try 
        {
            const reponse = await axios.post('https://dummyjson.com/users/add', 
            {
                lastName: donneeFormulaire.get('nom'),
                firstName: donneeFormulaire.get('prenom'),
                username: donneeFormulaire.get('nomUsager'),
                email: donneeFormulaire.get('courriel'),
                phone: donneeFormulaire.get('tel'),
                address: { adresse: donneeFormulaire.get('adresse') },
                password: donneeFormulaire.get('mdp'),
                role: donneeFormulaire.get('role')
            });

            if (reponse.status === 201) 
            {
                if(donneeFormulaire.get("role") === "client")
                {
                    navigate('/pageconnexionclient');
                }
                else
                {
                    navigate('/pageconnexionmecanicien');
                }
            } 
            else 
            {
                setMessageErreur("Erreur lors de la création de l'utilisateur!");
            }
        } 
        catch (error) 
        {
            setMessageErreur("Erreur lors de la création de l'utilisateur!");
        }
    };


    return (
        <div className="inscription-container">
            <h2>Inscription</h2>
            <form onSubmit={gererSoumission}>
                <input type="text" name='nom' placeholder="Nom" required />
                <input type="text" name='prenom' placeholder="Prénom" required />
                <input type="text" name='nomUsager' placeholder="Nom d'utilisateur" required></input>
                <input type="email"name='courriel' placeholder="Adresse courriel" required />
                <input type="tel"  name='tel'placeholder="Numéro de téléphone" required />
                <input type="text" name='adresse' placeholder="Adresse" required />
                <input type="password" name='mdp'placeholder="Mot de passe" required />
                <input type="password" name='confmdp'placeholder="Confirmer le mot de passe" required />
                <select name="role" required>
                    <option value="client">Client</option>
                    <option value="mecanicien">Mécanicien</option>
                </select>
                <button type="submit">S'inscrire</button>
                {messageErreur && <p style={{ color: 'red' }}>{messageErreur}</p>}
            </form>
        </div>
    );
};

export default PageInscription;
