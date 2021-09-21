import axios from "axios";

export const login = async (email, password) => {
  const hostname = "" || location.hostname;
  try {
    const res = await axios({
      method: "POST",
      url: `https://${hostname}/api/users/login`,
      data: { email: email, password: password },
    });

    if (res.data.status === "success") {
      alert("Logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
    console.log(err.response);
  }
};

export const logout = async () => {
  const hostname = "" || location.hostname;
  try {
    const res = await axios({
      method: "GET",
      url: `https://${hostname}/api/users/logout`,
    });
    if ((res.data.status = "success")) {
      location.reload(true);
    }
  } catch (err) {
    console.log(err);
    alert("Error logging out! Try again.");
  }
};
