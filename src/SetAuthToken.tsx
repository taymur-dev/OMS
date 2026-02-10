import axios from "axios";

const setAuthToken = (token: string | null) => {
  if (token) {
    sessionStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    sessionStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
