import { configureStore } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('appState');
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
        console.error("Could not load state from localStorage", error);
        return undefined;
    }
};

const saveToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('appState', serializedState);
    } catch (error) {
        console.error("Could not save state to localStorage", error);
    }
};


const etatInitial = loadFromLocalStorage() ||
{
    cacher: false,
    supprimer: false,
    vehicules: [],
    rdvs: [],
    indexRdv: 0,
    indexVehicule: 0,
    user: null,
    mecaniciens: [],
    heuresDispos: [],
    datesDisponibles: [], // Nous utilisons seulement les dates disponibles, si une date n'est pas la cela veut dire qu'il n'y a pas de disponibilité.
    infoPaiment: undefined,
}

const reducer = (state = etatInitial,action) =>
{
    switch (action.type)
    {
        case "CACHER":
            return{...state, cacher: true};
        case "AFFICHER":
            return{...state, cacher: false};
        case "AJOUTER_VEHICULE":
            return{...state, vehicules:[...state.vehicules,action.payload], indexVehicule: state.indexVehicule + 1};
        case "SUPPRIMER_VEHICULE":
            return{...state, vehicules: state.vehicules.filter(v=> v.idVehicule !== action.payload)};
        case "MODIFIER_VEHICULE":
            return {...state,vehicules: state.vehicules.map(v => v.idVehicule === action.payload.idVehicule ? { ...v, ...action.payload }: v)};
        case "SET_INDEX_VEHICULE":
            return{...state, indexVehicule:action.payload+1};
        case "SET_INDEX_RDV":
            return{...state, indexRdv:action.payload+1};
        case "SET_USER":
            return{...state, user:action.payload};
        case "SET_VEHICULES_EXISTANT":
            if(action.payload.length === 0)
            {
                return{...state};
            }
            return{...state, vehicules: action.payload};
        case "MODIFIER_RDV":
            return {...state,rdvs: state.rdvs.map(rdv => rdv.rdvId === action.payload.rdvId ? { ...rdv, ...action.payload }: rdv)};
        case "AJOUTER_RDV":
            return{...state, rdvs:[...state.rdvs,action.payload], indexRdv: state.indexRdv + 1};
        case "SET_RDVS_EXISTANT":
            if(action.payload.length === 0)
            {
                return{...state};
            }
            return{...state, rdvs: action.payload};
        case "SET_MECANICIENS_EXISTANT":
            return{...state, mecaniciens: action.payload};
        case "SET_HEURES_DISPOS_EXISTANT":
            return{...state, heuresDispos: action.payload};
        case "SET_DATES_DISPOS_EXISTANT":
            return{...state, datesDisponibles: action.payload};
        case "AJOUTER_INFO_PAIMENT":
            return{...state, infoPaiment:action.payload};
        case "SET_ESTPAYER":
            return{...state, rdvs:state.rdvs.map(rdv => rdv.rdvId === action.payload ? { ...rdv,estPayer: true }: rdv)}
        case "DETRUIRE_USER":
            return{...state, user:null};
        default:
            return state;
    }
};

const localStorageMiddleware = store => next => action => {
    const result = next(action);
    saveToLocalStorage(store.getState());
    return result;
};

const store = configureStore({
    reducer:reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;