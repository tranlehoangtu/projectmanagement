import * as React from "react";
import Box from "@mui/material/Box";
import { Modal as MuiModal } from "@mui/material/";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const Modal = (props) => {
    const { children, open, onClose, other } = props;

    return (
        <MuiModal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ ...style, ...other }}>{children}</Box>
        </MuiModal>
    );
};

export default Modal;
