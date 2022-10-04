import axios from "axios";

const getNotification = async (id, jwt) => {
    return axios({
        method: "get",
        url: `http://localhost:8080/api/notification/${id}`,
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

const getNotificationByIds = async (ids, jwt) => {
    return axios.all(ids.map((id) => getNotification(id, jwt)));
};

export { getNotification, getNotificationByIds };
