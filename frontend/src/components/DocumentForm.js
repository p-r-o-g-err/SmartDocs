import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Form, 
    Row, 
    Col, 
    Card, 
    Button,
    Alert,
    Spinner
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

import API_BASE_URL from '../config';

const validationTypes = {
    required: {
        validator: /.+/,
        message: 'Это поле обязательно для заполнения.',
        maxLength: 100
    },
    pattern: {
        validator: (pattern) => pattern,
        message: 'Неверный формат ввода.'
    },
    number: {
        validator: /^\d+$/,
        message: 'Поле должно содержать только цифры.',
        minLength: 1,
        maxLength: 10
    },
    date: {
        validator: /^\d{4}-\d{2}-\d{2}$/,
        message: 'Введите корректную дату в формате ДД.ММ.ГГГГ.'
    },
    fio: {
        validator: /^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+$/,
        message: 'ФИО должно быть в формате "Фамилия Имя Отчество".',
        maxLength: 100
    },
    inn: {
        validator: /^\d{10}$|^\d{12}$/,
        message: 'ИНН должен состоять из 10 или 12 цифр.'
    },
    ogrn: {
        validator: /^\d{13}$/,
        message: 'ОГРН должен состоять из 13 цифр.'
    },
    number_less_100: {
        validator: /^\d{1,2}$/,
        message: 'Поле должно содержать число от 0 до 99.',
        minLength: 1,
        maxLength: 3
    }
};

