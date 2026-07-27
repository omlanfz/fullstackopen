import axios from "axios";

// const baseUrl = "http://localhost:3001/persons";
const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => axios.get(baseUrl).then((res) => res.data);

const create = (entry) => axios.post(baseUrl, entry).then((res) => res.data);

const update = (id, entry) =>
  axios.put(`${baseUrl}/${id}`, entry).then((res) => res.data);

const remove = (id) => axios.delete(`${baseUrl}/${id}`).then((res) => res.data);

export default { getAll, create, update, remove };
