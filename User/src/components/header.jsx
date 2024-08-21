import React from 'react';
import { useLocation, Link, NavLink } from "react-router-dom"; // Ensure useLocation is imported
import { Container, Row, Nav, Navbar, Button, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { IoLocation } from "react-icons/io5";
import { LiaCarSideSolid, LiaHandsHelpingSolid } from "react-icons/lia";
import { BsTelephoneFill } from "react-icons/bs";
import { GrMail } from "react-icons/gr";
import { useSelector } from "react-redux";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { RxSlash } from "react-icons/rx";
import useAuthentication from "../hooks/useAuthentication"; // Adjusted import order

const Header = () => {
    const location = useLocation(); // useLocation hook usage
    const user = useSelector(({ UserSlice }) => UserSlice.user);
    const { signOutCall } = useAuthentication();

    const handleLogout = async () => {
        await signOutCall();
    }

    const handleHelpButtonClick = e => {
        e.preventDefault();
        Swal.fire(
            'Do you need help?',
            'Contact on aayasyasaakshi@gmail.com',
            'Post any question you have'
        );
    }

    return (
        <header id="header">
            <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect expand="lg" className="bg-body-tertiary header-line-1">
                <Container>
                    <Navbar.Brand as={Link} to="/">Spalits Car Rental</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" eventKey="i">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about" eventKey="i">About</Nav.Link>
                            <Nav.Link as={Link} to="/vehicles" eventKey="i">Vehicles</Nav.Link>
                       
                           
                        </Nav>
                        <Nav>
                            {
                                user.email
                                    ?
                                    <Nav.Link as={Link} to="/my-rentals" eventKey="i">My Rentals <LiaCarSideSolid size="1.25em" className="align-text-top" /></Nav.Link>
                                    :
                                    <>
                                        <Nav.Link as={Link} to="/login" className="d-inline px-0-md" eventKey="i">Login <FaUser className="align-text-top" /></Nav.Link>
                                        <RxSlash className="mt-2 d-none d-lg-block" />
                                        <Nav.Link as={Link} to="/sign-up" className="d-inline px-0-md" eventKey="i">Sign Up <FaUserPlus size="1.1em" className="align-text-top" /></Nav.Link>
                                    </>
                            }
                            <Nav.Link as={Link} to="/" onClick={handleHelpButtonClick}>Help <LiaHandsHelpingSolid size="1.25em" className="align-text-bottom" /></Nav.Link>
                            {
                                user.email && <Button variant="danger" className="py-0" onClick={handleLogout} eventKey="i">Log out</Button>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
           
        </header>
    );
};

export default Header;
