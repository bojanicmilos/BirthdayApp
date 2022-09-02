import React from "react";
import { useState, useContext } from "react";
import { url } from "../../apiInfo/Url";
import { Context } from "../utils/LoginProvider";
import { NotificationManager } from "react-notifications";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCurrentDate } from "../datefunctions/getCurrentDate";

const Login = () => {
    const [username, setUsername] = useState('')
    const [login, setLogin] = useContext(Context);
    const [isLogin, setIsLogin] = useState(true)
    const [birthDate, setBirthDate] = useState(new Date());

    const [loginValidationErrors, setLoginValidationErrors] = useState({
        usernameError: ''
    });

    const [registrationValidationErrors, setRegistrationValidationErrors] = useState({
        usernameError: "",
        birthDateError: ""
    });

    const validateLogin = () => {
        let usernameError = "";

        if (!username) {
            usernameError = "You must enter username";
        }

        if (usernameError) {
            setLoginValidationErrors((prev) => ({
                ...prev,
                usernameError: usernameError
            }));
            return false;
        }
        return true;
    };

    const validateRegistration = () => {
        let usernameError = "";
        let birthDateError = '';

        if (!username || username.length < 3) {
            usernameError = 'You must enter at least 3 characters for username'
        }

        if (!birthDate || birthDate > getCurrentDate()) {
            birthDateError = 'You picked wrong date'
        }

        if (usernameError || birthDateError) {
            setRegistrationValidationErrors((prev) => ({ ...prev, usernameError: usernameError, birthDateError: birthDateError }))
            return false;
        }
        return true;

    }

    const submitLoginForm = async (e) => {
        e.preventDefault();

        const isValid = validateLogin();
        if (!isValid) {
            return;
        }
        setLoginValidationErrors((prev) => ({
            ...prev,
            usernameError: ""
        }));

        try {
            const response = await fetch(`${url}/api/users/login?userName=${username}`);
            if (!response.ok) {
                NotificationManager.error('Wrong username !')
            } else {
                const json = await response.json();
                localStorage.setItem("username", json.name);
                localStorage.setItem('id', json._id)
                localStorage.setItem('birthDate', json.birthDate)
                setLogin(!login);
            }
        } catch (error) {

        }
    };

    const submitRegistrationForm = async (e) => {
        e.preventDefault();

        const isValid = validateRegistration()

        if (!isValid) {
            return
        }

        setRegistrationValidationErrors((prev) => ({
            ...prev,
            usernameError: '',
            birthDateError: ''
        }));

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: username, birthDate: birthDate, wishList: [] })
        }

        try {
            const response = await fetch(`${url}/api/users`, options);
            if (!response.ok) {
                const text = await response.text()
                NotificationManager.error(text)
            } else {
                NotificationManager.success('Registration successful !')
                setIsLogin(true)
            }
        } catch (error) {

        }
    }

    return (
        <>
            {isLogin ?
                <div className="Auth-form-container">
                    <form onSubmit={submitLoginForm} className="Auth-form">
                        <div className="Auth-form-content">
                            <h3 className="Auth-form-title">Sign In</h3>
                            <div className="text-center">
                                Not registered yet?{" "}
                                <span style={{ cursor: 'pointer' }} className="link-primary" onClick={() => setIsLogin(false)}>
                                    Sign Up
                                </span>
                            </div>
                            <div className="form-group mt-3">
                                <label>Username</label>
                                <input
                                    className="form-control mt-1"
                                    placeholder="Enter username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <div style={{ color: "red" }}>{loginValidationErrors.usernameError}</div>
                            </div>
                            <div className="d-grid gap-2 mt-3">
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                : <div className="Auth-form-container">
                    <form onSubmit={submitRegistrationForm} className="Auth-form">
                        <div className="Auth-form-content">
                            <h3 className="Auth-form-title">Sign Up</h3>
                            <div className="text-center">
                                Already registered?{" "}
                                <span style={{ cursor: 'pointer' }} className="link-primary" onClick={() => setIsLogin(true)}>
                                    Sign In
                                </span>
                            </div>
                            <div className="form-group mt-3">
                                <label>Username</label>
                                <input
                                    className="form-control mt-1"
                                    placeholder="Enter username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <div style={{ color: "red" }}>{registrationValidationErrors.usernameError}</div>
                            </div>
                            <div className="form-group mt-3">
                                <label>Birth date</label>
                                <DatePicker selected={birthDate} onChange={(date) => setBirthDate(date)} />
                                <div style={{ color: "red" }}>{registrationValidationErrors.birthDateError}</div>

                            </div>

                            <div className="d-grid gap-2 mt-3">
                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                </div>}
        </>
    )
}

export default Login