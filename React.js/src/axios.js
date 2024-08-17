import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/'
});

/*
console.log('Configuración de Axios:', {
 baseURL: instance.defaults.baseURL,
  headers: instance.defaults.headers,
});
*/

export default instance;