import Comment from "./Comment";

const Comments = (props) => {
    const {
        comments,
        currentUser,
        managerId,
        onDeleteComment,
        onEditComment,
        onReportComment,
    } = props;

    return (
        <>
            {comments.map((comment, index) => (
                <Comment
                    key={index}
                    comment={comment}
                    currentUser={currentUser}
                    managerId={managerId}
                    onDeleteComment={onDeleteComment}
                    onEditComment={onEditComment}
                    onReportComment={onReportComment}
                />
            ))}
        </>
    );
};

export default Comments;
