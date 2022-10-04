import { AccountCircle, Assignment, Notifications } from "@mui/icons-material";
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Divider,
    Menu,
    MenuItem,
    Stack,
    styled,
    Toolbar,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, useAuthDispatch } from "../Context";
import { getNotificationByIds } from "../Services/fetchNotication";
import { useForm } from "../Services/useForm";

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
});

const Icons = styled(Box)(() => ({
    display: "flex",
    gap: "20px",
    alignItems: "center",
}));

const initialValues = {
    data: { notifications: [], currentUser: null },
    loading: { currentUser: true, notifications: true },
};

const MuiAppBar = () => {
    const { values, setValues } = useForm(initialValues);

    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

    const dispatch = useAuthDispatch();
    const navigate = useNavigate();

    const open = Boolean(anchorEl);
    const notificationOpen = Boolean(notificationAnchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        navigate("/login");
        logout(dispatch);
    };

    useEffect(() => {
        if (values.loading.currentUser) {
            setValues((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    currentUser: JSON.parse(
                        localStorage.getItem("currentUser")
                    ),
                },
                loading: { ...prev.loading, currentUser: false },
            }));
        } else if (values.loading.notifications) {
            if (values.data.currentUser.notifications.length > 0) {
                getNotificationByIds(
                    values.data.currentUser.notifications.slice(
                        Math.max(
                            values.data.currentUser.notifications.length - 4,
                            0
                        )
                    ),
                    values.data.currentUser.jwt
                ).then((res) => {
                    res.forEach((item) =>
                        setValues((prev) => ({
                            ...prev,
                            loading: { ...prev.loading, notifications: false },
                            data: {
                                ...prev.data,
                                notifications: [
                                    ...prev.data.notifications,
                                    item.data,
                                ],
                            },
                        }))
                    );
                });
            } else {
                setValues((prev) => ({
                    ...prev,
                    loading: { ...prev.loading, notifications: false },
                }));
            }
        }
    }, [values, setValues]);

    return (
        <>
            {!values.loading.notifications && (
                <AppBar position="sticky">
                    <StyledToolbar>
                        <Typography
                            variant="h6"
                            sx={{
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/")}
                        >
                            PROJECT MANAGEMENT
                        </Typography>
                        <Icons>
                            <Avatar
                                sx={{ bgcolor: "inherit", cursor: "pointer" }}
                                onClick={() => navigate("/projects")}
                            >
                                <Assignment sx={{ fontSize: 34 }} />
                            </Avatar>
                            {/* <span>DỰ ÁN</span> */}
                            <Badge
                                badgeContent={
                                    values.data.notifications.length
                                        ? values.data.notifications.length
                                        : "0"
                                }
                                color="error"
                                sx={{ cursor: "pointer" }}
                                onClick={(event) =>
                                    handleNotificationClick(event)
                                }
                            >
                                <Notifications sx={{ fontSize: 34 }} />
                            </Badge>
                            {/* <span>THÔNG BÁO</span> */}
                            <Avatar
                                sx={{ bgcolor: "inherit", cursor: "pointer" }}
                                id="account-avatar"
                                onClick={(event) => handleClick(event)}
                            >
                                <AccountCircle sx={{ fontSize: 34 }} />
                            </Avatar>
                            {/* <span>{values.data.currentUser.fullName}</span> */}
                        </Icons>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={() => setAnchorEl(null)}
                            MenuListProps={{
                                "aria-labelledby": "account-avatar",
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    navigate("/profile");
                                }}
                            >
                                Thông tin cá nhân
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    handleLogout();
                                }}
                            >
                                Đăng xuất
                            </MenuItem>
                        </Menu>
                        <Menu
                            anchorEl={notificationAnchorEl}
                            open={notificationOpen}
                            onClose={() => setNotificationAnchorEl(null)}
                        >
                            {values.data.notifications.map((notification) => (
                                <Stack
                                    key={notification.id}
                                    sx={{ width: 320, padding: "8px 20px" }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "1.1rem",
                                            fontWeight: 550,
                                        }}
                                    >
                                        {notification.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ fontSize: "0.8rem" }}
                                    >
                                        {notification.content}
                                    </Typography>
                                    <Divider />
                                </Stack>
                            ))}
                        </Menu>
                    </StyledToolbar>
                </AppBar>
            )}
        </>
    );
};

export default MuiAppBar;
