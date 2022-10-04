import { styled } from "@mui/material";
import React from "react";

const StyledLoaderLine = styled("div")({
    width: "100%",
    height: "4px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ddd",
    margin: "0px auto",
    borderRadius: "20px",
    WebkitBorderRadius: "20px",
    MozBorderRadius: "20px",
    "&::before": {
        content: '""',
        position: "absolute",
        left: "-50%",
        height: "4px",
        width: "40%",
        backgroundColor: "#1976d2",
        WebkitAnimation: "lineAnim 1s linear infinite",
        MozAnimation: "lineAnim 1s linear infinite",
        animation: "lineAnim 1s linear infinite",
        WebkitBorderRadius: "20px",
        MozBorderRadius: "20px",
        borderRadius: "20px",
    },
    "@keyframes lineAnim": {
        "0%": {
            left: "-40%",
        },
        "50%": {
            left: "20%",
            width: "80%",
        },
        "100%": {
            left: "100%",
            width: "100%",
        },
    },
});

const LoaderLine = () => {
    return <StyledLoaderLine />;
};

export default LoaderLine;
