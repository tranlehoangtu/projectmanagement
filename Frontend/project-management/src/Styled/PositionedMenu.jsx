import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
    AutoDeleteOutlined,
    EmojiFlagsOutlined,
    ModeEditOutlineOutlined,
    MoreVert,
} from "@mui/icons-material";
import { ListItemIcon, ListItemText, Typography } from "@mui/material";

export default function PositionedMenu(props) {
    const {
        currentUser,
        userId,
        managerId,
        onDeleteComment,
        onEditComment,
        onReportComment,
    } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
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
                    {currentUser === userId && (
                        <MenuItem onClick={onEditComment}>
                            <ListItemIcon>
                                <ModeEditOutlineOutlined fontSize="small" />
                            </ListItemIcon>
                            <ListItemText></ListItemText>
                            <Typography variant="body2" color="text.primary">
                                Chỉnh sửa
                            </Typography>
                        </MenuItem>
                    )}
                    {currentUser !== userId && currentUser !== managerId && (
                        <MenuItem onClick={onReportComment}>
                            <ListItemIcon>
                                <EmojiFlagsOutlined fontSize="small" />
                            </ListItemIcon>
                            <ListItemText></ListItemText>
                            <Typography variant="body2" color="text.primary">
                                Báo cáo
                            </Typography>
                        </MenuItem>
                    )}
                    {(currentUser === userId || currentUser === managerId) && (
                        <MenuItem onClick={onDeleteComment}>
                            <ListItemIcon>
                                <AutoDeleteOutlined fontSize="small" />
                            </ListItemIcon>
                            <ListItemText></ListItemText>
                            <Typography variant="body2" color="text.primary">
                                Xóa
                            </Typography>
                        </MenuItem>
                    )}
                </div>
            </Menu>
        </div>
    );
}
