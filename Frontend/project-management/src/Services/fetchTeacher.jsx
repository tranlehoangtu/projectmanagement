import axios from "axios";

const getTeacherById = (id, jwt) => {
    return axios({
        method: "get",
        url: `http://localhost:8080/api/teacher/${id}`,
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

export { getTeacherById };
