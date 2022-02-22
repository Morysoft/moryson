import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Nav, Navbar, NavDropdown, Tab, Tabs } from 'react-bootstrap';
import './App.scss';
import Project from './components/Project';

function App() {
    const [projects, setProjects] = useState<{ id: string, title: string }[]>([{ id: 'p0', title: 'Project 1' }]);

    return (
        <div className="app">
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">mory<b>son</b></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {/* <Nav.Link href="#home">Home</Nav.Link> */}
                            <Nav.Link href="javascript:void 0;" onClick={() => setProjects(ps => [...ps, { id: `p${new Date().getTime()}`, title: `Project ${new Date().toISOString()}` }])}>+ New project</Nav.Link>
                            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container fluid>
                <Tabs defaultActiveKey={projects[0].id} id="uncontrolled-tab-example" className="mb-3">
                    {projects.map(project => (
                        <Tab key={project.id} eventKey={project.id} title={project.title}>
                            <Project />
                        </Tab>
                    ))}
                </Tabs>
            </Container>
        </div>
    );
}

export default App;
