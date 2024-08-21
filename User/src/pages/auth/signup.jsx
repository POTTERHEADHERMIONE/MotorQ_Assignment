import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import useAuthentication from "../../hooks/useAuthentication";
import { loadingContent } from "../../components/general/general-components";
import "./Signup.css"; // Import custom CSS file

const Signup = () => {
    const navigate = useNavigate();
    const { isLoading, message, signUpCall } = useAuthentication();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await signUpCall({ email, password });
            navigate("/login"); // Redirect after successful signup
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div id="sign-up" className="signup-container">
            <Container className="pt-4 pb-5">
                <Row className="mb-5">
                    <Col>
                        <h1 className="fs-1 text-center text-uppercase">Sign Up</h1>
                        {message && (
                            <Alert variant={message.isError ? "danger" : "success"}>
                                {message.content}
                            </Alert>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row className="justify-content-center">
                            <Col xs={12} md={8} className={isLoading ? "text-center" : null}>
                                {isLoading ? (
                                    <Spinner animation="border" variant="primary" />
                                ) : (
                                    <Form onSubmit={handleSignup} className="signup-form">
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                                We'll never share your email with anyone else.
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label="I agree to the terms" />
                                        </Form.Group>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="signup-button"
                                        >
                                            Sign Up
                                        </Button>
                                    </Form>
                                )}
                                <p className="mt-3">
                                    Already have an account?{' '}
                                    <NavLink to="/login" className="signup-link">
                                        Sign in
                                    </NavLink>
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Signup;
