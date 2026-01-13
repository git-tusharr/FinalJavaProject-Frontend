import axios from "axios";

const API_BASE = "http://localhost:8080/api/attributes";

export const createAttribute = async (attributeData) => {
  return axios.post(API_BASE, attributeData);
};

export const getAllAttributes = async () => {
  return axios.get(API_BASE);
};
