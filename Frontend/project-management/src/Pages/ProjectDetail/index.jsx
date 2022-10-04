import { Avatar, CircularProgress, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Controls from "../../Control/Controls";
import { getProjectById } from "../../Services/fetchProject";
import {
    deleteTasks,
    getTasksByIds,
    insertTask,
} from "../../Services/fetchTask";
import { getUsersByIds } from "../../Services/fetchUser";
import { useForm } from "../../Services/useForm";
import Customs from "../../Styled/Customs";

const initialValues = {
    project: null,
    currentUser: null,
    datas: { tasks: [], members: [] },
    modal: { task: false },
    loading: {
        project: true,
        tasks: true,
        members: true,
        anythingLeft: true,
        currentUser: true,
    },
    post: {
        "Tên nhiệm vụ": "",
        "Bắt đầu": new Date(),
        "Kết thúc": new Date(),
        content: "",
        taskMember: [],
        moreMember: [],
    },
    search: { task: "", tasks: [] },
    info: { success: false, remove: false },
    permission: { edit: false, promo: false },
};

const taskTableHeaders = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Tên công việc".toUpperCase(),
    },
    {
        id: "members",
        numeric: false,
        disablePadding: true,
        label: "Chịu trách nhiệm thực hiện".toUpperCase(),
    },
    {
        id: "timespan",
        numeric: false,
        disablePadding: true,
        label: "Thời gian hoàn thành".toUpperCase(),
    },
    {
        id: "dueDate",
        numeric: false,
        disablePadding: true,
        label: "Hạn chót".toUpperCase(),
    },
    {
        id: "status",
        numeric: false,
        disablePadding: true,
        label: "Trạng thái".toUpperCase(),
    },
];

const taskTableBodies = ["name", "members", "timespan", "dueDate", "status"];

const findStudentByID = (students, id) => {
    return students.find((student) => student.id === id);
};

const convertTaskValues = (tasks, members) => {
    return tasks.map((task) => {
        const d = new Date(task.dueDate);

        return {
            ...task,
            members: (
                <>
                    {task.members.map((memberId) => (
                        <Stack
                            key={memberId}
                            direction="row"
                            alignItems="center"
                            sx={{ padding: "4px" }}
                        >
                            <Avatar
                                sx={{ marginRight: "8px", bgcolor: "violet" }}
                            >
                                {findStudentByID(
                                    members,
                                    memberId
                                ).fullName.charAt(0)}
                            </Avatar>
                            <span>
                                {findStudentByID(members, memberId).fullName}
                            </span>
                        </Stack>
                    ))}
                </>
            ),
            dueDate: `${d.getDate()} - ${
                d.getMonth() + 1
            } - ${d.getFullYear()}`,
        };
    });
};

const ProjectDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { values, setValues } = useForm(initialValues);

    useEffect(() => {
        if (values.loading.currentUser) {
            setValues((prev) => ({
                ...prev,
                loading: { ...prev.loading, currentUser: false },
                currentUser: JSON.parse(localStorage.getItem("currentUser")),
            }));
        } else if (values.loading.project) {
            getProjectById(
                location.pathname.substring(
                    location.pathname.lastIndexOf("/") + 1,
                    location.pathname.length
                ),
                values.currentUser.jwt
            ).then((res) =>
                setValues((prev) => ({
                    ...prev,
                    project: res.data,
                    loading: { ...prev.loading, project: false },
                }))
            );
        } else if (values.loading.tasks) {
            if (values.project.tasks.length > 0) {
                getTasksByIds(
                    values.project.tasks,
                    values.currentUser.jwt
                ).then((res) =>
                    res.forEach((task) => {
                        setValues((prev) => ({
                            ...prev,
                            datas: {
                                ...prev.datas,
                                tasks: [...prev.datas.tasks, task.data],
                            },
                            loading: { ...prev.loading, tasks: false },
                        }));
                    })
                );
            } else {
                setValues((prev) => ({
                    ...prev,
                    loading: { ...prev.loading, tasks: false },
                }));
            }
        } else if (values.loading.members) {
            if (values.project.members.length === 0) {
                setValues((prev) => ({
                    ...prev,
                    loading: { ...prev.loading, members: false },
                }));
            } else {
                getUsersByIds(
                    values.project.members,
                    values.currentUser.jwt
                ).then((res) =>
                    res.forEach((member) => {
                        setValues((prev) => ({
                            ...prev,
                            datas: {
                                ...prev.datas,
                                members: [...prev.datas.members, member.data],
                            },
                            loading: { ...prev.loading, members: false },
                        }));
                    })
                );
            }
        } else if (values.loading.anythingLeft) {
            setValues((prev) => ({
                ...prev,
                search: {
                    ...prev.search,
                    tasks: prev.datas.tasks,
                },
                loading: {
                    ...prev.loading,
                    anythingLeft: false,
                },
                permission: {
                    ...prev.permission,
                    edit:
                        values.currentUser.id === values.project.leader ||
                        values.currentUser.id === values.project.projectManager,
                },
            }));
        }
    }, [location, values, setValues]);

    const handleTaskDelete = (selected) => {
        if (
            values.currentUser.id === values.project.leader ||
            values.currentUser.id === values.project.projectManager
        ) {
            const list = values.datas.tasks.filter(
                (task) => !selected.includes(task.id)
            );

            deleteTasks(
                selected,
                values.currentUser.jwt,
                location.pathname.substring(
                    location.pathname.lastIndexOf("/") + 1,
                    location.pathname.length
                )
            ).then((res) => {
                setValues((prev) => ({
                    ...prev,
                    project: res.data,
                    datas: { ...prev.datas, tasks: list },
                    search: { task: "", tasks: list },
                    info: { ...prev.info, remove: true },
                }));
            });
        } else {
            setValues((prev) => ({
                ...prev,
                info: {
                    status: true,
                    message: "Bạn không thể thực hiện tác vụ này",
                    severity: "warning",
                },
            }));
        }
    };

    const handleTaskClick = (id) => {
        navigate(`${id}`);
    };

    const handleSearchTaskChange = (event) => {
        setValues((prev) => {
            return {
                ...prev,
                search: {
                    ...prev.search,
                    task: event.target.value,
                    tasks: prev.datas.tasks.filter((item) =>
                        item.name
                            .toLowerCase()
                            .includes(event.target.value.toLowerCase())
                    ),
                },
            };
        });
    };

    const handleTaskRemoveClick = () => {
        setValues((prev) => {
            return {
                ...prev,
                search: { ...prev.search, task: "", tasks: prev.datas.tasks },
            };
        });
    };

    const handleTaskModalClose = () => {
        setValues((prev) => ({
            ...prev,
            modal: { ...prev.modal, task: false },
            post: {
                ...prev.post,
                start: null,
                end: null,
                taskMember: [],
                taskName: "",
            },
        }));
    };

    const handleInputChanges = (event) => {
        const { name, value } = event.target;

        setValues({
            ...values,
            post: { ...values.post, [name]: value },
        });
    };

    const convertToName = (values) => {
        return values.map((member) => ({
            id: member.id,
            name: member.fullName,
        }));
    };

    const handleTaskMenuItemClick = (id) => {
        if (values.post.taskMember.length === 0)
            setValues({
                ...values,
                post: {
                    ...values.post,
                    taskMember: [...values.post.taskMember, id],
                },
            });
        else {
            var valid = true;
            values.post.taskMember.forEach((item) => {
                if (item === id) {
                    valid = false;
                    return;
                }
            });

            if (valid) {
                setValues({
                    ...values,
                    post: {
                        ...values.post,
                        taskMember: [...values.post.taskMember, id],
                    },
                });
            } else {
                const index = values.post.taskMember.indexOf(id);
                values.post.taskMember.splice(index, 1);
                setValues({
                    ...values,
                    post: {
                        ...values.post,
                        taskMember: [...values.post.taskMember],
                    },
                });
            }
        }
    };

    const handleTaskSubmit = () => {
        const { post, project } = values;

        const start = new Date(post["Bắt đầu"]);
        const end = new Date(post["Kết thúc"]);

        const days = Math.floor(
            (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
        );

        const postValues = {
            name: post["Tên nhiệm vụ"],
            contents: post.content,
            members: [...post.taskMember],
            timespan: `${days} ngày`,
            dueDate: end,
            status: "Hoàn Thành",
            projectId: project.id,
            createBy: values.currentUser.id,
            createAt: new Date(),
            editAt: new Date(),
        };

        insertTask(postValues, values.currentUser.jwt).then((res) => {
            setValues((prev) => ({
                ...prev,
                project: {
                    ...prev.project,
                    tasks: [...prev.project.tasks, res.data.id],
                },
                modal: { task: false },
                datas: {
                    ...prev.datas,
                    tasks: [...prev.datas.tasks, res.data],
                },
                post: {
                    "Tên nhiệm vụ": "",
                    "Bắt đầu": new Date(),
                    "Kết thúc": new Date(),
                    taskMember: [],
                    moreMember: [],
                },
                search: {
                    ...prev.search,
                    tasks: [...prev.datas.tasks, res.data],
                },
                info: { ...prev.info, success: true },
            }));
        });
    };

    const handleSuccessClose = (event, reason) => {
        setValues((prev) => ({
            ...prev,
            info: { ...prev.info, success: false },
        }));
    };

    const handleRemoveClose = (event, reason) => {
        setValues((prev) => ({
            ...prev,
            info: { ...prev.info, remove: false },
        }));
    };

    return (
        <>
            {values.loading.anythingLeft ? (
                <CircularProgress />
            ) : (
                <>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{
                            borderBottom: "1px solid grey",
                            borderTop: "1px solid grey",
                        }}
                    >
                        <Customs.Button
                            sx={{ padding: "12px", fontSize: "20px" }}
                            onClick={() =>
                                navigate(`/project/${values.project.id}`)
                            }
                        >
                            {values.project.projectName}
                        </Customs.Button>
                        <Customs.Button
                            sx={{ padding: "12px", fontSize: "20px" }}
                            onClick={() =>
                                navigate(
                                    `/project/${values.project.id}/members`,
                                    {
                                        state: {
                                            projectId:
                                                location.pathname.substring(
                                                    location.pathname.lastIndexOf(
                                                        "/"
                                                    ) + 1,
                                                    location.pathname.length
                                                ),
                                        },
                                    }
                                )
                            }
                        >
                            Thành Viên
                        </Customs.Button>
                    </Stack>
                    <Stack padding={8}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            {values.project.leader === values.currentUser.id ||
                            values.project.projectManager ===
                                values.currentUser.id ? (
                                <Customs.Button
                                    variant="outlined"
                                    size="large"
                                    sx={{ mb: 2, padding: 2 }}
                                    onClick={() =>
                                        setValues({
                                            ...values,
                                            modal: {
                                                ...values.modal,
                                                task: true,
                                            },
                                        })
                                    }
                                >
                                    THÊM CÔNG VIỆC
                                </Customs.Button>
                            ) : (
                                <span></span>
                            )}
                            <Stack sx={{ width: "40ch" }}>
                                <Controls.SearchBar
                                    values={values.search.task}
                                    onChange={handleSearchTaskChange}
                                    onRemoveClick={handleTaskRemoveClick}
                                    label="Tìm theo tên công việc"
                                />
                            </Stack>
                        </Stack>
                        <Customs.EnhancedTable
                            values={convertTaskValues(
                                values.search.tasks,
                                values.datas.members
                            )}
                            tableHeaders={taskTableHeaders}
                            tableBodies={taskTableBodies}
                            handleDelete={handleTaskDelete}
                            label="Công việc"
                            onItemClick={handleTaskClick}
                            permission={values.permission}
                        />
                    </Stack>
                    <Customs.Modal
                        open={values.modal.task}
                        onClose={handleTaskModalClose}
                        other={{ width: "520px" }}
                    >
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                            NỘI DUNG CÔNG VIỆC
                        </Typography>
                        <Controls.Input
                            label="Tên Công Việc"
                            name="Tên nhiệm vụ"
                            value={values.post["Tên nhiệm vụ"]}
                            onChange={handleInputChanges}
                            fullWidth
                            autoComplete="off"
                            required
                        />
                        <Controls.MultipleSelect
                            values={convertToName(values.datas.members)}
                            setValues={setValues}
                            label="Học sinh"
                            handleMenuItemClick={handleTaskMenuItemClick}
                        />
                        <TextField
                            label="Nội dung"
                            multiline
                            name="content"
                            rows={4}
                            values={values.post.content}
                            onChange={handleInputChanges}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ marginBottom: 2 }}
                        >
                            <Controls.MaterialUIPickers
                                label="Bắt đầu"
                                value={values.post["Bắt đầu"]}
                                name="Bắt đầu"
                                onChange={handleInputChanges}
                            />
                            <Controls.MaterialUIPickers
                                label="Kết thúc"
                                value={values.post["Kết thúc"]}
                                name="Kết thúc"
                                onChange={handleInputChanges}
                            />
                        </Stack>
                        <Customs.Button
                            fullWidth
                            variant="contained"
                            onClick={handleTaskSubmit}
                        >
                            Thêm
                        </Customs.Button>
                    </Customs.Modal>
                    <Customs.CustomizedSnackbars
                        message="Thêm thành công"
                        open={values.info.success}
                        handleClose={handleSuccessClose}
                        severity="info"
                    />
                    <Customs.CustomizedSnackbars
                        message="Xoá thành công"
                        open={values.info.remove}
                        handleClose={handleRemoveClose}
                        severity="error"
                    />
                </>
            )}
        </>
    );
};

export default ProjectDetail;
