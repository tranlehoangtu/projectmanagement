import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React from "react";

// const getProperty = (obj, prop) => {
//     var parts = prop.split(".");

//     if (Array.isArray(parts)) {
//         var last = parts.length > 1 ? parts.pop() : parts;
//         var l = parts.length,
//             i = 1,
//             current = parts[0];

//         while ((obj = obj[current]) && i < l) {
//             current = parts[i];
//             i++;
//         }

//         if (typeof obj === "object") {
//             return obj[last];
//         }
//         return obj;
//     } else {
//         return "parts is not valid array";
//     }
// };

const StickyHeadTable = (props) => {
    const { values, tableHeaders, onClick, tableBodies } = props;
    return (
        <Paper>
            <TableContainer sx={{ maxHeight: "400px" }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((header, index) => (
                                <TableCell
                                    sx={{
                                        bgcolor: "rgb(54, 58, 74, 1);",
                                        color: "white",
                                    }}
                                    key={index}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map((item) => {
                            return (
                                <TableRow
                                    key={item.id}
                                    sx={{
                                        ":hover": {
                                            cursor: "pointer",
                                            bgcolor: "rgba(0, 0, 0, 0.2)",
                                        },
                                        "& td": {
                                            padding: "6px 16px",
                                        },
                                    }}
                                    onClick={() => onClick(item.id)}
                                >
                                    {tableBodies.map((body, index) => {
                                        return (
                                            <TableCell key={index}>
                                                {item[body]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default StickyHeadTable;
