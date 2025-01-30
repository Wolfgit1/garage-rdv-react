import axios from 'axios'
import { ajouterVehiculeAPI } from '../actions/ActionsVehicules';

class ManufactureVehicule
{
    constructor(dispatch) 
    {
        this.dispatch = dispatch;
    }

    CreerVehiculeVIN = async (vin, idVehicule,idUser) =>
    {
        const reponse = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`)
        const vehicule = {idVehicule: idVehicule,fabricant: reponse.data.Results[0].Make,modele: reponse.data.Results[0].Model,annee: reponse.data.Results[0].ModelYear,idUser:idUser};

        this.dispatch(ajouterVehiculeAPI(vehicule));
        
    };

    CreerVehicule(fabricant,modele,annee,idVehicule,idUser)
    {
        const vehicule = {idVehicule:idVehicule, fabricant:fabricant, modele:modele, annee:annee, idUser:idUser}

        this.dispatch(ajouterVehiculeAPI(vehicule));
    };
}

export default ManufactureVehicule