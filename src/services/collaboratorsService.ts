import api, { API_BASE_URL } from './api';

const COLLABORATORS_BASE_URL = `${API_BASE_URL}/colaborators`;

export const createCollaborator = async (values: any[]) => {

    try{
        await api.post(`${COLLABORATORS_BASE_URL}/`, { values });
        return;
    }
    catch(err: any){
        console.log(`Falha ao enviar registros! ${err.message}`);
        console.error(err.message);
        throw err;
    }
};