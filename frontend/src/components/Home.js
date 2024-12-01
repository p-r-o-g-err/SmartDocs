import { useNavigate } from 'react-router-dom';
import { Button, Card, CardGroup } from 'react-bootstrap';
import selectDocumentIcon from '../images/select-document.png';
import inputDataIcon from '../images/input-data.png';
import generateDocumentIcon from '../images/generate-document.png';
import downloadDocumentIcon from '../images/download-document.png';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();

    return (
        <main className="container mt-5 mb-5">
            <h1 className="text-center homeTitle">Автоматизация юридических документов</h1>
            <p className="text-center homeSubtitle">
                Создавайте профессиональные юридические документы быстро и легко. 
                Наш сервис поможет вам генерировать корректные документы 
                в несколько кликов.
            </p>
            <h2 className="text-center mb-4 homeAlgorithmTitle">Алгоритм работы</h2>
            <CardGroup>
                <Card className="custom-card">
                    <div className="d-flex justify-content-center mt-3">
                        <img src={selectDocumentIcon} alt="Выбор типа документа" className="icon-img" />
                    </div>
                    <Card.Body>
                        <Card.Title>1. Выберите тип документа</Card.Title>
                        <Card.Text>
                            Выберите нужный тип документа из списка доступных шаблонов
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="custom-card">
                    <div className="d-flex justify-content-center mt-3">
                        <img src={inputDataIcon} alt="Заполнение формы" className="icon-img" />
                    </div>
                    <Card.Body>
                        <Card.Title>2. Заполните данные</Card.Title>
                        <Card.Text>
                            Внесите необходимую информацию в интерактивную форму
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="custom-card">
                    <div className="d-flex justify-content-center mt-3">
                        <img src={generateDocumentIcon} alt="Генерация документа" className="icon-img" />
                    </div>
                    <Card.Body>
                        <Card.Title>3. Сгенерируйте документ</Card.Title>
                        <Card.Text>
                            Система автоматически создаст документ на основе ваших данных
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="custom-card">
                    <div className="d-flex justify-content-center mt-3">
                        <img src={downloadDocumentIcon} alt="Скачивание документа" className="icon-img" />
                    </div>
                    <Card.Body>
                        <Card.Title>4. Проверьте и скачайте</Card.Title>
                        <Card.Text>
                            Проверьте документ и скачайте в формате .docx или .pdf 
                        </Card.Text>
                    </Card.Body>
                </Card>
            </CardGroup>
            <div className="d-flex justify-content-center">
                <Button 
                    variant="primary" 
                    className="mt-4" 
                    onClick={() => navigate('/document-types')}
                >
                   Создать документ
                </Button>
            </div>
        </main>
    );
}

export default Home;