import { AssignmentTurnedInOutlined, Send } from "@mui/icons-material";
import {
    Avatar,
    Button,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Input,
    InputAdornment,
    Stack,
    Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Comments from "../../Components/Comment/Comments";
import {
    addComment,
    deleteComment,
    editComment,
    getCommentsByIds,
} from "../../Services/fetchComment";
import { getProjectById } from "../../Services/fetchProject";
import { getTaskById } from "../../Services/fetchTask";
import { getUserById } from "../../Services/fetchUser";
import { useForm } from "../../Services/useForm";

const initialValues = {
    currentUser: null,
    task: null,
    project: null,
    teacher: null,
    createBy: null,
    comments: [],
    loading: {
        currentUser: true,
        task: true,
        project: true,
        teacher: true,
        createBy: true,
        comments: true,
    },
    post: { comment: "", oldComment: "" },
    edit: { isEdit: false, id: null },
};

const getUniqueValues = (list, item) => {
    return list.filter((listItem) => !(listItem === item));
};

const TaskDetail = () => {
    const { values, setValues } = useForm(initialValues);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (values.loading.currentUser) {
            setValues((prev) => ({
                ...prev,
                loading: { ...prev.loading, currentUser: false },
                currentUser: JSON.parse(localStorage.getItem("currentUser")),
            }));
        } else if (values.loading.task) {
            const taskId = location.pathname.substring(
                location.pathname.lastIndexOf("/") + 1,
                location.pathname.length
            );
            getTaskById(taskId, values.currentUser.jwt).then((res) =>
                setValues((prev) => ({
                    ...prev,
                    loading: { ...prev.loading, task: false },
                    task: res.data,
                }))
            );
        } else if (values.loading.project) {
            getProjectById(values.task.projectId, values.currentUser.jwt).then(
                (res) =>
                    setValues((prev) => ({
                        ...prev,
                        loading: { ...prev.loading, project: false },
                        project: res.data,
                    }))
            );
        } else if (values.loading.teacher) {
            getUserById(
                values.project.projectManager,
                values.currentUser.jwt
            ).then((res) =>
                setValues((prev) => ({
                    ...prev,
                    loading: { ...prev.loading, teacher: false },
                    teacher: res.data,
                }))
            );
        } else if (values.loading.createBy) {
            getUserById(values.task.createBy, values.currentUser.jwt).then(
                (res) =>
                    setValues((prev) => ({
                        ...prev,
                        loading: { ...prev.loading, createBy: false },
                        createBy: res.data,
                    }))
            );
        } else if (values.loading.comments) {
            if (values.task.comments.length > 0) {
                getCommentsByIds(
                    values.task.comments,
                    values.currentUser.jwt
                ).then((res) =>
                    res.forEach((item) =>
                        setValues((prev) => ({
                            ...prev,
                            loading: { ...prev.loading, comments: false },
                            comments: [...prev.comments, item.data],
                        }))
                    )
                );
            } else {
                setValues((prev) => ({
                    ...prev,
                    loading: { ...prev.loading, comments: false },
                }));
            }
        }
    }, [location, values, setValues]);

    const getTime = (rawDate) => {
        const result = new Date(rawDate);
        return `${result.getDate()} thg ${result.getMonth() + 1}`;
    };

    const handleCommentChange = (event) => {
        setValues((prev) => ({
            ...prev,
            post: { ...prev.post, comment: event.target.value },
        }));
    };

    const handleCommentSubmit = () => {
        if (values.post.comment.length === 0) return;

        const data = {
            taskId: values.task.id,
            body: values.post.comment,
            createAt: new Date(),
            editAt: new Date(),
            username: values.currentUser.fullName,
            userId: values.currentUser.id,
        };

        addComment(values.currentUser.jwt, data).then((res) => {
            setValues((prev) => ({
                ...prev,
                task: {
                    ...prev.task,
                    comments: [...prev.task.comments, res.data.id],
                },
                comments: [...prev.comments, res.data],
                post: { ...prev.post, comment: "" },
            }));
        });
    };

    const onDeleteComment = (id) => {
        const comment = values.comments.find((comment) => comment.id === id);
        deleteComment(values.currentUser.jwt, comment, values.task.id).then(
            (res) =>
                setValues((prev) => ({
                    ...prev,
                    task: res.data,
                    comments: getUniqueValues(values.comments, comment),
                }))
        );
    };
    const onEditComment = (id) => {
        const comment = values.comments.find((comment) => comment.id === id);
        setValues((prev) => ({
            ...prev,
            post: {
                ...prev.post,
                comment: comment.body,
                oldComment: comment.body,
            },
            edit: { ...prev.edit, isEdit: true, id },
        }));
    };
    const onReportComment = () => {
        console.log("report clicked");
    };

    const onSaveClick = () => {
        const comment = values.comments.find(
            (comment) => comment.id === values.edit.id
        );
        comment.body = values.post.comment;
        editComment(values.currentUser.jwt, comment).then((res) => {
            const comments = values.comments.map((comment) => {
                if (comment.id === res.data.id) return res.data;
                return comment;
            });
            setValues((prev) => ({
                ...prev,
                comments,
                edit: { ...prev.edit, isEdit: false, id: null },
                post: { ...prev.post, comment: "", oldComment: "" },
            }));
        });
    };

    const onCancelClick = () => {
        setValues((prev) => ({
            ...prev,
            edit: { ...prev.edit, isEdit: false },
            post: { ...prev.post, comment: "", oldComment: "" },
        }));
    };

    return (
        <>
            {values.loading.comments ? (
                <CircularProgress />
            ) : (
                <>
                    <Container maxWidth="md" sx={{ mt: 2 }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-around"
                            sx={{
                                ":hover": {
                                    color: "#1976d2",
                                    cursor: "pointer",
                                },
                                height: 60,
                            }}
                            onClick={() =>
                                navigate(`/project/${values.project.id}`)
                            }
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    width: "60%",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {values.project.projectName}
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    width: "40%",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >{`(${values.teacher.fullName})`}</Typography>
                        </Stack>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            sx={{ mt: 2 }}
                        >
                            <Grid item md={1} alignItems="flex-end">
                                <Avatar sx={{ bgcolor: "#1976d2" }}>
                                    <AssignmentTurnedInOutlined />
                                </Avatar>
                            </Grid>
                            <Grid item md={11}>
                                <Typography variant="h4">
                                    {values.task.name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {`${values.createBy.fullName} - ${getTime(
                                        values.task.createAt
                                    )} (Đã chỉnh sửa ${getTime(
                                        values.task.editAt
                                    )})`}
                                </Typography>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h6">
                                        {values.task.status}
                                    </Typography>
                                    <Typography>
                                        Đến hạn {getTime(values.task.dueDate)}
                                    </Typography>
                                </Stack>
                                <Divider
                                    sx={{
                                        borderColor: "#1976d2",
                                        marginTop: "8px",
                                        marginBottom: "16px",
                                    }}
                                />
                                {values.task.contents
                                    .split("\n")
                                    .map((item, index) => (
                                        <span key={index}>
                                            {item} <br />
                                        </span>
                                    ))}
                                <Divider
                                    sx={{
                                        borderColor: "#1976d2",
                                        marginTop: "8px",
                                        marginBottom: "16px",
                                    }}
                                />
                                <div>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Nhật xét về nhiệm vụ
                                    </Typography>
                                    <Comments
                                        comments={values.comments}
                                        currentUser={values.currentUser.id}
                                        managerId={
                                            values.project.projectManager
                                        }
                                        onDeleteComment={onDeleteComment}
                                        onEditComment={onEditComment}
                                        onReportComment={onReportComment}
                                    />
                                </div>
                                <Input
                                    label="Thêm nhận xét"
                                    fullWidth
                                    value={values.post.comment}
                                    onChange={handleCommentChange}
                                    sx={{ padding: "4px" }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {values.edit.isEdit ? (
                                                <Stack direction="row">
                                                    <Button
                                                        disabled={
                                                            values.post.comment.localeCompare(
                                                                values.post
                                                                    .oldComment
                                                            )
                                                                ? false
                                                                : true
                                                        }
                                                        onClick={onSaveClick}
                                                    >
                                                        Lưu
                                                    </Button>
                                                    <Button
                                                        onClick={onCancelClick}
                                                    >
                                                        Hủy
                                                    </Button>
                                                </Stack>
                                            ) : (
                                                <Send
                                                    sx={{
                                                        ":hover": {
                                                            cursor: "pointer",
                                                        },
                                                    }}
                                                    onClick={
                                                        handleCommentSubmit
                                                    }
                                                />
                                            )}
                                        </InputAdornment>
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </>
            )}
        </>
    );
};

export default TaskDetail;
