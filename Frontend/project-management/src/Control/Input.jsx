import { TextField } from "@mui/material";
import React from "react";

export default function Input(props) {
    const { name, label, value, onChange, variant, type, ...other } = props;

    return (
        <TextField
            sx={{ mb: 2 }}
            label={label}
            variant={variant}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete="off"
            {...other}
        />
    );
}
