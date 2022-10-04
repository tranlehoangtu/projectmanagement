import { Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    return (
        <Stack
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2, gap: { xs: "none", sm: 2 } }}
        >
            <Typography variant="h3">
                Chào mừng trở lại, {currentUser.fullName}
            </Typography>
            <Typography variant="h4">
                <Link to="projects">BẮT ĐẦU</Link> CÔNG VIỆC CỦA BẠN
            </Typography>
        </Stack>
    );
};

export default Home;
