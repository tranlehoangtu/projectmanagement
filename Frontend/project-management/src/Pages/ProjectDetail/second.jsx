import { Avatar, CircularProgress, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "../../Services/useForm";
import {
    removeStudentFromProject,
    updateProject,
} from "../../Services/getProjectData";

import { useLocation, useNavigate } from "react-router-dom";
import Customs from "../../Styled/Customs";
import { Stack } from "@mui/system";
import Controls from "../../Control/Controls";
import {
    addMembersToProject,
    getProjectById,
} from "../../Services/fetchProject";
import { useContext } from "react";
import {
    deleteTasks,
    getTasksByIds,
    insertTask,
} from "../../Services/fetchTask";
import { getAllStudent, getStudentsByIds } from "../../Services/fetchStudent";

//variable
const taskTableHeaders = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Task",
    },
    {
        id: "members",
        numeric: false,
        disablePadding: true,
        label: "Responsible",
    },
    {
        id: "timespan",
        numeric: false,
        disablePadding: true,
        label: "Time Span",
    },
    {
        id: "dueDate",
        numeric: false,
        disablePadding: true,
        label: "Due Date",
    },
    {
        id: "status",
        numeric: false,
        disablePadding: true,
        label: "Status",
    },
];

const taskTableBodies = ["name", "members", "timespan", "dueDate", "status"];

const teamTableHeaders = [
    {
        id: "studentId",
        numeric: false,
        disablePadding: true,
        label: "Student ID",
    },
    {
        id: "studentName",
        numeric: false,
        disablePadding: true,
        label: "Name",
    },
    {
        id: "studentGrade",
        numeric: false,
        disablePadding: true,
        label: "Grade",
    },
    {
        id: "studentClass",
        numeric: false,
        disablePadding: true,
        label: "Class",
    },
    {
        id: "studentRole",
        numeric: false,
        disablePadding: true,
        label: "Role",
    },
];
const teamTableBodies = [
    "studentId",
    "studentName",
    "studentGrade",
    "studentClass",
    "studentRole",
];

const initialValues = {
    project: null,
    datas: { tasks: [], members: [], leftOverStudents: [] },
    modal: { task: false, member: false },
    tab: { tab: 0, tabLabels: [] },
    loading: {
        project: true,
        tasks: true,
        members: true,
        leftOverStudents: true,
        anythingLeft: true,
    },
    post: {
        taskName: "",
        start: null,
        end: null,
        taskMember: [],
        moreMember: [],
    },
    search: { task: "", tasks: [], student: "", students: [] },
};

// function
// all
const findStudentByID = (students, id) => {
    return students.find((student) => student.id === id);
};

const convertToName = (values) => {
    return values.map((member) => ({
        id: member.id,
        name: member.studentName,
    }));
};

// function - task
const convertTaskValues = (tasks, members) => {
    return tasks.map((task) => ({
        ...task,
        members: (
            <>
                {task.members.map((member) => (
                    <Stack
                        key={member}
                        direction="row"
                        alignItems="center"
                        sx={{ padding: "4px" }}
                    >
                        <Avatar sx={{ marginRight: "8px", bgcolor: "violet" }}>
                            {findStudentByID(
                                members,
                                member
                            ).studentName.charAt(0)}
                        </Avatar>
                        <span>
                            {findStudentByID(members, member).studentName}
                        </span>
                    </Stack>
                ))}
            </>
        ),
    }));
};

// function - team
const convertTeamValues = (members, leader) => {
    return members.map((member) => ({
        ...member,
        studentId: member.studentId.toUpperCase(),
        studentName: (
            <Stack direction="row" alignItems="center" sx={{ padding: "4px" }}>
                <Avatar sx={{ marginRight: "8px", bgcolor: "violet" }}>
                    {member.studentName.charAt(0)}
                </Avatar>
                <span>{member.studentName}</span>
            </Stack>
        ),
        studentGrade: member.studentGrade.toUpperCase(),
        studentRole: member.id === leader ? "Leader" : "Member",
    }));
};

////

