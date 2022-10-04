import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorOutline, LockOutlined } from "@mui/icons-material";
import {
    Avatar,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { useForm, Form } from "../../Services/useForm";
import Controls from "../../Control/Controls";
import { adminLogin } from "../../Services/adminService";

const initialValues = {
    username: "",
    password: "",
    rememberMe: false,
    message: "",
};

const avatarStyle = {
    backgroundColor: "#1976d2",
    marginBottom: "10px",
};

const AdminLogin = () => {
    const navigate = useNavigate();

    const { values, setValues, handleInputChange } = useForm(initialValues);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let payload = { username: values.username, password: values.password };

        try {
            adminLogin(payload).then((res) => {
                localStorage.setItem("currentUser", JSON.stringify(res.data));
                navigate("/admin");
            });
        } catch (error) {
            setValues((prev) => ({
                ...prev,
                message: "Tài khoản hoặc mật khẩu không đúng",
            }));
            console.log(error);
        }
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
                        <Avatar style={avatarStyle}>
                            <LockOutlined />
                        </Avatar>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Đăng nhập
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
                        <Controls.Input
                            variant="standard"
                            label="Username"
                            name="username"
                            type="text"
                            value={values.username}
                            onChange={handleInputChange}
                            required={true}
                            fullWidth
                            style={{ mb: 2 }}
                        />

                        <Controls.Input
                            variant="standard"
                            label="Password"
                            name="password"
                            type="password"
                            value={values.password}
                            required={true}
                            fullWidth
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <FormControl>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Remember Me"
                            onChange={(e) => {
                                setValues({
                                    ...values,
                                    rememberMe: !values.rememberMe,
                                });
                            }}
                        />
                    </FormControl>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Đăng nhập
                    </Button>
                    <Typography align="center" sx={{ mt: 2 }}>
                        Chưa có tài khoản ?{" "}
                        <Link to="/admin/register">Đăng ký</Link>
                    </Typography>
                </Form>
            </Paper>
        </Grid>
    );
};

export default AdminLogin;
