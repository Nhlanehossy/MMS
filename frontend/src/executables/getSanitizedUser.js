import axios from "axios";



export const getUserWithRole = async (userId) => {
  try {
    // Fetch user data
    const userResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/users/${userId}`);
    const user = userResponse.data;

    // Fetch roles data
    const rolesResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/roles?limit=1000`);
    const roles = rolesResponse.data.data;

    // Find the user's role from the roles data
    const userRole = roles.find(role => role.id === user.role);

    if (userRole) {
      // Replace the role ID with the role name
      user.role = userRole.roleName;
    } else {
      console.error('Role not found for user.');
    }

    return user;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};




