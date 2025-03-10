import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4000/api',  // Update this if your backend runs on a different port
});

export default API;
