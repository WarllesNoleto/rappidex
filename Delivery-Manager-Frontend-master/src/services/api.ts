import axios from 'axios';

// const apiUrl = 'http://localhost:3000/api'
const apiUrl = 'https://rappidex-api-eef82025324b.herokuapp.com/api'

const api = axios.create({
    
    baseURL: apiUrl,
});

export default api;