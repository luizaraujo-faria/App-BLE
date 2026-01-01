import axios from 'axios';
import api, { API_BASE_URL } from './api';

const COLLABORATORS_BASE_URL = `${API_BASE_URL}/colaborators`;

export const createCollaborator = async (values: any[]): Promise<any> => {

    try{
        const response = await api.post(`${COLLABORATORS_BASE_URL}/`, { values });
        return response.data.message;
    }
    catch(err: any){
        if(axios.isAxiosError(err)){
            throw err;
        }
        else{
            throw err;
        }
    }
};