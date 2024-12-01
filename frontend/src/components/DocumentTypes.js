import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/DocumentTypes.css';

import orderIcon from '../images/order-icon.png';
import contractIcon from '../images/contract-icon.png';

import API_BASE_URL from '../config';


const DOCUMENT_TYPES_ICONS = {
    'order_for_development': orderIcon,
    'subscriber_service_contract': contractIcon,
    'paid_service_contract': contractIcon,
    'intellectual_property_order': orderIcon
};

const fetchDocumentTypes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/document-types`);
        if (!response.ok) {
            console.error('Ошибка ответа сервера:', response.status);
            return [];
        }
        const data = await response.json();
        
        // Добавляем иконки к каждому типу документа
        return data.map(type => ({
            ...type,
            icon: DOCUMENT_TYPES_ICONS[type.id] || contractIcon // Дефолтная иконка
        }));
    } catch (error) {
        console.error('Ошибка загрузки типов документов:', error);
        return [];
    }
};

function DocumentTypeSelection() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [documentTypes, setDocumentTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const loadDocumentTypes = async () => {
            const types = await fetchDocumentTypes();
            setDocumentTypes(types);
            setIsLoading(false);
        };
        loadDocumentTypes();
    }, []);

    const filteredDocumentTypes = documentTypes.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDocumentTypeSelect = (type) => {
        // Очищаем данные формы перед переходом на страницу формы
        localStorage.removeItem('savedFormData');
        navigate(`/document-form/${type}`);
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Выберите тип документа</h1>
            
            <InputGroup className="mb-4">
                <Form.Control
                    placeholder="Поиск шаблона документа..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputGroup.Text>🔍</InputGroup.Text>
            </InputGroup>

            {filteredDocumentTypes.length === 0 ? (
                <div className="text-center">
                    <p>Документы не найдены. Попробуйте изменить запрос.</p>
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4 mb-5">
                    {filteredDocumentTypes.map((doc) => (
                        <Col key={doc.id}>
                            <Card 
                                className="h-100 document-type-card" 
                                onClick={() => handleDocumentTypeSelect(doc.id)}
                                role="button"
                            >
                                <div className="text-center mt-3">
                                    <img 
                                        src={doc.icon} 
                                        alt={doc.name} 
                                        className="document-type-icon"
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Title>{doc.name}</Card.Title>
                                    <Card.Text className="text-muted">
                                        {doc.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default DocumentTypeSelection;