from flask import request, jsonify, send_file
from .document_generator import generate_document, convert_docx_to_pdf
from .data import DOCUMENT_TYPES, DOCUMENT_FORMS
import os
from .document_extractor import extract
from werkzeug.utils import secure_filename
import chardet

def init_routes(app):
    # Генерация документа
    @app.route('/api/generate-document', methods=['POST'])
    def generate_doc():
        try:
            document_type = request.json.get('document_type')
            document_data = request.json.get('document_data')
            
            # Валидация входных данных
            if not document_type or not document_data:
                return jsonify({
                    'error': 'Отсутствуют необходимые данные'
                }), 400
            
            # Генерация документа
            docx_path = generate_document(document_type, document_data)
            
            # Преобразование в pdf
            pdf_path = convert_docx_to_pdf(docx_path)

            # Извлекаем имена файлов
            docx_filename = os.path.basename(docx_path)
            pdf_filename = os.path.basename(pdf_path)

            # Возвращаем информацию о файлах
            return jsonify({
                'docx_filename': docx_filename,
                'pdf_filename': pdf_filename
            })
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    # Получение типов документов
    @app.route('/api/document-types', methods=['GET'])
    def get_document_types():
        return jsonify(DOCUMENT_TYPES)
    
    # Получение полей документа
    @app.route('/api/document-forms/<document_type>', methods=['GET'])
    def get_document_forms(document_type):
        document_form = DOCUMENT_FORMS.get(document_type)
        if document_form is None:
            return jsonify(None), 404  # Возвращаем 404 статус и null
        return jsonify(document_form)
    
    @app.route('/api/previews/<filename>', methods=['GET'])
    def preview_file(filename):
        base_output_dir = os.path.abspath('app/generated_documents')
        file_path = os.path.join(base_output_dir, filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'Файл не найден'}), 404
        return send_file(
            file_path, 
            mimetype='application/pdf', 
            as_attachment=False
        )

    # Скачивание документа в формате .docx
    @app.route('/api/downloads/docx/<filename>')
    def download_docx(filename):
        base_output_dir = os.path.abspath('app/generated_documents')
        file_path = os.path.join(base_output_dir, filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'Файл не найден'}), 404
        return send_file(
            file_path, 
            as_attachment=True,
            download_name=f'{filename}.docx'
        )
    
    # Скачивание документа в формате .pdf
    @app.route('/api/downloads/pdf/<filename>')
    def download_pdf(filename):
        base_output_dir = os.path.abspath('app/generated_documents')
        file_path = os.path.join(base_output_dir, filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'Файл не найден'}), 404
        return send_file(
            file_path,
            as_attachment=True,
            download_name=f'{filename}.pdf'
        )
    
    @app.route('/api/extract-document', methods=['POST'])
    def extract_document():
        try:
            # Проверяем наличие файла
            if 'document' not in request.files:
                return jsonify({'error': 'Файл не загружен'}), 400
            
            file = request.files['document']
            document_type = request.form.get('document_type')

            # Проверяем, что файл не пустой
            if file.filename == '':
                return jsonify({'error': 'Выбран пустой файл'}), 400

            # Читаем файл в память
            file_content = file.read()

            # Определяем кодировку файла
            detected = chardet.detect(file_content)
            encoding = detected.get('encoding')  or 'utf-8'

            # Декодируем содержимое файла
            try:
                text = file_content.decode(encoding)
            except (UnicodeDecodeError, TypeError):
                return jsonify({'error': f'Не удалось декодировать файл с кодировкой {encoding}'}), 400

            # Пример извлечения данных (замените extract на вашу функцию)
            extracted_data = extract(text, document_type, model_name="llama3-8b-8192")

            if extracted_data is None:
                return jsonify({'error': 'Не удалось извлечь данные'}), 400

            return jsonify(extracted_data)

        except Exception as e:
            return jsonify({'error': str(e)}), 500