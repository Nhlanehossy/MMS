import axios from "axios";


export const getSystemConfig = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/v1/system-config`
        );
        
        return response.data.data[0];
    } catch (error) {
        console.error(error);
    }
}
