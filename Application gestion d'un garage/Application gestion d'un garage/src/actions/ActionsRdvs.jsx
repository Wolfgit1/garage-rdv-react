import axios from 'axios';

export const obtenirDatesDisponiblesAPI = (url) =>
{
    return async (dispatch) =>
    {
        try 
        {
            const reponse = await axios.get(url);
            const datesDisponibles = reponse.data.datesDispo.map(date => ({date: date.date}));

            dispatch({type: "SET_DATES_DISPOS_EXISTANT", payload: datesDisponibles })
        }
        catch (error)
        {
            console.error("Erreur lors de la récupération des dates :", error);
            dispatch({type: "SET_DATES_DISPOS_EXISTANT", payload: datesDisponibles })// Parce que des fois dummyJSON retourne 404 pour aucune raison
        }
    }
}

export const obtenirHeureDispoMecaniciensAPI = (url) =>
{
    return async (dispatch) =>
        {
            try 
            {
                const reponse = await axios.get(url);
                const heuresDipos = reponse.data.heuresDispo.map(h => ({heure: h.heure}));
    
                dispatch({ type: "SET_HEURES_DISPOS_EXISTANT", payload: heuresDipos });
    
            }
            catch (error) 
            {
                console.error("Erreur lors de la récupération des mécaniciens :", error);
                dispatch({ type: "SET_HEURES_DISPOS_EXISTANT", payload: heuresDipos });// Parce que des fois dummyJSON retourne 404 pour aucune raison
            }
        }
}

export const obtenirMecaniciensAPI = () =>
{
    return async (dispatch) =>
    {
        try 
        {
            const reponse = await axios.get("https://dummyjson.com/c/512e-74f6-43aa-b039");
            const mecanos = reponse.data.mecaniciens.map(m => ({nom: m.nom, idMecanicien: m.idMecanicien}));

            dispatch({ type: "SET_MECANICIENS_EXISTANT", payload: mecanos });

        }
        catch (error) 
        {
            console.error("Erreur lors de la récupération des mécaniciens :", error);
            dispatch({ type: "SET_MECANICIENS_EXISTANT", payload: mecanos });// Parce que des fois dummyJSON retourne 404 pour aucune raison
        }
    }
}


