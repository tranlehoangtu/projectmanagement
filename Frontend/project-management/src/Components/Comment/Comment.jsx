import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import Customs from "../../Styled/Customs";
const getHoursandMins = (rawDate) => {
    const result = new dayjs(rawDate);
    const hours = result.$H > 9 ? result.$H : `0${result.$H}`;
    const mins = result.$m > 9 ? result.$m : `0${result.$m}`;

    return `${hours}:${mins}`;
};
const Comment = (props) => {
    const {
        comment,
        currentUser,
        managerId,
        onDeleteComment,
        onEditComment,
        onReportComment,
    } = props;

    return (
        <Stack key={comment.id} direction="row" justifyContent="space-between">
            <Stack direction="row" gap={1} sx={{ mb: 2 }}>
                <Stack>
                    <Avatar>{comment.username.charAt(0)}</Avatar>
                </Stack>
                <div>
                    <div>
                        <span>{`${comment.username} `}</span>
                        <Typography variant="caption">
                            {getHoursandMins(comment.createAt)}
                        </Typography>
                    </div>
                    <Typography variant="subtitle2">{comment.body}</Typography>
                </div>
            </Stack>
            <Customs.PositionedMenu
                currentUser={currentUser}
                userId={comment.userId}
                managerId={managerId}
                onDeleteComment={() => onDeleteComment(comment.id)}
                onEditComment={() => onEditComment(comment.id)}
                onReportComment={onReportComment}
            />
        </Stack>
    );
};

export default Comment;
