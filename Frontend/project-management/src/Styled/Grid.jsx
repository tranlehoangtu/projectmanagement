import React from "react";
import { Grid as MuiGrid } from "@mui/material";

const Grid = ({ children }) => {
    return (
        <div>
            <MuiGrid container direction="row" alignItems="center" gap={1}>
                {children}
            </MuiGrid>
        </div>
    );
};

export default Grid;
