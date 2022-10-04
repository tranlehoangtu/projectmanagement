import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
    AutoDeleteOutlined,
    ModeEditOutlineOutlined,
    MoreVert,
} from "@mui/icons-material";
import { ListItemIcon, ListItemText, Typography } from "@mui/material";

const ProjectMenu = (props) => {
    const { id, onDeleteClick, onEditClick } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <MoreVert
                onClick={handleClick}
                sx={{ ":hover": { cursor: "pointer" } }}
            />
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <div style={{ width: 140 }}>
                    <MenuItem onClick={() => onEditClick(id)}>
                        <ListItemIcon>
                            <ModeEditOutlineOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText></ListItemText>
                        <Typography variant="body2" color="text.primary">
                            Chỉnh sửa
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => onDeleteClick(id)}>
                        <ListItemIcon>
                            <AutoDeleteOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText></ListItemText>
                        <Typography variant="body2" color="text.primary">
                            Xóa
                        </Typography>
                    </MenuItem>
                </div>
            </Menu>
        </>
    );
};

export default ProjectMenu;
