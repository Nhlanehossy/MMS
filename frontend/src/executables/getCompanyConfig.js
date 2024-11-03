import axios from "axios";


export const getCompanyConfig = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/v1/company-config`
        );
        return response.data.data[0];
    } catch (error) {
        console.error(error);
    }
}
