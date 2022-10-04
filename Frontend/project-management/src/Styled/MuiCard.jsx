import { SubdirectoryArrowRight, Work } from "@mui/icons-material";
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import React from "react";
import ProjectMenu from "./ProjectMenu";

const styles = {
    minWidth: "300px",
    maxWidth: "300px",
    ":hover": {
        cursor: "pointer",
        boxShadow: "1px 2px 9px #000",
    },
    "& .MuiCardHeader-title": {
        width: "180px",
        fontWeight: 500,
        fontSize: "20px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    "& .MuiCardHeader-subheader": {},
};

const MuiCard = (props) => {
    const { cardValues, handleClick, onEditClick, onDeleteClick } = props;

    return (
        <Paper elevation={2} sx={{ mr: 2, mb: 4 }}>
            <Card sx={styles} id="123">
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                            <Work />
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <ProjectMenu
                                onEditClick={onEditClick}
                                onDeleteClick={onDeleteClick}
                                id={cardValues.id}
                            />
                        </IconButton>
                    }
                    title={cardValues.title}
                    subheader={cardValues.subheader}
                />
                <CardContent
                    onClick={() => handleClick(cardValues.id)}
                    sx={{
                        borderTop: "1px solid grey",
                        borderBottom: "1px solid grey",
                        maxHeight: "240px",
                        minHeight: "240px",
                        overflow: "hidden",
                        padding: "0 8px",
                    }}
                >
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                        }}
                    >
                        {cardValues.members.map((cardValue, index) => (
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            bgcolor: "violet",
                                        }}
                                    >
                                        {cardValue.avatar}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        color: "#0c0606",
                                    }}
                                    primary={cardValue.primary}
                                    secondary={cardValue.secondary}
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                    <Grid
                        container
                        justifyContent="center"
                        alignContent="center"
                        spacing={2}
                    >
                        <Grid item>
                            <Typography>Thêm Thông Tin</Typography>
                        </Grid>
                        <Grid item>
                            <SubdirectoryArrowRight />
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Paper>
    );
};

export default MuiCard;
