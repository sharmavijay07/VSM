import axios from 'axios';

const api = axios.create({
    baseURL: 'https://vsm-fckr.onrender.com',
    // baseURL: 'http://localhost:4500',
    
});

export default api;
