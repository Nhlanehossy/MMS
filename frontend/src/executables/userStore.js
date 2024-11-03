import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const userStore = {
  router: useRouter(),

  // Data
  clientId: ref("1082619959381-qfd8bhbaaa8ijgqmmlqirbd0r27fk1bc.apps.googleusercontent.com"),
  clientSecret: ref("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"),
  userData: ref({}),

  fetchUserDataFrom: async (code) => {
    try {
      localStorage.setItem('gCode', JSON.stringify(code));

      const { data } = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: userStore.clientId.value,
          client_secret: userStore.clientSecret.value,
          redirect_uri: "https://www.akukalodge.com ",
          grant_type: 'authorization_code',
        },
      );

      if (data) {
        const accessToken = data.access_token;

        // Fetch user details using the access token
        const userObj = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (userObj && userObj.data) {
          // save copy in storage
          localStorage.setItem('user', JSON.stringify(userObj.data));
          userStore.userData.value = userObj.data;
        } else {
          // Handle the case where userResponse or userResponse.data is undefined
          console.error('Failed to fetch user data');
        }
      }
    } catch (e) {
      console.error('Failed to exchange token', e);
    }
  },
};

export default userStore;