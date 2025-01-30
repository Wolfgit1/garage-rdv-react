import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { connect  } from 'react-redux';
import { modifierRdvAPI,annulerRdvAPI } from '../actions/ActionsRdvs';

class Rdv extends Component
{   
    constructor(props)
    {
        super(props);
        this.state = 
        { 
            client: props.client || null,
            clientId: props.clientId,
            idVehicule: props.idVehicule,
            infoVehicule: props.infoVehicule || "",
            besoins: props.besoins || "",
            mecanicien: props.mecanicien || null,
            mecanicienId: props.mecanicienId,
            date:props.date || new Date(),
            heure: props.heure || NaN,
            duree: props.duree || NaN,
            rdvId: props.rdvId,
            commentaire: props.commentaire || "",
            confirmer: props.confirmer || false, //Signifie attente de la confirmation par le mécanicien
            etat: props.etat || false, // Détermine si le rdv existe ou s'il est annuler.
            cout: props.cout || 0,
            estClient: props.estClient,
            estPayer: props.estPayer || false,
            modifier: false,
            supprimer: false,
            ouvrirDialogPaiment: props.ouvrirDialogPaiment,
        };
    };
    
    gererBtnAnnulerRdv = () =>
    {
        this.setState({confirmer: false, etat: false});
        this.props.annulerRdvAPI(this.state.rdvId);
        this.props.modifierRdvAPI({client: this.state.client, estPayer: this.state.estPayer,cout:this.state.cout, commentaire: this.state.commentaire, clientId: this.state.clientId,idVehicule: this.state.idVehicule,infoVehicule: this.state.infoVehicule,besoins: this.state.besoins,mecanicien: this.state.mecanicien,mecanicienId: this.state.mecanicienId,date: this.state.date,heure: this.state.heure,duree: this.state.duree,rdvId: this.state.rdvId,etat: false,confirmer: false});
    }

    gererBtnConfirmer = () =>
    {
        if(this.state.supprimer)
        {
            this.setState({supprimer: false});
            this.gererEnvoiRefuser();
        }
        else if(this.state.modifier)
        {
            this.setState({modifier: false});
            this.props.modifierRdvAPI({client: this.state.client, estPayer: this.state.estPayer, cout:this.state.cout ,commentaire: this.state.commentaire,clientId: this.state.clientId,idVehicule: this.state.idVehicule,infoVehicule: this.state.infoVehicule,besoins: this.state.besoins,mecanicien: this.state.mecanicien,mecanicienId: this.state.mecanicienId,date: this.state.date,heure: this.state.heure,duree: this.state.duree,rdvId: this.state.rdvId,etat: this.state.etat,confirmer: true});
        }
    }

    gererEnvoiRefuser = () =>
    {
        this.props.modifierRdvAPI({client: this.state.client, estPayer: this.state.estPayer,cout:this.state.cout, commentaire: this.state.commentaire, clientId: this.state.clientId,idVehicule: this.state.idVehicule,infoVehicule: this.state.infoVehicule,besoins: this.state.besoins,mecanicien: this.state.mecanicien,mecanicienId: this.state.mecanicienId,date: this.state.date,heure: this.state.heure,duree: this.state.duree,rdvId: this.state.rdvId,etat: false,confirmer: true});
    }

    gererBtnRefuser = () =>
    {
        this.setState({supprimer: true});
    }

    modifierEtatFormulaire = () =>
    {
        this.setState({modifier: true});
    };

    gererModification = (e) =>
    {
        this.setState({[e.target.name]: e.target.value})
    }

    gererBtnAnnuler= () =>
    {
        this.setState({modifier: false});
        this.setState({supprimer: false});
    }

    gererEnvoiModification = () =>
    {
        this.setState({modifier: false});
        this.props.modifierRdvAPI({client: this.state.client, estPayer: this.state.estPayer, cout:this.state.cout ,commentaire: this.state.commentaire,clientId: this.state.clientId,idVehicule: this.state.idVehicule,infoVehicule: this.state.infoVehicule,besoins: this.state.besoins,mecanicien: this.state.mecanicien,mecanicienId: this.state.mecanicienId,date: this.state.date,heure: this.state.heure,duree: this.state.duree,rdvId: this.state.rdvId,etat: this.state.etat,confirmer: false});
    }

    render()
    {
        return(
            <>
                <tr key={this.state.rdvId}>
                    <td>{this.state.date}</td>
                    <td>{this.state.heure}</td>
                    <td>{this.state.modifier && !this.state.estClient && this.state.etat ? <input type='number'min="0" name='duree' style={{width:'50px'}} value={this.state.duree || 0} onChange={this.gererModification}></input> : this.state.duree}</td>
                    <td>{this.state.estClient ? this.state.mecanicien : this.state.client}</td>
                    <td>{this.state.infoVehicule}</td>
                    <td>{this.state.modifier && this.state.estClient ? (<textarea value={this.state.besoins} name='besoins' onChange={this.gererModification} required />): (this.state.besoins)}</td>
                    <td>{this.state.etat ? (this.state.confirmer ? ("Confirmer"):("En attente")):(this.state.confirmer ? ("Annuler"):("En attente"))}</td>
                    <td>{this.state.modifier && !this.state.estClient && this.state.etat ? <input type='number'min="0" name='cout' style={{width:'50px'}} value={this.state.cout || 0} onChange={this.gererModification}></input> :this.state.cout}</td>
                    <td>{(this.state.modifier || this.state.supprimer) && !this.state.estClient ? (<textarea value={this.state.commentaire} name='commentaire' onChange={this.gererModification} required />):this.state.commentaire}</td>
                    {this.state.estClient && !this.state.estPayer && this.state.etat &&
                    <>
                        {this.state.modifier ? 
                        (
                            <button onClick={this.gererEnvoiModification}>Confirmer</button>
                        ) : 
                        (<>
                        <button style={{width: "40px",height: "40px",display: "flex",alignItems: "center",justifyContent: "center", margin:0}} onClick={this.gererBtnAnnulerRdv}><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button style={{width: "40px",height: "40px",display: "flex",alignItems: "center",justifyContent: "center", margin:0}} onClick={this.modifierEtatFormulaire}><FontAwesomeIcon icon={faPen} /></button>
                        </>
                        )}
                    </>
                    }

                    {this.state.cout != 0 && this.state.estClient && !this.state.estPayer && this.state.confirmer && this.state.etat &&
                        <button onClick={() => this.state.ouvrirDialogPaiment(this.state.rdvId)}>Payer</button>
                    }
                    {!this.state.estClient && !this.state.confirmer &&
                    <>
                        {this.state.modifier || this.state.supprimer ? 
                        (<>
                            <button onClick={this.gererBtnConfirmer}>Confirmer</button>
                            <button onClick={this.gererBtnAnnuler}>Annuler</button>
                        </>) : 
                        (<>
                            <button onClick={this.modifierEtatFormulaire}>Confirmer</button>
                            <button onClick={this.gererBtnRefuser}>Refuser</button>
                        </>
                        )}
                    </>
                    }
                </tr>
           </>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    modifierRdvAPI: (rdv) => dispatch(modifierRdvAPI(rdv)),
    annulerRdvAPI: (rdvId) => dispatch(annulerRdvAPI(rdvId)),
});

export default connect(null,mapDispatchToProps)(Rdv);