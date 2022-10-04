import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MultipleSelectCheckmarks(props) {
    const [personName, setPersonName] = React.useState([]);

    const { values, handleMenuItemClick, label } = props;
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    return (
        <FormControl sx={{ width: "100%", marginBottom: 2 }}>
            <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
            >
                {values.map((item) => (
                    <MenuItem
                        key={item.id}
                        value={item.name}
                        onClick={() => handleMenuItemClick(item.id)}
                    >
                        <Checkbox
                            checked={personName.indexOf(item.name) > -1}
                        />
                        <ListItemText primary={item.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
