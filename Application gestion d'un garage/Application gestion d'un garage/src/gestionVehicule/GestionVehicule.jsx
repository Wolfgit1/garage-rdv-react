import React, {Component} from 'react'
import { connect } from 'react-redux';
import ManufactureVehicule from './ManufactureVehicule';
import axios from 'axios';
import Vehicule from './Vehicule';


class GestionVehicule extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        { 
            ajouterVehiculeActif: false,
            ajouterVehiculeVINActif: false,
            ajouterVehiculeComplexeActif: false,
            optionsModeles: [],
            fabricant: "",
            formulaireAfficher: false,
        }
        this.manufactureVehicule = new ManufactureVehicule(this.props.dispatch);
    }

    componentWillUnmount()
    {
        this.props.afficher();
    }

    gererBtnAjouterVehicule = () =>
    {
        this.setState({
            ajouterVehiculeActif: true,
            ajouterVehiculeVINActif: false,
            ajouterVehiculeComplexeActif: false
        })
        this.props.modifierCacher();
    }
    gererBtnAjouterVehiculeVIN = () =>
    {
        this.setState({
            ajouterVehiculeActif: false,
            ajouterVehiculeVINActif: true,
            ajouterVehiculeComplexeActif: false
        })
        this.props.modifierCacher();
    }
    gererBtnAjouterVehiculeComplexe = () =>
    {
        this.setState({
            ajouterVehiculeActif: false,
            ajouterVehiculeVINActif: false,
            ajouterVehiculeComplexeActif: true
        })
        this.props.modifierCacher();
    }

    gererBtnAnnulerAjoutVehicule = () =>
    {
        this.setState({ajouterVehiculeActif: false})
        this.props.afficher();
    }
    gererBtnAnnulerAjoutVehiculeVIN = () =>
    {
        this.setState({ajouterVehiculeVINActif: false})
        this.props.afficher();
    }
    gererBtnAnnulerAjoutVehiculeComplexe = () =>
    {
        this.setState({ajouterVehiculeComplexeActif: false})
        this.props.afficher();
    }

    creerVehicule = (e) =>
    {
        e.preventDefault();
        const donneeFormulaire = new FormData(e.target);
        const fabricant = donneeFormulaire.get("fabricant");
        const modele = donneeFormulaire.get("modele");
        const annee = donneeFormulaire.get("annee");

        this.manufactureVehicule.CreerVehicule(fabricant,modele,annee,this.props.indexVehicule,this.props.user.id)
        this.setState({ajouterVehiculeActif: false});
        this.props.afficher();
    }
    //"JS2YB5A20A6300765"
    creerVehiculeVIN = (e) =>
    {
        e.preventDefault();
        const donneeFormulaire = new FormData(e.target);
        const vin = donneeFormulaire.get("vin");

        this.manufactureVehicule.CreerVehiculeVIN(vin, this.props.indexVehicule,this.props.user.id)
        this.setState({ajouterVehiculeVINActif: false});
        this.props.afficher();
    }
    
    creerVehiculeComplexe = async (e) =>
    {
        e.preventDefault();

        const donneeFormulaire = new FormData(e.target);

        const fabricant = donneeFormulaire.get("fabricant");
        const modele = donneeFormulaire.get("modele");

        if(fabricant != "" && modele != "" && modele != 0)
        {
            //Ajout du véhicule
            this.manufactureVehicule.CreerVehicule(fabricant,modele,donneeFormulaire.get("annee"),this.props.indexVehicule,this.props.user.id);
            this.setState({ajouterVehiculeComplexeActif: false});
            this.props.afficher();
        
        }
        else if(fabricant == "") 
        {
            // On cherche le fabricant // On ne l'offre pas puisque c'est trop long et il n'y a pas de façon facile de l'obtenir
            /*
            if(modele == "")
            {
                alert("Le modèle et le fabricant sont vides !\n Merci d'entrer au moins une de ces deux informations.");
            }
            else
            {
                const reponse = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json`);
                const fabricants = reponse.data.Results.map((fabricant) => ({fabricant: fabricant.Make_Name, Id: fabricant.Make_ID}));
                const qte = reponse.data.Count;

                for(let i = 0; i< qte;++i)
                {
                    console.log(fabricants[i]);
                    const reponseModeles = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/${fabricants[i].Id}?format=json`);

                    const modeles = reponseModeles.data.Results.map((m) => m.Model_Name);
                    for (let m of modeles)
                    {
                        if(m === modele)
                        {
                            this.setState({fabricant: fabricants[i]});
                            return;
                        }
                    }
                }
            }*/
        }
        else
        {
            // On cherche le modèle
            const reponse = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${fabricant}/modelyear/${donneeFormulaire.get("annee")}?format=json`);
            let optionsModele = reponse.data.Results.map((modele,i)=> <option key={i} value={modele.Model_Name}>{modele.Model_Name}</option>);
            if(optionsModele.length == 0)
            {
                optionsModele.push(<option key={0} value={0}>Aucun modèle trouvé pour cette date et ce fabricant.</option>);
            }
            this.setState({optionsModeles: optionsModele});
        }
    }

    render()
    {
        const optionsAnnee = [];
    
        for (let i = 1900; i <= 2024; ++i) 
        {
            optionsAnnee.push(<option key={i} value={i}>{i}</option>);
        }

        return(
            <>
            
            <div>{!this.props.cacher &&
                <div>
                    <button onClick={this.gererBtnAjouterVehicule}>Ajouter véhicule</button>
                    <button onClick={this.gererBtnAjouterVehiculeVIN}>Ajouter véhicule avec VIN</button>
                    <button onClick={this.gererBtnAjouterVehiculeComplexe}>Ajouter véhicule avec informations manquantes</button>
                </div>}
           
                <div> 
                    {this.state.ajouterVehiculeActif && 
                    <form onSubmit={this.creerVehicule}>
                        <h2>Ajouter véhicule</h2>
                        <label>Fabricant: </label>
                        <input type="text" name='fabricant'></input>
                        <label>Modèle: </label>
                        <input type="text" name='modele'></input>
                        <label>Année de fabrication: </label>
                        <select name="annee">
                                    {optionsAnnee}
                        </select>
                        <button type="submit">Ajouter</button>
                        <button onClick={this.gererBtnAnnulerAjoutVehicule}>Annuler</button>
                    </form>}
                </div>
            
                <div>
                    {this.state.ajouterVehiculeVINActif &&
                    <form onSubmit={this.creerVehiculeVIN}>
                        <h2>Ajouter véhicule avec VIN</h2>
                        <label>VIN du véhicule: </label>
                        <input type="text" name='vin'></input>
                        <button type="submit">Ajouter</button>
                        <button onClick={this.gererBtnAnnulerAjoutVehiculeVIN}>Annuler</button>
                    </form>}
                </div>

                <div>
                    {this.state.ajouterVehiculeComplexeActif &&
                    <form onSubmit={this.creerVehiculeComplexe}>
                        <h2>Ajouter véhicule avec informations manquantes</h2>
                        <label>Fabricant: </label>
                        <input type="text" name='fabricant'></input>
                        <label>Modèle: </label>
                        {this.state.optionsModeles.length == 0 ?
                        (
                            <input type="text" name='modele'></input>
                        ):
                        (
                            <select name="modele">
                                {this.state.optionsModeles}
                            </select> 
                        )}
                        <label>Année de fabrication: </label>
                        <select name="annee" required>
                            {optionsAnnee}
                        </select>
                        <button type="submit">Ajouter</button>
                        <button onClick={this.gererBtnAnnulerAjoutVehiculeComplexe}>Annuler</button>
                    </form>}
                </div>
                </div>
                <div className="contenant-debordant">
                    {this.props.vehicules.filter(vehicule => vehicule.idUser == this.props.user.id).map((vehicule) => (<Vehicule key={vehicule.idVehicule} idVehicule={vehicule.idVehicule} fabricant={vehicule.fabricant} modele={vehicule.modele} annee={vehicule.annee}/>))}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    cacher: state.cacher,
    vehicules: state.vehicules,
    indexVehicule: state.indexVehicule,
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    modifierCacher: () => dispatch({ type: 'CACHER' }),
    afficher: () => dispatch({ type: 'AFFICHER' }),
    dispatch,
});

export default connect(mapStateToProps,mapDispatchToProps)(GestionVehicule);