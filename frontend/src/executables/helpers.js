import axios from "axios";

export const helpers = {
    getResource: (payload) => {
        const { resource, id } = payload;
        const response = axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/${resource}/${id}`);
        return response;
        
    }
}