const fetchDocumentForms = async (type) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/document-forms/${type}`);
        if (!response.ok) {
            console.error('Ошибка ответа сервера:', response.status);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка загрузки полей документа:', error);
        return null;
    }
};

// генерация тестовых данных для полей формы
const generateMockData = (field) => {
    switch (field.validationType) {
        case 'number':
            return '12345';
        case 'date':
            return '2023-01-01';
        case 'fio':
            return 'Иванов Иван Иванович';
        case 'inn':
            return '1234567890';
        case 'ogrn':
            return '1234567890123';
        case 'required':
        case 'pattern':
        case 'number_less_100':
            return '1'
        default:
            return 'Тестовое значение';
    }
};

function DocumentForm() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [fieldValidity, setFieldValidity] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [validated, setValidated] = useState(false);
    const [documentForms, setDocumentForms] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [documentFile, setDocumentFile] = useState(null);
    const [extractionError, setExtractionError] = useState(null);

    // загрузка формы
    useEffect(() => {
        setIsLoading(true);
        fetchDocumentForms(type).then((data) => {
            setDocumentForms(data);
            setIsLoading(false);
        });
    }, [type]);

    // инициализация данных формы
    useEffect(() => {
        if (documentForms) {
            const initialData = {};
            const initialValidity = {};
            documentForms.sections.forEach((section) => {
                section.fields.forEach((field) => {
                    const mockValue = generateMockData(field);
                    initialData[field.name] = mockValue;
                    initialValidity[field.name] = validateField(mockValue, field) === null;

                    // initialData[field.name] = '';
                    // initialValidity[field.name] = null; // null означает, что поле еще не проверено
                });
            });
            setFormData(initialData);
            setFieldValidity(initialValidity);
        }
    }, [documentForms]);

    // сохранение данных в localStorage
    useEffect(() => {
        if (documentForms && Object.keys(formData).length > 0) {
            const savedFormData = {
                type,
                formData,
            };
            localStorage.setItem('savedFormData', JSON.stringify(savedFormData));
        }
    }, [formData, type, documentForms]);

    // восстановление данных из localStorage
    useEffect(() => {
        const savedFormData = JSON.parse(localStorage.getItem('savedFormData'));
        if (savedFormData && savedFormData.type === type) {
            setFormData(savedFormData.formData);
            const initialValidity = {};
            Object.keys(savedFormData.formData).forEach((key) => {
                const field = documentForms?.sections
                    .flatMap((section) => section.fields)
                    .find((f) => f.name === key);
    
                if (field && savedFormData.formData[key].length > 0) {
                    const errorMessage = validateField(savedFormData.formData[key], field);
                    initialValidity[key] = errorMessage === null;
                }
            });
            setFieldValidity(initialValidity);
        }
    }, [type, documentForms]);

    function validateField(value, field) {
        const validation = validationTypes[field.validationType];
        if (!validation) return null;

        if (!value || value.length == 0) {
            return validationTypes.required.message
        }

        // Проверка длины
        let result_message = null;

        const trimmedValue = value.trim();
        if (validation.minLength && trimmedValue.length < validation.minLength) {
            result_message = `Минимальная длина — ${validation.minLength} символов.`;
        }

        if (validation.maxLength && trimmedValue.length > validation.maxLength) {
            if (result_message && result_message.length > 0) {
                result_message += ' ';
            }
            if (result_message !== null) result_message += `Максимальная длина — ${validation.maxLength} символов.`;
            else result_message = `Максимальная длина — ${validation.maxLength} символов.`;
        }

        switch (field.validationType) {
            case 'required':
                if (value.trim())
                    return result_message;
                
                if (result_message && result_message.length > 0) result_message += ' ';
                if (result_message !== null) return result_message + validation.message;
                else return validation.message;
            case 'pattern':
                if (validation.validator(field.pattern).test(value))
                    return result_message;

                if (result_message && result_message.length > 0)  result_message += ' ';
                if (result_message !== null) return result_message + validation.message;
                else return validation.message;
            default:
                if (validation.validator.test(value))
                    return result_message;

                if (result_message && result_message.length > 0)  result_message += ' ';
                if (result_message !== null) return result_message + validation.message;
                else return validation.message;
        }
    }
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: value
        };
        
        setFormData(newFormData);

        const field = documentForms.sections
            .flatMap(section => section.fields)
            .find(f => f.name === name);
  
        const errorMessage = field ? validateField(value, field) : null;
        setFieldValidity((prev) => ({
            ...prev,
            [name]: errorMessage === null
        }));
        setFieldErrors((prev) => ({
            ...prev,
            [name]: errorMessage
        }));
    };

    const handleClear = () => {
        const clearedData = {};
        const clearedValidity = {};
        const clearedErrors = {};

        documentForms.sections.forEach(section => {
            section.fields.forEach(field => {
                clearedData[field.name] = '';
                clearedValidity[field.name] = null;
                clearedErrors[field.name] = null;
            });
        });

        setFormData(clearedData);
        setFieldValidity(clearedValidity);
        setFieldErrors(clearedErrors);
        setValidated(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newFieldValidity = {};
        const newFieldErrors = {};
        let isValidForm = true;

        documentForms.sections.forEach(section => {
            section.fields.forEach(field => {
                const errorMessage = validateField(formData[field.name], field);
                newFieldValidity[field.name] = errorMessage === null;
                newFieldErrors[field.name] = errorMessage;
                if (errorMessage) isValidForm = false;
            });
        });

        setFieldValidity(newFieldValidity);
        setFieldErrors(newFieldErrors);

        if (!isValidForm) {
            setValidated(false);
            return;
        }

        try {
            setIsGenerating(true);
            const response = await fetch(`${API_BASE_URL}/api/generate-document`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    document_type: type,
                    document_data: formData
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Перенаправляем на страницу предварительного просмотра
                navigate('/preview', { 
                    state: {
                        docxFileName: data.docx_filename,
                        pdfFileName: data.pdf_filename,
                        documentTitle: documentForms.title,
                        // formData: formData,
                        previousRoute: '/document-form/' + type
                    } 
                });
                setIsGenerating(false);
            }
        } catch (error) {
            console.error('Ошибка генерации документа:', error);
            setIsGenerating(false);
        }
        // }
        setValidated(true);
    };

    // Обработчик загрузки файла
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Проверка типа файла (можно добавить больше типов)
        const allowedTypes = [
            // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
            // 'application/pdf', 
            'text/plain'
        ];

        if (!allowedTypes.includes(file.type)) {
            setExtractionError('Неподдерживаемый формат файла. Загрузите .txt.');
            return;
        }

        try {
            setIsLoading(true);
            // Создаем FormData для отправки файла
            const formData = new FormData();
            formData.append('document', file);
            formData.append('document_type', type); // Тип документа из URL

            // Отправляем запрос на сервер для извлечения данных
            const response = await fetch(`${API_BASE_URL}/api/extract-document`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при извлечении данных');
            }

            const extractedData = await response.json();

            // Обновляем форму извлеченными данными
            const updatedFormData = { ...formData };
            const updatedValidity = { ...fieldValidity };

            Object.keys(extractedData).forEach(key => {
                if (extractedData[key] !== null) {
                    // updatedFormData[key] = extractedData[key];
                    const value = extractedData[key] !== undefined ? String(extractedData[key]) : null; // Заменяем undefined на null
                    updatedFormData[key] = value;

                    // Валидируем каждое поле
                    const field = documentForms.sections
                        .flatMap(section => section.fields)
                        .find(f => f.name === key);
                    
                    if (field) {
                        const errorMessage = validateField(value, field);
                        updatedValidity[key] = errorMessage === null;
                    }
                }
            });

            setFormData(updatedFormData);
            setFieldValidity(updatedValidity);
            setDocumentFile(file);
            setExtractionError(null);

        } catch (error) {
            console.error('Ошибка извлечения данных:', error);
            setExtractionError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Рендеринг кнопки загрузки документа
    const renderFileUpload = () => (
        <Card className="mb-4">
            <Card.Header>Заполнить по загруженному документу</Card.Header>
            <Card.Body>
                <Form.Group>
                    <Form.Label>Загрузите существующий документ</Form.Label>
                    <Form.Control 
                        type="file" 
                        accept=".txt" // .docx,.pdf,
                        onChange={handleFileUpload}
                    />
                    {documentFile && (
                        <div className="mt-2 text-success">
                            Загружен файл: {documentFile.name}
                        </div>
                    )}
                    {extractionError && (
                        <Alert variant="danger" className="mt-2">
                            {extractionError}
                        </Alert>
                    )}
                </Form.Group>
            </Card.Body>
        </Card>
    );

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </Container>
        );
    }
    if (isGenerating) {
        return (
            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Генерация...</span>
                </Spinner>
            </Container>
        );
    }

    if (!documentForms) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    Не удалось загрузить поля документа.
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">{documentForms.title}</h1>
            {renderFileUpload()}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {documentForms.sections.map((section, sectionIndex) => (
                    <Card key={sectionIndex} className="mb-4">
                        <Card.Header>{section.name}</Card.Header>
                        <Card.Body>
                            <Row>
                                {section.fields.map((field, fieldIndex) => (
                                    <Col key={fieldIndex} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>{field.label}</Form.Label>
                                            <Form.Control
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name] || ''}
                                                onChange={handleChange}
                                                isInvalid={fieldValidity[field.name] === false}
                                                isValid={fieldValidity[field.name] === true}
                                                required={field.required}
                                                placeholder={field.placeholder || ''}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {fieldErrors[field.name]}
                                            </Form.Control.Feedback>
                                            <Form.Control.Feedback type="valid">
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
                <div className="text-center mb-5">
                    <Button variant="secondary" onClick={handleClear} className="me-2">
                        Очистить данные
                    </Button>
                    <Button type="submit" variant="primary">
                        Сгенерировать документ
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default DocumentForm; 