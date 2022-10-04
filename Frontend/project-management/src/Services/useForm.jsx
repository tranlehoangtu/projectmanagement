import React, { useState } from "react";

const styles = {
    root: {
        "& .MuiFormControl-root": {
            width: "10%",
            margin: 1,
        },
    },
};

export function useForm(initialValues) {
    const [values, setValues] = useState(initialValues);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setValues({
            ...values,
            [name]: value,
        });
    };

    return {
        values,
        setValues,
        handleInputChange,
    };
}

export function Form(props) {
    return (
        <form style={styles} autoComplete="off">
            {props.children}
        </form>
    );
}
