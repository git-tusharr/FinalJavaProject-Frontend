import axios from "axios";

export const getAllBrands = async () => {
  return axios.get("http://localhost:8080/api/brands");
};
