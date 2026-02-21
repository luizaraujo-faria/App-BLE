import axios, { AxiosResponse } from 'axios';
import api, { API_BASE_URL } from './api';
// import { CreateRecordDTO } from '../types/records';
// import { CreateRecordDTO } from '../types/records';

const RECORDS_BASE_URL = `${API_BASE_URL}/records`;

export const createRecord = async (values: (string | number)[][]): Promise<void> => {

    console.log(`   PAYLOAD RECEBIDO: ${values}`);

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

export const getPeakTime = async (
    date: string, 
): Promise<AxiosResponse> => {

    try{
        const response = await api.get('/records/meal/peaktime', {
            params: { date },
        });
        return response;
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

export const getMealsBySectors = async (
    date: string, 
    turn?: string,
): Promise<AxiosResponse> =>{

    try{
        const response = await api.get('records/meal/sectors', {
            params: { date, turn },
        });
        return response;
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

export const getMealsByCollaborators = async (
    date: string, 
    turn?: string,
): Promise<AxiosResponse> =>{

    try{
        const response = await api.get('/records/meal/collaborators', {
            params: { date, turn },
        });
        return response;
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

export const getMealsByCollaboratorType = async (
    date: string, 
    turn?: string,
): Promise<AxiosResponse> =>{

    try{
        const response = await api.get('/records/meal/collaborators/types', {
            params: { date, turn },
        });
        return response;
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