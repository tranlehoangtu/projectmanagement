import { PersonAdd } from "@mui/icons-material";
import {
    Avatar,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Controls from "../../Control/Controls";
import {
    getProjectById,
    updateMembersToProject,
    upgradeProject,
} from "../../Services/fetchProject";
import { getUsersByIds, getUsersByUsername } from "../../Services/fetchUser";
import { useForm } from "../../Services/useForm";
import Customs from "../../Styled/Customs";

const teamTableHeaders = [
    {
        id: "username",
        numeric: false,
        disablePadding: true,
        label: "TÊN NGƯỜI DÙNG",
    },
    {
        id: "fullName",
        numeric: false,
        disablePadding: true,
        label: "HỌ TÊN",
    },
    {
        id: "studentRole",
        numeric: false,
        disablePadding: true,
        label: "VAI TRÒ",
    },
];
const teamTableBodies = ["username", "fullName", "studentRole"];

const initialValues = {
    project: null,
    currentUser: null,
    loading: {
        project: true,
        members: true,
        anythingLeft: true,
        currentUser: true,
    },
    datas: { members: [] },
    search: { student: "", students: [], member: "", members: [] },
    modal: { member: false },
    info: {
        status: false,
        message: "",
        severity: "",
    },
    permission: { edit: false, promo: false },
};

const getProjectId = (locationId) => {
    const indexOfFirst = locationId.indexOf("/");
    const indexOfSecond = locationId.indexOf("/", indexOfFirst + 1);
    const indexOfThird = locationId.indexOf("/", indexOfSecond + 1);

    return locationId.substring(indexOfSecond + 1, indexOfThird);
};

const Members = () => {
    const navigate = useNavigate();
    const { values, setValues } = useForm(initialValues);
    const location = useLocation();

    useEffect(() => {
        if (values.loading.currentUser) {
            setValues((prev) => ({
                ...prev,
                loading: { ...prev.loading, currentUser: false },
                currentUser: JSON.parse(localStorage.getItem("currentUser")),
            }));
        } else if (values.loading.project) {
            getProjectById(
                getProjectId(location.pathname),
                values.currentUser.jwt
            ).then((res) =>
                setValues((prev) => ({
                    ...prev,
                    project: res.data,
                    loading: { ...prev.loading, project: false },
                }))
            );
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
                    students: prev.datas.members,
                },
                loading: {
                    ...prev.loading,
                    anythingLeft: false,
                },
                permission: {
                    edit:
                        values.currentUser.id === values.project.leader ||
                        values.currentUser.id === values.project.projectManager,
                    promo:
                        values.currentUser.id === values.project.projectManager,
                },
            }));
        }
    }, [location, values, setValues]);

    const handleSearchMemberChange = (event) => {
        setValues((prev) => {
            return {
                ...prev,
                search: {
                    ...prev.search,
                    student: event.target.value,
                    students: prev.datas.members.filter((member) =>
                        member.username
                            .toLowerCase()
                            .includes(event.target.value.toLowerCase())
                    ),
                },
            };
        });
    };

    const convertTeamValues = (members, leader) => {
        return members.map((member) => ({
            ...member,
            username: member.username.toUpperCase(),
            fullName: (
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ padding: "4px" }}
                >
                    <Avatar sx={{ marginRight: "8px", bgcolor: "violet" }}>
                        {member.fullName.charAt(0)}
                    </Avatar>
                    <span>{member.fullName}</span>
                </Stack>
            ),
            studentRole: member.id === leader ? "Leader" : "Member",
        }));
    };

    const handleTeamDelete = (selected) => {
        if (
            values.currentUser.id === values.project.leader ||
            values.currentUser.id === values.project.projectManager
        ) {
            const list = values.datas.members.filter(
                (member) => !selected.includes(member.id)
            );

            const ids = list.map((item) => item.id);

            updateMembersToProject(
                values.project.id,
                selected,
                values.currentUser.jwt,
                "remove"
            ).then((res) => {
                const projects = values.currentUser.projects.filter(
                    (project) => !(project === values.project.id)
                );
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify({ ...values.currentUser, projects })
                );
                setValues((prev) => ({
                    ...prev,
                    datas: {
                        ...prev.datas,
                        members: list,
                    },
                    modal: { ...prev.modal, member: false },
                    search: {
                        ...prev.search,
                        member: "",
                        members: [],
                        students: list,
                    },
                    project: { ...prev.project, members: ids },
                    info: {
                        ...prev.info,
                        status: true,
                        message: "Xóa thành công",
                        severity: "error",
                    },
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

    const handleTeamModalClose = () => {
        setValues((prev) => ({
            ...prev,
            modal: { ...prev.modal, member: false },
            post: { ...prev.post, moreMember: [] },
            search: { ...prev.search, member: "", members: [] },
        }));
    };

    const handleSearchChange = (e) => {
        setValues((prev) => ({
            ...prev,
            search: { ...prev.search, member: e.target.value },
        }));
    };

    const handleRemoveClick = () => {
        setValues((prev) => ({
            ...prev,
            search: { ...prev.search, member: "" },
        }));
    };

    const handleButtonSubmit = (e) => {
        e.preventDefault();
        getUsersByUsername(values.search.member, values.currentUser.jwt).then(
            (res) =>
                setValues((prev) => ({
                    ...prev,
                    search: { ...prev.search, members: res.data },
                }))
        );
    };

    const handleMemberRemoveClick = () => {
        setValues((prev) => {
            return {
                ...prev,
                search: {
                    ...prev.search,
                    student: "",
                    students: prev.datas.members,
                },
            };
        });
    };

    const handleMemberAdd = (id, fullName) => {
        if (values.datas.members.find((member) => member.id === id)) {
            setValues((prev) => ({
                ...prev,
                info: {
                    ...prev.info,
                    status: true,
                    message: "Thành viên đã có trong dự án",
                    severity: "warning",
                },
            }));
        } else {
            updateMembersToProject(
                values.project.id,
                [id],
                values.currentUser.jwt,
                "add"
            ).then((res) => {
                setValues((prev) => ({
                    ...prev,
                    datas: {
                        ...prev.datas,
                        members: [...prev.datas.members, res.data],
                    },
                    modal: { ...prev.modal, member: false },
                    search: {
                        ...prev.search,
                        member: "",
                        members: [],
                        students: [...prev.datas.members, res.data],
                    },
                    info: {
                        ...prev.info,
                        status: true,
                        message: "Thêm thành công",
                        severity: "info",
                    },
                }));
            });
        }
    };
    const handlePromoClick = (selected) => {
        if (values.currentUser.id === values.project.projectManager) {
            if (selected.length > 1) {
                setValues((prev) => ({
                    ...prev,
                    info: {
                        ...prev.info,
                        status: true,
                        message: "Chỉ được chọn 1 thành viên làm trưởng nhóm",
                        severity: "warning",
                    },
                }));
            } else {
                const project = {
                    id: values.project.id,
                    leader: selected[0],
                };

                upgradeProject(values.currentUser.jwt, project).then((res) =>
                    setValues((prev) => ({
                        ...prev,
                        project: res.data,
                    }))
                );
            }
        } else {
            setValues((prev) => ({
                ...prev,
                info: {
                    ...prev.info,
                    status: true,
                    message:
                        "Chỉ có quản lý dự án được thực hiện công việc này",
                    severity: "warning",
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
                                    `/project/${values.project.id}/members`
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
                                    sx={{ padding: 2 }}
                                    onClick={() =>
                                        setValues((prev) => ({
                                            ...prev,
                                            modal: {
                                                ...prev.modal,
                                                member: true,
                                            },
                                        }))
                                    }
                                >
                                    Thêm thành viên
                                </Customs.Button>
                            ) : (
                                <span></span>
                            )}
                            <Stack sx={{ width: "40ch" }}>
                                <Controls.SearchBar
                                    values={values.search.student}
                                    onChange={handleSearchMemberChange}
                                    onRemoveClick={handleMemberRemoveClick}
                                    label="Tìm theo tên người dùng"
                                />
                            </Stack>
                        </Stack>
                        <Customs.EnhancedTable
                            values={convertTeamValues(
                                values.search.students,
                                values.project.leader
                            )}
                            tableHeaders={teamTableHeaders}
                            tableBodies={teamTableBodies}
                            handleDelete={handleTeamDelete}
                            label="Thành viên"
                            handlePromoClick={handlePromoClick}
                            permission={values.permission}
                        />
                    </Stack>
                    <Customs.Modal
                        open={values.modal.member}
                        onClose={handleTeamModalClose}
                        other={{ width: "320px" }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h5"
                            component="h2"
                            sx={{ mb: 2 }}
                            align="center"
                        >
                            Thêm thành viên
                        </Typography>
                        <Controls.SearchBar
                            values={values.search.member}
                            onChange={handleSearchChange}
                            onRemoveClick={handleRemoveClick}
                            label="Tìm theo tên người dùng"
                            fullWidth={true}
                        />
                        <Paper
                            sx={{
                                height: "240px",
                                overflow: "auto",
                                mt: 2,
                            }}
                            variant="outlined"
                            square
                        >
                            {values.search.members.length > 0 ? (
                                values.search.members.map((mem) => (
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        sx={{
                                            padding: "16px 32px",
                                            cursor: "pointer",
                                            ":hover": {
                                                bgcolor: "rgba(10,10,10,.04)",
                                            },
                                        }}
                                        key={mem.id}
                                        onClick={() =>
                                            handleMemberAdd(
                                                mem.id,
                                                mem.fullName
                                            )
                                        }
                                    >
                                        <Stack direction="row" gap={2}>
                                            <Avatar sx={{ bgcolor: "red" }}>
                                                {mem.fullName.charAt(0)}
                                            </Avatar>
                                            <Stack direction="column">
                                                <span>{mem.fullName}</span>
                                                <span>{mem.username}</span>
                                            </Stack>
                                        </Stack>
                                        <PersonAdd />
                                    </Stack>
                                ))
                            ) : (
                                <Typography align="center" variant="h6">
                                    {"Không có sinh viên tương ứng".toUpperCase()}
                                </Typography>
                            )}
                        </Paper>
                        <Customs.Button
                            fullWidth
                            variant="contained"
                            onClick={handleButtonSubmit}
                            sx={{ mt: 2 }}
                        >
                            Tìm
                        </Customs.Button>
                    </Customs.Modal>
                    <Customs.CustomizedSnackbars
                        message={values.info.message}
                        open={values.info.status}
                        handleClose={handleInfoClose}
                        severity={values.info.severity}
                    />
                </>
            )}
        </>
    );
};

export default Members;
