import styled from "@emotion/styled";
import { Person4 } from "@mui/icons-material";
import {
    Avatar,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect } from "react";
import { update } from "../../Services/fetchUser";
import { Form, useForm } from "../../Services/useForm";
import Customs from "../../Styled/Customs";

const StyledTextField = styled(TextField)({
    marginBottom: "16px",
});

const initialValues = {
    currentUser: null,
    loading: { currentUser: true, data: true },
    data: {
        fullName: "",
        phoneNumber: "",
        address: "",
        email: "",
        school: "",
        gender: "",
    },
    info: { message: "", status: false, severity: "" },
};

const Profile = () => {
    const { values, setValues } = useForm(initialValues);

    useEffect(() => {
        if (values.loading.currentUser) {
            setValues((prev) => ({
                ...prev,
                currentUser: JSON.parse(localStorage.getItem("currentUser")),
                loading: { ...prev.loading, currentUser: false },
            }));
        } else if (values.loading.data) {
            const item = values.currentUser;

            setValues((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    fullName: item.fullName ? item.fullName : "",
                    phoneNumber: item.phoneNumber ? item.phoneNumber : "",
                    address: item.address ? item.address : "",
                    email: item.email ? item.email : "",
                    school: item.school ? item.school : "",
                    gender: item.gender ? item.gender : "Nữ",
                },
                loading: { ...prev.loading, data: false },
            }));
        }
    }, [values, setValues]);

    const handleInputChanges = (event) => {
        const { name, value } = event.target;

        setValues((prev) => ({
            ...prev,
            data: { ...prev.data, [name]: value },
        }));
    };

    const hanleSaveClick = (e) => {
        update({ ...values.data, username: values.currentUser.username }).then(
            (res) => {
                const nUser = { ...res.data, jwt: values.currentUser.jwt };
                localStorage.setItem("currentUser", JSON.stringify(nUser));
                setValues((prev) => ({
                    ...prev,
                    currentUser: res.data,
                    data: {
                        ...prev.data,
                        fullName: res.data.fullName ? res.data.fullName : "",
                        phoneNumber: res.data.phoneNumber
                            ? res.data.phoneNumber
                            : "",
                        address: res.data.address ? res.data.address : "",
                        email: res.data.email ? res.data.email : "",
                        school: res.data.school ? res.data.school : "",
                        gender: res.data.gender ? res.data.gender : "Nữ",
                    },
                    info: {
                        message: "Lưu thành công",
                        severity: "info",
                        status: true,
                    },
                }));
            }
        );
    };

    const handleInfoClose = () => {
        setValues((prev) => ({
            ...prev,
            info: { ...prev.info, status: false },
        }));
    };

    return (
        <>
            {values.loading.data ? (
                <CircularProgress />
            ) : (
                <Container maxWidth="lg">
                    <Paper elevation={2}>
                        <Form>
                            <Stack direction="row" sx={{ mt: "20px" }}>
                                <Stack
                                    alignItems="center"
                                    sx={{
                                        width: "35%",
                                        borderRight: "1px solid grey",
                                    }}
                                >
                                    <Stack
                                        alignItems="center"
                                        sx={{
                                            margin: "auto 0 ",
                                            transform: "translatey(-80px)",
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                mb: 1,
                                            }}
                                        >
                                            <Person4
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    bgcolor: "#1976d2",
                                                }}
                                            />
                                        </Avatar>
                                        <Typography variant="h6" align="center">
                                            {values.currentUser.username.toUpperCase()}
                                        </Typography>
                                        {values.currentUser.fullName && (
                                            <Typography
                                                variant="h4"
                                                align="center"
                                            >
                                                {values.currentUser.fullName}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Stack>
                                <Stack
                                    sx={{
                                        width: "65%",
                                        padding: "16px 22px",
                                    }}
                                >
                                    <Typography variant="h4" sx={{ mb: 2 }}>
                                        Hồ sơ của bạn
                                    </Typography>
                                    <StyledTextField
                                        label="Họ tên"
                                        name="fullName"
                                        variant="outlined"
                                        value={values.data.fullName}
                                        onChange={handleInputChanges}
                                    />
                                    <StyledTextField
                                        label="Số điện thoại"
                                        name="phoneNumber"
                                        variant="outlined"
                                        value={values.data.phoneNumber}
                                        onChange={handleInputChanges}
                                    />
                                    <StyledTextField
                                        label="Địa chỉ"
                                        name="address"
                                        variant="outlined"
                                        value={values.data.address}
                                        onChange={handleInputChanges}
                                    />
                                    <StyledTextField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        variant="outlined"
                                        value={values.data.email}
                                        onChange={handleInputChanges}
                                    />
                                    <StyledTextField
                                        label="Trường"
                                        name="school"
                                        variant="outlined"
                                        value={values.data.school}
                                        onChange={handleInputChanges}
                                    />
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">
                                            Giới tính
                                        </FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            name="gender"
                                            values={values.data.gender}
                                            onChange={handleInputChanges}
                                            sx={{ mb: 2 }}
                                        >
                                            <Stack direction="row">
                                                <FormControlLabel
                                                    value="female"
                                                    control={<Radio />}
                                                    label="Nữ"
                                                    checked={
                                                        values.data.gender ===
                                                        "female"
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                <FormControlLabel
                                                    value="male"
                                                    control={<Radio />}
                                                    label="Nam"
                                                    checked={
                                                        values.data.gender ===
                                                        "male"
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                <FormControlLabel
                                                    value="other"
                                                    control={<Radio />}
                                                    label="Khác"
                                                    checked={
                                                        values.data.gender ===
                                                        "other"
                                                            ? true
                                                            : false
                                                    }
                                                />
                                            </Stack>
                                        </RadioGroup>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        onClick={hanleSaveClick}
                                    >
                                        Lưu
                                    </Button>
                                </Stack>
                            </Stack>
                        </Form>
                        <Customs.CustomizedSnackbars
                            message={values.info.message}
                            open={values.info.status}
                            handleClose={handleInfoClose}
                            severity={values.info.severity}
                        />
                    </Paper>
                </Container>
            )}
        </>
    );
};

export default Profile;
