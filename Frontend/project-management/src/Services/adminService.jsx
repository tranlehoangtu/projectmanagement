import axios from "axios";

const adminRegister = async (data) => {
    return axios({
        method: "post",
        url: "http://localhost:8080/api/admin/register",
        data,
    });
};

const adminLogin = async (data) => {
    return axios({
        method: "post",
        url: "http://localhost:8080/api/admin/login",
        data,
    });
};

export { adminRegister, adminLogin };
