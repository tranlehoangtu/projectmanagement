import axios from "axios";

const getComment = async (id, jwt) => {
    return axios({
        method: "get",
        url: `http://localhost:8080/api/comment/${id}`,
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

const getCommentsByIds = async (ids, jwt) => {
    return axios.all(ids.map((id) => getComment(id, jwt)));
};

const addComment = async (jwt, data) => {
    return axios({
        method: "post",
        url: "http://localhost:8080/api/comment",
        headers: { Authorization: `Bearer ${jwt}` },
        data,
    });
};

const deleteComment = async (jwt, comment, taskId) => {
    return axios({
        method: "delete",
        url: "http://localhost:8080/api/comment",
        headers: { Authorization: `Bearer ${jwt}` },
        data: {
            ...comment,
            taskId,
        },
    });
};

const editComment = async (jwt, comment) => {
    return axios({
        method: "put",
        url: "http://localhost:8080/api/comment",
        headers: { Authorization: `Bearer ${jwt}` },
        data: {
            ...comment,
        },
    });
};

export { getComment, getCommentsByIds, addComment, deleteComment, editComment };
