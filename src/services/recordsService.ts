import axios, { AxiosResponse } from 'axios';
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

export const getMealsByColaborator = async (
    colaboratorId: string, 
    month: string, 
    turn?: string,
) => {

    try{
        const response = await api.get(
            `${RECORDS_BASE_URL}/meal/colaborator/${colaboratorId}/${month}`, 
            { params: { turn } });
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

export const getMealsBySector = async (
    sector: string, 
    month: string, 
    turn?: string,
): Promise<AxiosResponse> => {

    try{
        const response = await api.get(
            `/records/meal/sector/${sector}/${month}`, 
            { params: { turn } });
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

export const getMealsBySectorMonth = async (
    month: string, 
    turn?: string,
): Promise<AxiosResponse> => {

    try{
        const response = await api.get(`/records/meal/sector/${month}`, {
            params: { turn },
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
    month: string, 
    turn?: string,
): Promise<AxiosResponse> =>{

    try{
        const response = await api.get(`/records/meal/sectors/${month}`, {
            params: { turn },
        });
        console.log('API RESPONSE:', JSON.stringify(response.data));
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