import React, { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import '../styles/DocumentPreview.css';


function DocumentPreview() {
    const location = useLocation();
    const navigate = useNavigate();
    const [docxFileName, setDocxFileName] = useState(null);
    const [pdfFileName, setPdfFileName] = useState(null);
    const [documentTitle, setDocumentTitle] = useState(null);
    const [previousRoute, setPreviousRoute] = useState(null);
    
    useEffect(() => {
        // Проверяем, есть ли данные о документе при переходе
        if (location.state?.docxFileName) {
            setDocxFileName(location.state.docxFileName);
            setPdfFileName(location.state.pdfFileName);
            setDocumentTitle(location.state.documentTitle);
            setPreviousRoute(location.state.previousRoute || '/document-types');
        } else {
            // Если данных нет, возвращаем на страницу выбора документа
            navigate('/document-types');
        }
    }, [location, navigate]);

    const downloadDocument = async (fileName, format) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/downloads/${format}/${fileName}`);
            if (!response.ok) {
                throw new Error(`Не удалось загрузить документ (${format})`);
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${documentTitle}.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error(`Ошибка скачивания документа (${format}):`, error);
            alert(`Не удалось скачать документ (${format})`);
        }
    };

    const goBackToEditing = () => {
        navigate(previousRoute);
    };

    if (!docxFileName) {
        return <Alert variant="warning">Документ не найден</Alert>;
    }

    const previewUrl = `${API_BASE_URL}/api/previews/${pdfFileName}`;

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Предварительный просмотр документа</h1>
            
            <div className="mb-4">
                <iframe 
                    src={previewUrl} 
                    width="100%" 
                    height="600px" 
                    title="Document Preview"
                    className="rounded-iframe"
                />
            </div>

            <div className="text-center mt-4 mb-5">
                <Button 
                    variant="secondary" 
                    className="me-2" 
                    onClick={goBackToEditing}
                >
                    Вернуться к редактированию
                </Button>
                <Button 
                    variant="primary" 
                    className="me-2"
                    onClick={() => downloadDocument(docxFileName, 'docx')}
                >
                    Скачать как DOCX
                </Button>
                <Button 
                    variant="primary" 
                    onClick={() => downloadDocument(pdfFileName, 'pdf')}
                >
                    Скачать как PDF
                </Button>
            </div>
        </Container>
    );
}

export default DocumentPreview;