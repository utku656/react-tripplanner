import axios from 'axios';

const BASE_URL ='https://api.pexels.com/v1';
const KEY = '563492ad6f91700001000001ded60c0d71df4e9992e4c50041f7e844';
const LIMIT = 3 ;
const getImageBySearch = (query) => 
  axios.get(BASE_URL+'/search?per_page='+`${LIMIT}`+'&query='+`${query}`,{
    headers: {
      Authorization: KEY
    }
  });



  export{
    getImageBySearch,
    };