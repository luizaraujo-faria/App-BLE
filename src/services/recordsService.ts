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

export const getPeakTime = async (
    month: string, 
): Promise<AxiosResponse> => {

    try{
        const response = await api.get(`/records/meal/peaktime/${month}`);
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
    month: string, 
    turn?: string,
): Promise<AxiosResponse> =>{

    try{
        const response = await api.get(`/records/meal/collaborators/${month}`, {
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

export const getMealsByCollaboratorType = async (
    month: string, 
    turn?: string,
): Promise<AxiosResponse> =>{

    try{
        const response = await api.get(`/records/meal/collaborators/types/${month}`, {
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