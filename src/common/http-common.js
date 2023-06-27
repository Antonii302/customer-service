import axios from 'axios';

export const request = axios.create({
    baseURL: 'https://6ha9wi1kb1.execute-api.us-west-1.amazonaws.com/dev/',
    withCredentials: false
});