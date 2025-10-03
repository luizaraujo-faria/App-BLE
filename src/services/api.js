import axios from 'axios';

const API_BASE_URL = 'http://172.31.36.233:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para logging (apenas desenvolvimento)
api.interceptors.request.use(
    (config) => {
        console.log(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Erro na requisição:', error);
        return Promise.reject(error);
    }
);

export const sheetsAPI = {
  // Ler dados da planilha
    async readData(range = null, sheetName = 'Sheet1') {
        try{
            const params = {};
            if (range) params.range = range;
            if (sheetName) params.sheetName = sheetName;
            
            const response = await api.get('/sheets', { params });
            return response.data;
        } 
        catch(error){
            console.error('Erro ao ler dados:', error);
            throw error;
        }
  },

  // Escrever dados na planilha
  async writeData(data) {
    try{
        const response = await api.post('/sheets', data);
        return response.data;
    }
    catch(error){
        console.error('Erro ao escrever dados:', error);
        throw error;
    }
  },

  // Atualizar dados
  async updateData(data) {
    try{
        const response = await api.put('/sheets/update', data);
        return response.data;
    } 
    catch(error){
        console.error('Erro ao atualizar dados:', error);
        throw error;
    }
  },

  // Atualizar por ID
  async updateById(data) {
    try{
        const response = await api.put('/sheets/update-by-id', data);
        return response.data;
    }
    catch (error){
        console.error('Erro ao atualizar por ID:', error);
        throw error;
    }
  },
};

export default api;