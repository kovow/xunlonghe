import axios from 'axios';
export async function getAssetsList(){
  return axios.get('/api/tags');
}