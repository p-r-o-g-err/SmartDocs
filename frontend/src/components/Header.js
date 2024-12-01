import React from 'react';
import { useNavigate } from 'react-router-dom';

import {Container, Nav, Navbar} from 'react-bootstrap';
import '../styles/Header.css';

import icon from '../images/icon.png';

function Header() {
    const navigate = useNavigate();

    const goToDocumentTypes = () => {
        navigate('/document-types');
    };

    const goToHome = () => {
        navigate('/');
    };

    return (
        <header>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand style={{ cursor: 'pointer' }} onClick={goToHome}>
                        <img 
                            src={icon} 
                            alt="Logo" 
                            style={{ width: '40px', height: '40px', marginRight: '10px' }} 
                        />
                        SmartDocs
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between header-container">
                        <Nav className="me-auto justify-content-center flex-grow-1 align-items-center">
                            <Nav.Link onClick={goToHome}>Главная</Nav.Link>
                            <Nav.Link onClick={goToDocumentTypes}>Шаблоны документов</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;