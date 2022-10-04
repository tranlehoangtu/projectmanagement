import {
    TableCell,
    TableContainer,
    Table as MuiTable,
    TableHead,
    TableRow,
    TableBody,
} from "@mui/material";
import React from "react";

const Table = (props) => {
    const { data } = props;

    const label = Object.keys(data[0]);
    console.log();

    return (
        <TableContainer>
            <MuiTable>
                <TableBody>
                    {data.map((item) => {
                        let temp = 1;
                        return (
                            <TableRow
                                key={item.id}
                                sx={{
                                    cursor: "pointer",
                                    ":hover": {
                                        bgcolor: "grey",
                                    },
                                }}
                            >
                                <TableCell
                                    sx={{
                                        ":hover": {
                                            bgcolor: "grey",
                                        },
                                    }}
                                >
                                    {item}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
};

export default Table;