export const obtenirRdvsAPI = (url) => 
{
    return async (dispatch) => 
    {
        try 
        {
            const reponse = await axios.get(url);
            const rdvs = reponse.data.rdvs.map(rdv => ({
                client:rdv.client,
                clientId:rdv.clientId,
                idVehicule:rdv.idVehicule,
                infoVehicule:rdv.infoVehicule,
                besoins:rdv.besoins,
                mecanicien:rdv.mecanicien,
                mecanicienId:rdv.mecanicienId,
                date:rdv.date,
                heure:rdv.heure,
                duree:rdv.duree,
                rdvId:rdv.rdvId,
                commentaire:rdv.commentaire,
                confirmer:rdv.confirmer,
                etat:rdv.etat,
                cout:rdv.cout,
                estPayer: rdv.estPayer
            }));
            dispatch({ type: "SET_RDVS_EXISTANT", payload: rdvs });
            const index = rdvs[rdvs.length-1].idRdv;
            if(index > 0)
            {
                dispatch({type: 'SET_INDEX_RDV',payload:index});
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la récupération des rendez-vous :", error);
            dispatch({ type: "SET_RDVS_EXISTANT", payload: rdvs });// Parce que des fois dummyJSON retourne 404 pour aucune raison
            const index = rdvs[rdvs.length-1].idRdv;
            if(index > 0)
            {
                dispatch({type: 'SET_INDEX_RDV',payload:index});
            }
        }
    };
};

export const modifierRdvAPI = (rdv) =>
{
    return async (dispatch) => 
    {
        try
        {
            const reponse = await axios.patch("https://dummyjson.com/c/ef13-0773-4826-91c7",rdv);

            if(reponse.status === 200)
            {
                console.log("Modification effectuée avec succès!");
                dispatch({ type: "MODIFIER_RDV", payload: rdv });
            }
            else
            {
                console.log("Erreur lors de la modification du rendez-vous :", reponse.message, "\nStatus: ", reponse.status);            
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la modification du rendez-vous :", error);
            dispatch({ type: "MODIFIER_RDV", payload: rdv });// Parce que des fois dummyJSON retourne 404 pour aucune raison
        }
    }
};

export const supprimerRdvAPI = (idRdv) =>
{
    return async (dispatch) => 
    {
        try
        {
            const reponse = await axios.delete("https://dummyjson.com/c/867d-3986-4d85-872c",idRdv); 

            if(reponse.status === 200)
            {
                console.log("Suppression effectuée avec succès!");
                dispatch({ type: "SUPPRIMER_RDV", payload: idRdv });
            }
            else
            {
                console.log("Erreur lors de la suppression du rendez-vous :", reponse.message, "\nStatus: ", reponse.status);            
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la suppression du rendez-vous :", error);
            dispatch({ type: "SUPPRIMER_RDV", payload: idRdv });// Parce que des fois dummyJSON retourne 404 pour aucune raison
        }
    }
}

export const annulerRdvAPI = (idRdv) =>
{
    return async (dispatch) => 
    {
        try
        {
            const reponse = await axios.patch("https://dummyjson.com/c/6037-1efb-448f-82ef",idRdv); 

            if(reponse.status === 200)
            {
                console.log("Demande d'annulation effectuée avec succès!");
                dispatch({ type: "ANNULER_RDV", payload: idRdv });
            }
            else
            {
                console.log("Erreur lors de la demande d'annulation du rendez-vous :", reponse.message, "\nStatus: ", reponse.status);            
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la demande d'annulation du rendez-vous :", error);
            dispatch({ type: "ANNULER_RDV", payload: idRdv });// Parce que des fois dummyJSON retourne 404 pour aucune raison
        }
    }
}

export const ajouterRdvAPI = (rdv) =>
{
    return async (dispatch) => 
    {  
        try
        {
            const reponse = await axios.post("https://dummyjson.com/c/2817-93cb-433f-b76f",rdv);

            if(reponse.status === 200)
            {
                console.log("Ajout effectuée avec succès!");
                dispatch({ type: 'AJOUTER_RDV', payload: rdv });
            }
            else
            {
                console.log("Erreur lors de la ajout du rendez-vous :", reponse.message, "\nStatus: ", reponse.status);            
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la ajout du rendez-vous :", error);
            dispatch({ type: 'AJOUTER_RDV', payload: rdv }); // Parce que des fois dummyJSON retourne 404 pour aucune raison
        }
    }
};

export const enregistreInfoPaimentAPI = (infoPaiment) =>
{
    return async (dispatch) => 
    {  
        try
        {
            const reponse = await axios.post("https://dummyjson.com/c/3558-afde-4f60-8e5d",infoPaiment);

            if(reponse.status === 200)
            {
                console.log("Ajout effectuée avec succès!");
                dispatch({ type: 'AJOUTER_INFO_PAIMENT', payload: infoPaiment });
            }
            else
            {
                console.log("Erreur lors de la ajout des informations de paiment :", reponse.message, "\nStatus: ", reponse.status);            
            }
        }
        catch (error) 
        {
            console.error("Erreur lors de la ajout des informations de paiment :", error);
            dispatch({ type: 'AJOUTER_INFO_PAIMENT', payload: infoPaiment });// Parce que des fois dummyJSON retourne 404 pour aucune raison
        }
    }
};

export const effectuerPaimentAPI = (infoPaiment, idMecanicien) =>
{
    return async () => 
    {  
        try
        {
            const reponse = await axios.post("https://dummyjson.com/c/a6e2-6f44-4c98-a6d5",infoPaiment,idMecanicien); // Appele a l'api en charge de gérer le paiement

            if(reponse.status === 200)
            {
                console.log("Paiement effectuée avec succès!");
            }
            else
            {
                console.log("Erreur lors du paiement :", reponse.message, "\nStatus: ", reponse.status);            
            }
        }
        catch (error) 
        {
            console.error("Erreur lors du paiement :", error);
        }
    }
};