const ProjectDetail = () => {
    // spot
    const { values, setValues } = useForm(initialValues);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const location = useLocation();
    const navigate = useNavigate();

    console.log(values);
    useEffect(() => {
        if (values.loading.project) {
            getProjectById(
                location.pathname.substring(
                    location.pathname.lastIndexOf("/") + 1,
                    location.pathname.length
                ),
                currentUser.jwt
            ).then((res) =>
                setValues((prev) => ({
                    ...prev,
                    project: res.data,
                    loading: { ...prev.loading, project: false },
                }))
            );
        }
        // else if (values.loading.tasks) {
        //     getTasksByIds(values.project.tasks, currentUser.user.jwtToken).then(
        //         (res) =>
        //             setValues((prev) => ({
        //                 ...prev,
        //                 datas: {
        //                     ...prev.datas,
        //                     tasks: res.data,
        //                 },
        //                 loading: { ...prev.loading, tasks: false },
        //             }))
        //     );
        // }
        // else if (values.loading.members) {
        //     getStudentsByIds(
        //         values.project.members,
        //         currentUser.user.jwtToken
        //     ).then((res) =>
        //         setValues((prev) => ({
        //             ...prev,
        //             datas: {
        //                 ...prev.datas,
        //                 members: res.data,
        //             },
        //             loading: { ...prev.loading, members: false },
        //         }))
        //     );
        // } else if (values.loading.leftOverStudents) {
        //     getAllStudent(currentUser.user.jwtToken).then((res) => {
        //         const temp = [];
        //         res.data.forEach((student) => {
        //             var isValid = true;
        //             values.project.members.forEach((member) => {
        //                 if (student.id === member) isValid = false;
        //             });

        //             if (isValid) temp.push(student);
        //         });
        //         setValues((prev) => ({
        //             ...prev,
        //             datas: {
        //                 ...prev.datas,
        //                 leftOverStudents: temp,
        //             },
        //             loading: {
        //                 ...prev.loading,
        //                 leftOverStudents: false,
        //             },
        //         }));
        //     });
        // } else if (values.loading.anythingLeft) {
        //     setValues((prev) => ({
        //         ...prev,
        //         search: {
        //             ...prev.search,
        //             tasks: prev.datas.tasks,
        //             students: prev.datas.members,
        //         },
        //         loading: {
        //             ...prev.loading,
        //             anythingLeft: false,
        //         },
        //         tab: {
        //             ...prev.tab,
        //             tabLabels: [
        //                 { id: 1, name: prev.project.projectName },
        //                 { id: 2, name: "TEAM MEMBERS" },
        //             ],
        //         },
        //     }));
        // }
    }, [currentUser, location, values, setValues]);

    // Search
    // search - task

    const handleTaskClick = (id) => {
        navigate(`${id}`);
        // console.log(id);
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

        const days =
            (post.end.getTime() - post.start.getTime()) / (1000 * 3600 * 24);

        const postValues = {
            name: post.taskName,
            contents: "Đây là Nội dung",
            members: [...post.taskMember],
            timespan: days === 1 ? `${days} day` : `${days} days`,
            dueDate: post.end,
            status: "Hoàn Thành",
            projectId: project.id,
            createBy: currentUser.student.id,
            createAt: new Date(),
            editAt: new Date(),
        };

        insertTask(postValues, currentUser.user.jwtToken).then((res) => {
            console.log(res.data);
            removeAllVariable();
        });
    };

    handleTaskClick;

    // search - team
    const handleSearchMemberChange = (event) => {
        setValues((prev) => {
            return {
                ...prev,
                search: {
                    ...prev.search,
                    student: event.target.value,
                    students: prev.datas.members.filter((member) =>
                        member.studentId
                            .toLowerCase()
                            .includes(event.target.value.toLowerCase())
                    ),
                },
            };
        });
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

    const handleInputChanges = (event) => {
        const { name, value } = event.target;

        setValues({
            ...values,
            post: { ...values.post, [name]: value },
        });
    };

    const handleTabClick = (nValue) => {
        setValues((prev) => ({
            ...prev,
            tab: { ...prev.tab, tab: nValue },
        }));
    };

    const handleTeamModalClose = () => {
        setValues((prev) => ({
            ...prev,
            modal: { ...prev.modal, member: false },
            post: { ...prev.post, moreMember: [] },
        }));
    };

    const handleTeamMenuItemClick = (id) => {
        if (values.post.moreMember.length === 0)
            setValues({
                ...values,
                post: {
                    ...values.post,
                    moreMember: [...values.post.moreMember, id],
                },
            });
        else {
            var valid = true;
            values.post.moreMember.forEach((item) => {
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
                        moreMember: [...values.post.moreMember, id],
                    },
                });
            } else {
                const index = values.post.moreMember.indexOf(id);
                values.post.moreMember.splice(index, 1);
                setValues({
                    ...values,
                    post: {
                        ...values.post,
                        moreMember: [...values.post.moreMember],
                    },
                });
            }
        }
    };

    const handleTeamSubmit = () => {
        const { post, project } = values;

        addMembersToProject(
            project.id,
            post.moreMember,
            currentUser.user.jwtToken
        ).then((res) => console.log(res));

        // updateProject(project.id, {
        //     members: [...project.members, ...post.moreMember],
        // }).then((res) => {
        //     console.log(res.data);
        //     removeAllVariable();
        // });
    };

    const handleTeamDelete = (selected) => {
        removeStudentFromProject(values.project.id, {
            members: [...selected],
        }).then((res) => {
            console.log(res.data);
            removeAllVariable();
        });
    };

    const removeAllVariable = () => {
        setValues(() => ({
            project: null,
            datas: { tasks: [], members: [], leftOverStudents: [] },
            modal: { task: false, member: false },
            tab: { ...values.tab, tabLabels: [] },
            loading: {
                project: true,
                tasks: true,
                members: true,
                leftOverStudents: true,
                anythingLeft: true,
            },
            post: {
                taskName: "",
                start: null,
                end: null,
                taskMember: [],
                moreMember: [],
            },
            search: { task: "", tasks: [], student: "", students: [] },
        }));
    };
    return (
        <>
            {values.loading.anythingLeft ? (
                <CircularProgress />
            ) : (
                <Container sx={{ mt: 2, minHeight: "100vh" }}>
                    <Customs.MuiTabs
                        tab={values.tab.tab}
                        name="tab"
                        handleInputChange={handleTabClick}
                        tabLabels={values.tab.tabLabels}
                        tabValues={[
                            {
                                id: 1,
                                value: (
                                    <>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Customs.Button
                                                variant="outlined"
                                                size="large"
                                                sx={{ mb: 2 }}
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
                                                Add a task
                                            </Customs.Button>
                                            <Controls.SearchBar
                                                values={values.search.task}
                                                onChange={
                                                    handleSearchTaskChange
                                                }
                                                onRemoveClick={
                                                    handleTaskRemoveClick
                                                }
                                                label="Search by Taskname"
                                            />
                                        </Stack>
                                        <Customs.EnhancedTable
                                            values={convertTaskValues(
                                                values.search.tasks,
                                                values.datas.members
                                            )}
                                            tableHeaders={taskTableHeaders}
                                            tableBodies={taskTableBodies}
                                            handleDelete={handleTaskDelete}
                                            label="Tasks"
                                            onItemClick={handleTaskClick}
                                        />
                                    </>
                                ),
                            },
                            {
                                id: 2,
                                value: (
                                    <>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Customs.Button
                                                variant="outlined"
                                                size="large"
                                                sx={{ mb: 2 }}
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
                                                Add a Member
                                            </Customs.Button>
                                            <Controls.SearchBar
                                                values={values.search.student}
                                                onChange={
                                                    handleSearchMemberChange
                                                }
                                                onRemoveClick={
                                                    handleMemberRemoveClick
                                                }
                                                label="Search by studentId"
                                            />
                                        </Stack>
                                        <Customs.EnhancedTable
                                            values={convertTeamValues(
                                                values.search.students,
                                                values.project.leader
                                            )}
                                            tableHeaders={teamTableHeaders}
                                            tableBodies={teamTableBodies}
                                            handleDelete={handleTeamDelete}
                                            label="Members"
                                            onItemClick={handleTaskClick}
                                        />
                                    </>
                                ),
                            },
                        ]}
                    ></Customs.MuiTabs>
                    <Customs.Modal
                        open={values.modal.task}
                        onClose={handleTaskModalClose}
                    >
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                            Create Your Task Here
                        </Typography>
                        <Controls.Input
                            label="Task Name"
                            name="taskName"
                            value={values.post.taskName}
                            onChange={handleInputChanges}
                            fullWidth
                            autoComplete="off"
                            required
                        />
                        <Controls.MultipleSelect
                            values={convertToName(values.datas.members)}
                            setValues={setValues}
                            label="Students"
                            handleMenuItemClick={handleTaskMenuItemClick}
                        />
                        <Stack direction="row" spacing={2}>
                            <Controls.MuiDatePicker
                                label="Start"
                                value={values.post.start}
                                name="start"
                                onChange={handleInputChanges}
                            />
                            <Controls.MuiDatePicker
                                label="End"
                                value={values.post.end}
                                name="end"
                                onChange={handleInputChanges}
                            />
                        </Stack>
                        <Customs.Button
                            fullWidth
                            variant="contained"
                            onClick={handleTaskSubmit}
                        >
                            Submit
                        </Customs.Button>
                    </Customs.Modal>
                    <Customs.Modal
                        open={values.modal.member}
                        onClose={handleTeamModalClose}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h5"
                            component="h2"
                            sx={{ mb: 2 }}
                        >
                            Add more Member Here
                        </Typography>
                        <Controls.MultipleSelect
                            values={convertToName(
                                values.datas.leftOverStudents
                            )}
                            setValues={setValues}
                            label="Responsible"
                            handleMenuItemClick={handleTeamMenuItemClick}
                        />
                        <Customs.Button
                            fullWidth
                            variant="contained"
                            onClick={handleTeamSubmit}
                        >
                            Submit
                        </Customs.Button>
                    </Customs.Modal>
                </Container>
            )}
        </>
    );

    return <>Hello World</>;
};

export default ProjectDetail;
