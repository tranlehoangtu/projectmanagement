import React from "react";

const Form = ({ children, ...other }) => {
    return (
        <form autoComplete="off" {...other}>
            {children}
        </form>
    );
};

export default Form;
