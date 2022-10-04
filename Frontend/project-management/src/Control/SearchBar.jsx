import { Clear, Search } from "@mui/icons-material";
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import React from "react";

const SearchBar = (props) => {
    const { values, onChange, onRemoveClick, label, fullwidth } = props;

    // const style = fullwidth ? {witdh: "100%"} : ""
    return (
        <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
                {label}
            </InputLabel>
            <OutlinedInput
                autoComplete="off"
                id="outlined-adornment-password"
                type="text"
                value={values}
                onChange={(e) => onChange(e)}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            edge="end"
                            onClick={onRemoveClick}
                        >
                            {values.length ? <Clear /> : <Search />}
                        </IconButton>
                    </InputAdornment>
                }
                label={label}
            />
        </FormControl>
    );
};

export default SearchBar;
