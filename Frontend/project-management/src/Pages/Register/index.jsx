import { ErrorOutline, Lock } from "@mui/icons-material";
import {
    Avatar,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "../../Control/Form";
import { register } from "../../Services/fetchUser";
import { useForm } from "../../Services/useForm";

const initialValues = {
    data: { username: "", password: "", repassword: "", position: "teacher" },
    message: null,
};

const Register = () => {
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
            position: values.data.position,
        };

        register(payload).then((res) => {
            if (res.data.isSuccess === false) {
                setValues((prev) => ({
                    ...prev,
                    message: res.data.message,
                }));
            } else if (res.data.isSuccess) {
                navigate("/login");
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
                            ????ng k?? t??i kho???n
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
                            label="T??n ng?????i d??ng"
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
                            label="M???t kh???u"
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
                            label="Nh???p l???i m???t kh???u"
                            name="repassword"
                            type="password"
                            value={values.data.repassword}
                            required={true}
                            fullWidth
                            onChange={handleInputChanges}
                        />
                    </Grid>
                    <FormControl>
                        <FormLabel>B???n l??</FormLabel>
                    </FormControl>
                    <RadioGroup
                        values={values.data.position}
                        onChange={handleInputChanges}
                        name="position"
                    >
                        <FormControlLabel
                            value="teacher"
                            control={<Radio />}
                            label="Gi??o vi??n"
                        />
                        <FormControlLabel
                            value="student"
                            control={<Radio />}
                            label="H???c sinh"
                        />
                    </RadioGroup>
                    <Button
                        variant="contained"
                        onClick={handleRegisterClick}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        ????ng k??
                    </Button>
                    <Typography align="center" sx={{ mt: 2 }}>
                        ???? t??i kho???n ? <Link to="/login">????ng nh???p</Link>
                    </Typography>
                </Form>
            </Paper>
        </Grid>
    );
};

export default Register;
