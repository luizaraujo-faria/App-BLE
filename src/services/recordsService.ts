import { CreateRecordDTO } from '../types/records';
import api, { API_BASE_URL } from './api';

const RECORDS_BASE_URL = `${API_BASE_URL}/records`;

export const createRecord = async (values: CreateRecordDTO[] | string[]): Promise<void> => {

    try{
        await api.post(`${RECORDS_BASE_URL}/`, values);
        return;
    }
    catch(err: any){
        console.log(`Falha ao enviar registros! ${err.message}`);
        console.error(err);
        throw err;
    }
};