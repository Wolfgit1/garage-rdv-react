import React, { Component } from 'react';
import Rdv from '../gestionRdv/Rdv';
import { connect } from 'react-redux';
import axios from 'axios';

class PageMecanicien extends Component
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            ongletActif: "modifierProfil",
            dateSelectionnee: new Date(),
            message: "",
            erreur: false,
            benefices:0,
        };
    }

    componentWillUnmount()
    {
        this.props.detruireUser();
    };

    calculerBenefice = (e) =>
    {
        const totalCouts = this.props.rdvs.reduce((total, rdv) => total + (typeof rdv.cout === 'number' ? rdv.cout : parseFloat(rdv.cout) || 0), 0);
        const benefices = Math.round(totalCouts * 0.15);
        this.setState({ benefices: benefices});
        this.modifierOngletActif(e);
    }

    modifierOngletActif = (e) => 
    {
        this.setState({ ongletActif: e.target.name, message: ""});
    };

    sauvegarderNouvelleInfo = async (e) => 
        {
            e.preventDefault();
            const donneeFormulaire = new FormData(e.target);
            
            let utilisateur = {
                lastName: donneeFormulaire.get('nom'),
                firstName: donneeFormulaire.get('prenom'),
                phone: donneeFormulaire.get('tel'),
                address: { adresse: donneeFormulaire.get('adresse') },
            };
    
            const reponse = await axios.patch(`https://dummyjson.com/users/${this.props.user.id}`,utilisateur);
    
            if(reponse.status !== 200)
            {
                this.setState({message: "Modification du profil à échoué!",erreur:true});
            }
            else
            {
                this.setState({message: "Modification du profil réussi !",erreur:false});
            }
    
            utilisateur = {...this.props.user};
            utilisateur.lastName = donneeFormulaire.get('nom');
            utilisateur.firstName = donneeFormulaire.get('prenom');
    
            this.props.setUser(utilisateur);
    };

    render()
    {
        return (
            <div className="client-container">
                <div>
                    <h2>Bienvenue {this.props.user.firstName} {this.props.user.lastName} dans votre espace de Mécanicien</h2>
                    <p><strong>Téléphone :</strong> {this.props.user.tel || "Non disponible"}</p>
                    <p><strong>Adresse :</strong> {this.props.user.adresse?.adresse || "Non disponible"}</p>
                </div>

                <nav style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    <button name="modifierProfil" onClick={this.modifierOngletActif}>Modifier mon profil</button>
                    <button name="mesRdvs" onClick={this.modifierOngletActif}>Mes rendez-vous</button>
                    <button name="factures" onClick={this.modifierOngletActif}>Mes factures</button>
                    <button name="mesBenefices" onClick={this.calculerBenefice}>Mes bénéfices</button>
                </nav>

                <div>
                    {this.state.ongletActif === 'modifierProfil' && (
                    <div>
                        <h3>Modifier mon profil</h3>
                        <form onSubmit={this.sauvegarderNouvelleInfo}>
                            <input type="text" name="nom" placeholder="Nom" required />
                            <input type="text" name="prenom" placeholder="Prénom" required />
                            <input type="tel" name="tel" placeholder="Téléphone" required />
                            <input type="text" name="adresse" placeholder="Adresse" required />
                            <button type="submit">Sauvegarder</button>
                        </form>
                        {this.state.message && <p style={{ color: 'green' }}>{this.state.message}</p>}
                    </div>
                    )}

                    {this.state.ongletActif === 'mesRdvs' && (
                    <div>
                        <h3>Mes rendez-vous</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Heure</th>
                                    <th>Durée</th>
                                    <th>Client</th>
                                    <th>Véhicule</th>
                                    <th>Raison</th>
                                    <th>Statut</th>
                                    <th>Coût</th>
                                    <th>Commentaire</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.props.rdvs.filter(rdv =>  rdv.mecanicienId == this.props.user.id).map( rdv=>
                                <Rdv
                                    key={rdv.rdvId}
                                    client={rdv.client}
                                    clientId={rdv.clientId}
                                    idVehicule={rdv.idVehicule}
                                    infoVehicule={rdv.infoVehicule}
                                    besoins={rdv.besoins}
                                    mecanicien={rdv.mecanicien}
                                    mecanicienId={rdv.mecanicienId}
                                    date={rdv.date}
                                    heure={isNaN(rdv.heure) ? ("Not specified") : (rdv.heure)}
                                    duree={isNaN(rdv.duree) ? ("Not specified") : (rdv.duree)}
                                    rdvId={rdv.rdvId}
                                    commentaire={rdv.commentaire}
                                    confirmer={rdv.confirmer}
                                    etat={rdv.etat}
                                    estClient={false}
                                    cout={rdv.cout}
                                    estPayer={rdv.estPayer}
                                />
                            )}
                            </tbody>
                        </table>
                    </div>
                    )}
                    {this.state.ongletActif === 'factures' && (
                        <div>
                            <h3>Mes Factures</h3>
                            <table>
                            <thead>
                                <tr>
                                <th>Nom du client</th>
                                <th>Nom du mécanicien</th>
                                <th>État du Paiement</th>
                                <th>Montant Perçu</th>
                                <th>Bénéfices</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.rdvs.filter(rdv =>  rdv.mecanicienId == this.props.user.id).map((rdv) => (
                                    <tr key={rdv.rdvId}>
                                    <td>{rdv.client}</td>
                                    <td>{rdv.mecanicien}</td>
                                    <td>{rdv.estPayer ? 'Oui' : 'En attente de paiement'}</td>
                                    <td>{rdv.cout}$</td>
                                    <td>{(rdv.cout *0.15).toFixed(2)}$</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    )}
                    {this.state.ongletActif === 'mesBenefices' &&
                    <div>
                        <h3>Mes bénéfices totales</h3>
                        <h4>{this.state.benefices} $</h4>
                    </div>
                    }
                </div>
            </div>
        )
    };
};

const mapStateToProps = (state) => ({
  user: state.user,
  rdvs: state.rdvs,
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (user) => dispatch({type: 'SET_USER',payload:user}),
    detruireUser: () =>  dispatch({type: 'DETRUIRE_USER'}),
});

export default connect(mapStateToProps,mapDispatchToProps)(PageMecanicien);
