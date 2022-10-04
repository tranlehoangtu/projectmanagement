import axios from "axios";

const url = "http://localhost:8080/api";

const getStudentByUserId = (userId, jwt) => {
    return axios.get(`${url}/student/${userId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

const getStudentById = (id, jwt) => {
    console.log(jwt);
    // return axios({
    //     method: "get",
    //     url: `http://localhost:8080/api/student/${id}`,
    //     headers: { Authorization: `Bearer ${jwt}` },
    // });
};

const getStudentsByIds = (ids, jwt) => {
    // return axios.all(ids.map((id) => getProjectById(id, jwt)));
};

const getProjectsFromStudent = (id, jwt) => {
    return axios.get(`${url}/student?id=${id}&value=projects`, {
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

const getAllStudent = (jwt) => {
    return axios.get(`${url}/students`, {
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

export {
    getAllStudent,
    getStudentByUserId,
    getStudentsByIds,
    getProjectsFromStudent,
    getStudentById,
};
