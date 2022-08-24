import React from "react";
import { useState, useContext } from "react";
import { url } from "../../apiInfo/Url";
import { Context } from "../utils/LoginProvider";

const Login = () => {
    const [username, setUsername] = useState('')
    const [login, setLogin] = useContext(Context);

    const [validationErrors, setValidationErrors] = useState({
        usernameError: ""
    });

    const validate = () => {
        let usernameError = "";

        if (!username) {
            usernameError = "You must enter username";
        }

        if (usernameError) {
            setValidationErrors((prev) => ({
                ...prev,
                usernameError: usernameError
            }));
            return false;
        }
        return true;
    };

    const submitForm = async (e) => {
        e.preventDefault();

        const isValid = validate();
        if (!isValid) {
            return;
        }
        setValidationErrors((prev) => ({
            ...prev,
            usernameError: ""
        }));

        try {
            const response = await fetch(`${url}/api/users/login?userName=${username}`);
            if (!response.ok) {
                console.log('WRONG REQUEST')
            } else {
                const json = await response.json();
                localStorage.setItem("username", json.name);
                setLogin(!login);
            }
        } catch (error) {

        }
    };


    return (
        <div className="Auth-form-container">
            <form onSubmit={submitForm} className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Username</label>
                        <input
                            className="form-control mt-1"
                            placeholder="Enter username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div style={{ color: "red" }}>{validationErrors.usernameError}</div>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login