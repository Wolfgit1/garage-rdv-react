import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/App.css';
import { obtenirVehiculesAPI } from './actions/ActionsVehicules';
import { obtenirRdvsAPI } from './actions/ActionsRdvs';

const App = () => 
{

    const [initialiser, setInitialiser] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => 
    {
        if (!initialiser) 
        {
            localStorage.clear();
            initialisationApp();
            setInitialiser(true);
        }
        initialisationApp();
    }, 
    [initialiser]);

    const initialisationApp = () => 
    {
        console.log("Initialisation de l'application...");
        //obtenirVehiculesAPI("https://dummyjson.com/c/c6e7-bec5-486f-9428");
        //obtenirRdvsAPI("https://dummyjson.com/c/8e46-5801-45bc-8167");
    };

    const gererBtnInscription=() =>
    {
        navigate("./inscription");
    }
    const gererBtnClient=() =>
    {
        navigate("./pageconnexionclient");
    }
    const gererBtnMecanicien=() =>
    {
        navigate("./pageconnexionmecanicien");
    }

    return (
        <div className="login-container">
            <h1>Bienvenue</h1>
            <button onClick={gererBtnInscription}>Inscription</button>
            <button onClick={gererBtnClient}>Connexion Client</button>
            <button onClick={gererBtnMecanicien}>Connexion Mécanicien</button>
        </div>
    );
};

export default App;
