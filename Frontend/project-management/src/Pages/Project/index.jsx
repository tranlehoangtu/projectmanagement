import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Stack, Typography } from "@mui/material";
import Customs from "../../Styled/Customs";
import Controls from "../../Control/Controls";
import { useForm } from "../../Services/useForm";
import {
    deleteProject,
    getProjectsByIds,
    insertProject,
    updateProject,
} from "../../Services/fetchProject";
import { getUsersByIds } from "../../Services/fetchUser";

const initialValues = {
    students: [],
    projects: [],
    teachers: [],
    isEdit: null,
    modal: { project: false },
    loading: { projects: true, students: true, teachers: true },
    post: { projectName: "", finishTime: new Date() },
    info: {
        status: false,
        message: "",
        severity: "",
    },
    permission: { edit: false, remove: false },
};

const Project = () => {
    const { values, setValues } = useForm(initialValues);
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (values.loading.projects) {
            if (currentUser.projects.length > 0) {
                getProjectsByIds(currentUser.projects, currentUser.jwt).then(
                    (res) =>
                        res.forEach((item, index) => {
                            setValues((prev) => ({
                                ...prev,
                                projects: [...prev.projects, item.data],
                            }));
                            if (res.length === index + 1) {
                                setValues((prev) => ({
                                    ...prev,
                                    loading: {
                                        ...prev.loading,
                                        projects: false,
                                    },
                                }));
                            }
                        })
                );
            } else {
                setValues((prev) => ({
                    ...prev,
                    loading: {
                        ...prev.loading,
                        projects: false,
                        students: false,
                        teachers: false,
                    },
                }));
            }
        } else if (values.loading.students) {
            var temp = [];

            values.projects.forEach((project) => {
                project.members.forEach((member) => (temp = [...temp, member]));
            });

            const members = temp.reduce((acc, currentMember) => {
                const isNotValid = acc.find((item) => item === currentMember);
                if (isNotValid) return [...acc];

                return [...acc, currentMember];
            }, []);

            if (members.length === 0) {
                setValues((prev) => ({
                    ...prev,
                    loading: { ...prev.loading, students: false },
                }));
            } else {
                getUsersByIds(members, currentUser.jwt).then((res) => {
                    res.forEach((item, index) => {
                        setValues((prev) => {
                            return {
                                ...prev,
                                students: [...prev.students, item.data],
                            };
                        });
                        if (res.length === index + 1) {
                            setValues((prev) => ({
                                ...prev,
                                loading: { ...prev.loading, students: false },
                            }));
                        }
                    });
                });
            }
        } else if (values.loading.teachers) {
            const teachers = values.projects.reduce((acc, currentValues) => {
                const isNotValid = acc.find(
                    (item) => item === currentValues.projectManager
                );
                if (isNotValid) return [...acc];
                return [...acc, currentValues.projectManager];
            }, []);
            getUsersByIds(teachers, currentUser.jwt).then((res) =>
                res.forEach((teacher, index) => {
                    setValues((prev) => {
                        return {
                            ...prev,
                            teachers: [...prev.teachers, teacher.data],
                        };
                    });
                    if (res.length === index + 1) {
                        setValues((prev) => ({
                            ...prev,
                            loading: { ...prev.loading, teachers: false },
                        }));
                    }
                })
            );
        }
    }, [currentUser, values, setValues]);

    const navigate = useNavigate();
    const handleClick = (id) => {
        navigate("/project/" + id);
    };

    const handleModalClose = () => {
        setValues((prev) => ({
            ...prev,
            modal: { ...prev.modal, project: false },
            isEdit: null,
            post: { projectName: "", finishTime: new Date() },
        }));
    };

    const handleInputChanges = (event) => {
        const { name, value } = event.target;

        setValues({
            ...values,
            post: { ...values.post, [name]: value },
        });
    };

    const handleProjectCreate = () => {
        const finishTime = new Date(values.post.finishTime);
        const now = new Date();

        const project = {
            projectName: values.post.projectName,
            userid: currentUser.id,
            timespan: `${Math.round(
                (finishTime.getTime() - now.getTime()) / (1000 * 3600 * 24)
            )} ngày`,
            dueDate: finishTime,
            projectManager: currentUser.id,
            members: [],
            tasks: [],
            leader: null,
            createBy: currentUser.id,
            createAt: now,
            editAt: now,
        };
        insertProject(currentUser.jwt, project).then((res) => {
            setValues((prev) => ({
                ...prev,
                projects: [...prev.projects, res.data],
                teachers: [...prev.teachers, currentUser],
                modal: { ...prev.modal, project: false },
                post: { projectName: "", finishTime: new Date() },
                info: {
                    ...prev.info,
                    message: "Tạo dự án thành công",
                    severity: "info",
                    status: true,
                },
            }));
            currentUser = {
                ...currentUser,
                projects: [...currentUser.projects, res.data.id],
            };
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        });
    };

    const handleProjectUpdate = () => {
        const project = {
            id: values.isEdit,
            projectName: values.post.projectName,
            dueDate: values.post.finishTime,
        };

        updateProject(currentUser.jwt, project).then((res) => {
            const projects = values.projects.map((project) => {
                if (project.id === res.data.id) return res.data;
                return project;
            });
            console.log(projects);

            setValues((prev) => ({
                ...prev,
                modal: { ...prev.modal, project: false },
                post: { projectName: "", finishTime: new Date() },
                projects,
                info: {
                    ...prev.info,
                    message: "Hoàn tất chỉnh sửa dự án",
                    severity: "success",
                    status: true,
                },
            }));
        });
    };

    const getCardValues = (project) => {
        let list = [];

        if (project.members.length > 0) {
            list = values.students.reduce((acc, student) => {
                if (project.members.find((member) => member === student.id)) {
                    const cardContent = {
                        avatar: student.fullName.charAt(0),
                        primary: student.username.toUpperCase(),
                        secondary: student.fullName,
                    };

                    return [...acc, cardContent];
                }
                return acc;
            }, []);
        }

        const result = {
            id: project.id,
            title: project.projectName,
            subheader: values.teachers.find(
                (teacher) => teacher.id === project.projectManager
            ).fullName,
            members: list,
        };

        return result;
    };

    const onDeleteClick = (id) => {
        if (currentUser.authorities[0].authority !== "ROLE_MANAGEMENT") {
            setValues((prev) => ({
                ...prev,
                info: {
                    status: true,
                    message: "Bạn không thể thực hiện chức năng này",
                    severity: "warning",
                },
            }));
        } else {
            const projects = values.projects.filter(
                (item) => !(item.id === id)
            );
            const project = {
                id,
                userId: currentUser.id,
            };

            deleteProject(currentUser.jwt, project).then((res) => {
                setValues((prev) => ({
                    ...prev,
                    projects,
                    info: {
                        ...prev.info,
                        message: "Xóa dự án thành công",
                        severity: "error",
                        status: true,
                    },
                }));
                currentUser = {
                    ...currentUser,
                    projects: projects.map((item) => item.id),
                };
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );
            });
        }
    };

    const onEditClick = (id) => {
        if (currentUser.authorities[0].authority !== "ROLE_MANAGEMENT") {
            setValues((prev) => ({
                ...prev,
                info: {
                    status: true,
                    message: "Bạn không thể thực hiện chức năng này",
                    severity: "warning",
                },
            }));
        } else {
            const project = values.projects.find((item) => item.id === id);

            setValues((prev) => ({
                ...prev,
                isEdit: id,
                modal: { ...prev.modal, project: true },
                post: {
                    ...prev.post,
                    projectName: project.projectName,
                    finishTime: new Date(project.dueDate),
                },
            }));
        }
    };

    const handleInfoClose = () => {
        setValues((prev) => ({
            ...prev,
            info: { ...prev.info, status: false },
        }));
    };

    return (
        <div style={{ padding: "0 100px" }}>
            {values.loading.teachers ? (
                <CircularProgress />
            ) : (
                <>
                    <Typography align="center" variant="h2" sx={{ m: 2 }}>
                        Danh sách dự án hiện có
                    </Typography>

                    {currentUser.authorities.find(
                        (authority) => authority.authority === "ROLE_MANAGEMENT"
                    ) && (
                        <Customs.Button
                            variant="outlined"
                            size="large"
                            sx={{ padding: 2 }}
                            onClick={() =>
                                setValues((prev) => ({
                                    ...prev,
                                    modal: {
                                        ...prev.modal,
                                        project: true,
                                    },
                                }))
                            }
                        >
                            Thêm dự án
                        </Customs.Button>
                    )}

                    <Customs.Modal
                        open={values.modal.project}
                        onClose={handleModalClose}
                        other={{ width: "320px" }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h5"
                            component="h2"
                            sx={{ mb: 2 }}
                            align="center"
                        >
                            Nội dung của dự án
                        </Typography>
                        <Controls.Input
                            label="Tên dự án"
                            name="projectName"
                            value={values.post.projectName}
                            onChange={handleInputChanges}
                            fullWidth
                            autoComplete="off"
                            required
                        />
                        <Controls.MaterialUIPickers
                            label="Thời điểm hoàn thành"
                            value={values.post.finishTime}
                            name="finishTime"
                            onChange={handleInputChanges}
                        />
                        <Customs.Button
                            fullWidth
                            variant="contained"
                            onClick={
                                values.isEdit
                                    ? handleProjectUpdate
                                    : handleProjectCreate
                            }
                            sx={{ mt: 2 }}
                        >
                            {values.isEdit ? "Sửa" : "Tạo"}
                        </Customs.Button>
                    </Customs.Modal>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{ mt: 2, flexWrap: "wrap" }}
                    >
                        {values.projects.length > 0 ? (
                            values.projects.map((project) => (
                                <Customs.MuiCard
                                    key={project.id}
                                    cardValues={getCardValues(project)}
                                    handleClick={handleClick}
                                    onDeleteClick={onDeleteClick}
                                    onEditClick={onEditClick}
                                    editable={false}
                                />
                            ))
                        ) : (
                            <Typography variant="h4">
                                BẠN HIỆN CHƯA CÓ DỰ ÁN NÀO
                            </Typography>
                        )}
                    </Stack>
                    <Customs.CustomizedSnackbars
                        message={values.info.message}
                        open={values.info.status}
                        handleClose={handleInfoClose}
                        severity={values.info.severity}
                    />
                </>
            )}
        </div>
    );
};

export default Project;
