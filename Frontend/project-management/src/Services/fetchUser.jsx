import axios from "axios";

const getUserById = (id, jwt) => {
    return axios({
        method: "get",
        url: `http://localhost:8080/api/user/${id}`,
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

const getUsersByIds = (ids, jwt) => {
    return axios.all(ids.map((id) => getUserById(id, jwt)));
};

const getUsersByUsername = (username, jwt) => {
    return axios({
        method: "get",
        url: `http://localhost:8080/api/user?username=${username}`,
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

const register = (data) => {
    return axios({
        method: "post",
        url: `http://localhost:8080/api/auth/register`,
        data,
    });
};

const update = (data) => {
    return axios({
        method: "put",
        url: "http://localhost:8080/api/auth/update",
        data,
    });
};

export { getUserById, getUsersByIds, getUsersByUsername, register, update };
