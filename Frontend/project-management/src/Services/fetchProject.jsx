import axios from "axios";

const url = "http://localhost:8080/api";

const fetchProjectFromUser = (id, jwt) => {
    return axios.get(`${url}/user?id=${id}&value=projects`, {
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

const getProjectById = (id, jwt) => {
    return axios({
        method: "get",
        url: `http://localhost:8080/api/project/${id}`,
        headers: { Authorization: `Bearer ${jwt}` },
    });
};

const getProjectsByIds = async (ids, jwt) => {
    return axios.all(ids.map((id) => getProjectById(id, jwt)));
};

const updateMembersToProject = (projectId, memberIds, jwt, type) => {
    return axios({
        method: "put",
        url: `http://localhost:8080/api/project?members=${type}`,
        headers: { Authorization: `Bearer ${jwt}` },
        data: {
            projectId,
            members: memberIds,
        },
    });
};

const insertProject = (jwt, project) => {
    return axios({
        method: "post",
        url: `http://localhost:8080/api/project`,
        headers: { Authorization: `Bearer ${jwt}` },
        data: {
            ...project,
        },
    });
};

const deleteProject = async (jwt, project) => {
    return axios({
        method: "delete",
        url: `http://localhost:8080/api/project`,
        headers: { Authorization: `Bearer ${jwt}` },
        data: { ...project },
    });
};

const updateProject = async (jwt, project) => {
    return axios({
        method: "put",
        url: `http://localhost:8080/api/project/update`,
        headers: { Authorization: `Bearer ${jwt}` },
        data: { ...project },
    });
};

const upgradeProject = async (jwt, project) => {
    return axios({
        method: "put",
        url: `http://localhost:8080/api/project/upgrade`,
        headers: { Authorization: `Bearer ${jwt}` },
        data: { ...project },
    });
};

export {
    fetchProjectFromUser,
    getProjectById,
    getProjectsByIds,
    updateMembersToProject,
    insertProject,
    deleteProject,
    updateProject,
    upgradeProject,
};
