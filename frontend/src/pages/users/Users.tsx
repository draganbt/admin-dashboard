// src/pages/users/Users.tsx
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Table,
    Button,
    Row,
    Col,
    Navbar,
    Nav,
    Card,
    Form,
} from 'react-bootstrap';

interface User {
    id: string;
    email: string;
    role: string;
}

interface UsersPaginated {
    data: User[];
    total: number;
    page: number;
    limit: number;
}

interface GetUsersResponse {
    users: UsersPaginated;
}

interface PaginationInput {
    page: number;
    limit: number;
}

interface FilterInput {
    search?: string;
}

const GET_USERS_PAGINATED = gql`
  query GetUsers($filter: UsersFilterInput, $pagination: PaginationInput) {
    users(filter: $filter, pagination: $pagination) {
      data {
        id
        email
        role
      }
      total
      page
      limit
    }
  }
`;

const UsersPage: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const limit = 5;

    const { data, loading, error, refetch } = useQuery<
        GetUsersResponse,
        { filter?: FilterInput; pagination: PaginationInput }
    >(GET_USERS_PAGINATED, {
        variables: { filter: { search }, pagination: { page, limit } },
        fetchPolicy: 'network-only',
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        setPage(1);
        refetch({ filter: { search: value }, pagination: { page: 1, limit } });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error.message}</p>;

    const users = data?.users.data || [];
    const total = data?.users.total || 0;
    const totalAdmins = users.filter(u => u.role === 'ADMIN').length;
    const totalUsers = users.filter(u => u.role === 'USER').length;

    const currentUserEmail = localStorage.getItem('userEmail') || 'Admin';

    return (
        <>
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" className="mb-4">
                <Container>
                    <Navbar.Brand>Admin Dashboard</Navbar.Brand>
                    <Nav className="ms-auto align-items-center">
                        <Navbar.Text className="me-3">Signed in as: {currentUserEmail}</Navbar.Text>
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            <Container>
                {/* Stats Cards */}
                <Row className="mb-4">
                    <Col md={4}>
                        <Card bg="primary" text="white" className="mb-2">
                            <Card.Body>
                                <Card.Title>Total Users</Card.Title>
                                <Card.Text>{total}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card bg="success" text="white" className="mb-2">
                            <Card.Body>
                                <Card.Title>Admins</Card.Title>
                                <Card.Text>{totalAdmins}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card bg="info" text="white" className="mb-2">
                            <Card.Body>
                                <Card.Title>Regular Users</Card.Title>
                                <Card.Text>{totalUsers}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Search + Table */}
                <Card>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <h4>Users (Page {page})</h4>
                            </Col>
                            <Col xs={12} md={6} className="mt-2 mt-md-0">
                                <Form>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by email..."
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </Form>
                            </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    className={user.role === 'ADMIN' ? 'table-warning' : ''}
                                >
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>

                        {/* Pagination */}
                        <div className="d-flex justify-content-between mt-3">
                            <Button
                                onClick={() => {
                                    const prevPage = page - 1;
                                    setPage(prevPage);
                                    refetch({ filter: { search }, pagination: { page: prevPage, limit } });
                                }}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => {
                                    const nextPage = page + 1;
                                    setPage(nextPage);
                                    refetch({ filter: { search }, pagination: { page: nextPage, limit } });
                                }}
                                disabled={page * limit >= total}
                            >
                                Next
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default UsersPage;