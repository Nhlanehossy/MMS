import axios from 'axios';
import { getMessaging, getToken } from "firebase/messaging";

export const effects = {
    sendWebPushNotification: async (title, body, icon, additionalTokens, userId = []) => {
        const messaging = getMessaging();
        
        try {
          const currentToken = await getToken(messaging, { 
            vapidKey: 'BBMLeMHCNGuQapVD-kTi7bhKL5C3iha-_MIZ0jbSoz4VoNUj3SnOM0Za8e2RIn-nR_PQX6_xW2qWEg7m1zfoZTg' 
          });
          
          // Remove duplicates and null/undefined values
          const allTokens = [...new Set([currentToken, ...additionalTokens])].filter(Boolean);
      
          console.log('Sending notifications to tokens:', allTokens);
      
          if (allTokens.length === 0) {
            console.log('No tokens available to send notifications.');
            return null;
          }
      
          const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/fcm/users/notify`, {
            title,
            body,
            icon,
            tokens: allTokens
          });

          if (response.status == 200) {
            //save the notification to the database
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/notifications`, {
              title,
              body,
              icon,
              recipient:userId,
            })
          }
      
          console.log('Server response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Error sending web push notifications:', error);
          if (error.response) {
            console.error('Server responded with:', error.response.data);
          }
          throw error;
        }
      },
  
  sendEmail: async (payload) => {
    try {


      const { Logo, subject, recipientEmail, message } = payload;

      let headersList = {
       "Content-Type": "application/json" 
      }
      
      let bodyContent = JSON.stringify({
        "logo":Logo,
        "subject":subject,
        "recipientEmail":recipientEmail,
        "message":message
      });
      
      let reqOptions = {
        url: `${import.meta.env.VITE_APP_API_URL}/sendEmail`,
        method: "POST",
        headers: headersList,
        data: bodyContent,
      }
      
      let response = await axios.request(reqOptions);
      console.log(response.data);
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
    
  },
  recordActivity: async (payload) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/activity-log`, payload);
      console.log('Activity recorded:', response.data);
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  },
};