import axios from 'axios';

export default axios.create({
    baseURL:"http://champion-be.mpg.saz-zad.com",
    headers: { 
        'Content-Type': 'application/json'
     }
});