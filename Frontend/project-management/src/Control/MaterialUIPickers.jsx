import * as React from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const convertToDefEventPara = (name, value) => ({
    target: { name, value },
});

export default function MaterialUIPickers(props) {
    const { label, name, value, onChange } = props;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                label={label}
                inputFormat="DD/MM/YYYY"
                value={value}
                onChange={(nValue) => {
                    onChange(convertToDefEventPara(name, nValue));
                }}
                renderInput={(params) => (
                    <TextField sx={{ width: "100%" }} {...params} />
                )}
            />
        </LocalizationProvider>
    );
}
