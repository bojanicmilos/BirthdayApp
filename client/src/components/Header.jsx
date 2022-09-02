import React from 'react'
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { Context } from "./utils/LoginProvider";
import { useContext } from "react";
import moment from 'moment';
import { getCurrentDate } from './datefunctions/getCurrentDate';

const Header = () => {
    const [login, setLogin] = useContext(Context);
    const logout = () => {
        localStorage.removeItem('birthDate')
        localStorage.removeItem("username");
        localStorage.removeItem('id')
        setLogin(!login);
    };

    return (
        <Navbar style={{ height: '6vh' }} bg="light" variant="light">
            <Navbar.Brand as={Link} to="/">
                Birthday App
            </Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link as={Link} to="/users">
                    Users
                </Nav.Link>
                <Nav.Link as={Link} to="/birthdayevents">
                    Birthday events
                </Nav.Link>
                <Nav.Link as={Link} to="/mywishlist">
                    My WishList
                </Nav.Link>
                <Nav.Link as={Link} to="/items">
                    Items
                </Nav.Link>
                {
                    moment(localStorage.getItem('birthDate')).set('year', moment().year()).startOf('day').isSame(getCurrentDate()) &&
                    <Nav.Link as={Link} to="/birthdaymessages">
                        Birthday messages
                    </Nav.Link>}
                <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default Header