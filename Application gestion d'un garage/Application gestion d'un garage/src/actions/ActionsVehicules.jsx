import axios from 'axios';

export const obtenirVehiculesAPI = (url) => 
{
    return async (dispatch) => 
    {
        try 
        {
            const reponse = await axios.get(url);
            const vehicules = reponse.data.voiture.map(v =>({
                idVehicule: v.idVehicule,
                fabricant: v.fabricant,
                modele: v.modele,
                annee: v.annee
            }));

            dispatch({ type: "SET_VEHICULES_EXISTANT", payload: vehicules });
            const index = vehicules[vehicules.length-1].idVehicule;
            if(index > 0)
            {
                dispatch({type: 'SET_INDEX_VEHICULE',payload:index})
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la récupération des véhicules :", error);
            dispatch({ type: "SET_VEHICULES_EXISTANT", payload: vehicules });
            const index = vehicules[vehicules.length-1].idVehicule;
            if(index > 0)
            {
                dispatch({type: 'SET_INDEX_VEHICULE',payload:index})
            }
        }
    };
};

export const modifierVehiculeAPI = (vehicule) =>
{
    return async (dispatch) => 
    {
        try
        {
            const reponse = await axios.patch("https://dummyjson.com/c/9728-3e79-499c-97e9",vehicule);

            if(reponse.status === 200)
            {
                console.log("Modification effectuée avec succès!");
                dispatch({ type: "MODIFIER_VEHICULE", payload: vehicule });
            }
            else
            {
                console.log("Erreur lors de la modification du véhicule :", reponse.message, "\nStatus: ", reponse.status);            
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la modification du véhicule :", error);
            dispatch({ type: "MODIFIER_VEHICULE", payload: vehicule });
        }
    }
    
};

export const supprimerVehiculeAPI = (idVehicule) =>
{
    return async (dispatch) => 
    {
        try
        {
            const reponse = await axios.delete("https://dummyjson.com/c/867d-3986-4d85-872c",idVehicule); // Dans notre api finale nous ajouterons le vehicule dans le body

            if(reponse.status === 200)
            {
                console.log("Suppression effectuée avec succès!");
                dispatch({ type: "SUPPRIMER_VEHICULE", payload: idVehicule });
            }
            else
            {
                console.log("Erreur lors de la suppression du véhicule :", reponse.message, "\nStatus: ", reponse.status);            
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la suppression du véhicule :", error);
            dispatch({ type: "SUPPRIMER_VEHICULE", payload: idVehicule });
        }
    }
}   

export const ajouterVehiculeAPI = (vehicule) =>
{
    return async (dispatch) => 
    {
        try
        {
            const reponse = await axios.post("https://dummyjson.com/c/08bc-b7f3-4de3-a8a7",vehicule); // Dans notre api finale nous ajouterons le vehicule dans le body

            if(reponse.status === 200)
            {
                console.log("Ajout effectuée avec succès!");
                dispatch({ type: 'AJOUTER_VEHICULE', payload: vehicule });
            }
            else
            {
                console.log("Erreur lors de la ajout du véhicule :", reponse.message, "\nStatus: ", reponse.status);            
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la ajout du véhicule :", error);
            dispatch({ type: 'AJOUTER_VEHICULE', payload: vehicule });
        }
    }
};