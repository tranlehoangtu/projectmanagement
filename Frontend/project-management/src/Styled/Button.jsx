import React from "react";
import { Button as MuiButton } from "@mui/material";

const Button = (props) => {
    const { children, variant, onClick, ...other } = props;
    return (
        <MuiButton type="submit" variant={variant} onClick={onClick} {...other}>
            {children}
        </MuiButton>
    );
};

export default Button;
