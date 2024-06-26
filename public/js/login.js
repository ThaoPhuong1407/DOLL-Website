import axios from 'axios';

export const login = async (email, password) => {
  let hostname;
  if (process.env.NODE_ENV === 'development')
    hostname = 'http://localhost:3000';

  if (process.env.NODE_ENV === 'production')
    hostname = `https://${location.hostname}`;

  console.log(process.env.NODE_ENV);
  console.log(hostname);
  try {
    const res = await axios({
      method: 'POST',
      url: `${hostname}/api/users/login`,
      data: { email: email, password: password },
    });

    if (res.data.status === 'success') {
      alert('Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
    console.log(err.response);
  }
};

export const logout = async () => {
  let hostname;
  if (process.env.NODE_ENV === 'development')
    hostname = 'http://localhost:3000';

  if (process.env.NODE_ENV === 'production')
    hostname = `https://${location.hostname}`;

  try {
    const res = await axios({
      method: 'GET',
      url: `${hostname}/api/users/logout`,
    });
    if ((res.data.status = 'success')) {
      location.reload(true);
    }
  } catch (err) {
    console.log(err);
    alert('Error logging out! Try again.');
  }
};
