import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { useState } from "react";
import { Upgrade } from "@mui/icons-material";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        tableHeaders,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all desserts",
                        }}
                    />
                </TableCell>
                {tableHeaders.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const {
        numSelected,
        label,
        selected,
        handleDelete,
        setSelected,
        handlePromoClick,
        permission,
    } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} được chọn
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {label}
                </Typography>
            )}

            {numSelected > 0 ? (
                <>
                    {permission.edit && (
                        <Tooltip
                            title="Xóa"
                            onClick={() => {
                                setSelected([]);
                                handleDelete(selected);
                            }}
                        >
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {permission.promo && (
                        <Tooltip
                            title="Thăng cấp thành nhóm trưởng"
                            onClick={() => {
                                handlePromoClick(selected);
                                setSelected([]);
                            }}
                        >
                            <IconButton>
                                <Upgrade />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
    const {
        values,
        tableHeaders,
        tableBodies,
        handleDelete,
        label,
        onItemClick,
        handlePromoClick,
        permission,
    } = props;

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("lastName");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = values.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - values.length) : 0;
    return (
        <Box sx={{ width: "100%" }}>
            <Paper variant="outlined" sx={{ width: "100%", mb: 2, mt: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    label={label}
                    handleDelete={handleDelete}
                    selected={selected}
                    setSelected={setSelected}
                    handlePromoClick={handlePromoClick}
                    permission={permission}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={values.length}
                            tableHeaders={tableHeaders}
                        />
                        <TableBody>
                            {stableSort(values, getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    onClick={(event) =>
                                                        handleClick(
                                                            event,
                                                            row.id
                                                        )
                                                    }
                                                    inputProps={{
                                                        "aria-labelledby":
                                                            labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            {tableBodies.map((col, index) => (
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    key={`cell-${index}`}
                                                    sx={{ cursor: "pointer" }}
                                                    onClick={() =>
                                                        onItemClick(row.id)
                                                    }
                                                >
                                                    {row[col]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={values.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
