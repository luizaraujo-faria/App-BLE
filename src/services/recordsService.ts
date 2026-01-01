import axios from 'axios';
import api, { API_BASE_URL } from './api';

const RECORDS_BASE_URL = `${API_BASE_URL}/records`;

export const createRecord = async (values: (string | number)[][]): Promise<void> => {

    try{
        await api.post(`${RECORDS_BASE_URL}/`, { values });
        return;
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