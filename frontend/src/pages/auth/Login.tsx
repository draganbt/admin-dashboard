// src/pages/auth/Login.tsx
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        email
        role
      }
    }
  }
`;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            // Save JWT token
            localStorage.setItem('token', data.login.access_token);

            // Save user email for dashboard display
            localStorage.setItem('userEmail', data.login.user.email);

            // Redirect to Users page
            navigate('/users');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ variables: { input: { email, password } } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container className="d-flex vh-100">
            <Row className="justify-content-center align-self-center w-100">
                <Col md={5}>
                    <Card>
                        <Card.Body>
                            <h3 className="mb-4 text-center">Login</h3>

                            {error && <Alert variant="danger">{error.message}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </div>

                                <div className="mt-3 text-center">
                                    <span>Don't have an account? </span>
                                    <a href="/register">Register here</a>
                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;