import axios from "axios";

const getTasksByIds = (ids, jwt) => {
    return axios.all(ids.map((id) => getTaskById(id, jwt)));
};

const getTaskById = (id, jwt) => {
    return axios({
        method: "get",
        url: `http://localhost:8080/api/task/${id}`,
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

const insertTask = (data, jwt) => {
    return axios({
        method: "post",
        url: "http://localhost:8080/api/task",
        headers: { Authorization: `Bearer ${jwt}` },
        data,
    });
};

const deleteTasks = async (taskIds, jwt, projectId) => {
    return axios({
        method: "delete",
        url: "http://localhost:8080/api/tasks/delete",
        headers: { Authorization: `Bearer ${jwt}` },
        data: {
            taskIds: [...taskIds],
            projectId,
        },
    });
};

const updateTaskContent = async (id, jwt, contents) => {
    return axios({
        method: "put",
        url: "http://localhost:8080/api/task/update",
        headers: { Authorization: `Bearer ${jwt}` },
        data: {
            type: "contents",
            id,
            contents,
        },
    });
};

export {
    getTaskById,
    updateTaskContent,
    getTasksByIds,
    insertTask,
    deleteTasks,
};
