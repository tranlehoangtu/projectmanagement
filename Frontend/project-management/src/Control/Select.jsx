import { MenuItem, TextField } from "@mui/material";
import React from "react";

const convertToDefEventPara = (name, value) => ({
    target: { name, value },
});

const Select = (props) => {
    const { name, label, value, onChange, variant, type, required, menuItems } =
        props;

    return (
        <TextField
            sx={{ mb: 2 }}
            select
            label={label}
            name={name}
            variant={variant}
            type={type}
            value={value ? value : menuItems[0].id}
            onChange={(e) =>
                onChange(convertToDefEventPara(name, e.target.value))
            }
            required={required}
            fullWidth
        >
            {menuItems.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                    {item.studentName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default Select;
