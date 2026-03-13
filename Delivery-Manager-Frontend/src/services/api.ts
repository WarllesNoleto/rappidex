import axios from 'axios';

// produção
//const apiUrl = 'https://rappidex-api-eef82025324b.herokuapp.com/api';

// local (descomente para testes)
 const apiUrl = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;