import { ErrorOutline, Lock } from "@mui/icons-material";
import {
    Avatar,
    Button,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "../../Control/Form";
import { adminRegister } from "../../Services/adminService";
import { useForm } from "../../Services/useForm";

const initialValues = {
    data: { username: "", password: "", repassword: "", position: "teacher" },
    message: null,
};

const AdminRegister = () => {
    const { values, setValues } = useForm(initialValues);
    const navigate = useNavigate();

    const handleInputChanges = (event) => {
        const { value, name } = event.target;

        setValues((prev) => ({
            ...prev,
            data: { ...prev.data, [name]: value },
        }));
    };

    const handleRegisterClick = async (event) => {
        event.preventDefault();
        let payload = {
            username: values.data.username,
            password: values.data.password,
            repassword: values.data.repassword,
            position: "admin",
        };

        adminRegister(payload).then((res) => {
            if (res.data.isSuccess) {
                navigate("/admin/login");
            } else {
                setValues((prev) => ({
                    ...prev,
                    message: res.data.message,
                }));
            }
        });
    };

    return (
        <Grid>
            <Paper
                elevation={10}
                sx={{
                    padding: "30px 40px",
                    minHeight: 500,
                    width: 280,
                    margin: "40px auto",
                }}
            >
                <Form>
                    <Grid align="center">
                        <Avatar sx={{ bgcolor: "#1976d2", mb: 2 }}>
                            <Lock />
                        </Avatar>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Đăng ký tài khoản
                        </Typography>
                        {values.message && (
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={1}
                                sx={{
                                    mb: 2,
                                    bgcolor: "#fdeded",
                                    padding: "6px 8px",
                                }}
                            >
                                <ErrorOutline sx={{ color: "#ef5350" }} />
                                <Typography variant="caption">
                                    {values.message}
                                </Typography>
                            </Stack>
                        )}
                        <TextField
                            sx={{ mb: 2 }}
                            variant="standard"
                            label="Tên người dùng"
                            name="username"
                            type="text"
                            value={values.data.username}
                            onChange={handleInputChanges}
                            required={true}
                            fullWidth
                            style={{ mb: 2 }}
                        />

                        <TextField
                            sx={{ mb: 2 }}
                            variant="standard"
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            value={values.data.password}
                            required={true}
                            fullWidth
                            onChange={handleInputChanges}
                        />
                        <TextField
                            sx={{ mb: 2 }}
                            variant="standard"
                            label="Nhập lại mật khẩu"
                            name="repassword"
                            type="password"
                            value={values.data.repassword}
                            required={true}
                            fullWidth
                            onChange={handleInputChanges}
                        />
                    </Grid>
                    <Button
                        variant="contained"
                        onClick={handleRegisterClick}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Đăng ký
                    </Button>
                    <Typography align="center" sx={{ mt: 2 }}>
                        Đã tài khoản ? <Link to="/admin/login">Đăng nhập</Link>
                    </Typography>
                </Form>
            </Paper>
        </Grid>
    );
};

export default AdminRegister;
