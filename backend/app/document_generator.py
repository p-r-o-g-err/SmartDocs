from docxtpl import DocxTemplate
import os
from datetime import datetime
from docx2pdf import convert
import pythoncom

def number_to_number_with_desc(num_str):
    num = int(num_str)
    
    number_words = {
        1: 'одного', 2: 'двух', 3: 'трех', 4: 'четырех', 5: 'пяти',
        6: 'шести', 7: 'семи', 8: 'восьми', 9: 'девяти', 10: 'десяти',
        11: 'одиннадцати', 12: 'двенадцати', 13: 'тринадцати', 14: 'четырнадцати',
        15: 'пятнадцати', 16: 'шестнадцати', 17: 'семнадцати', 18: 'восемнадцати',
        19: 'девятнадцати', 20: 'двадцати',
        30: 'тридцати', 40: 'сорока', 50: 'пятидесяти', 60: 'шестидесяти',
        70: 'семидесяти', 80: 'восьмидесяти', 90: 'девяноста'
    }
    
    def get_description(num):
        if num <= 20:
            return number_words.get(num, str(num))
        else:
            tens = (num // 10) * 10
            ones = num % 10
            if ones == 0:
                return number_words[tens]
            else:
                return f"{number_words[tens]} {number_words[ones]}"
    
    description = get_description(num)
    return f"{num} ({description})"

def format_date(date_str):
    date = datetime.strptime(date_str, '%Y-%m-%d')
    return f"«{date.day:02d}»____{date.month:02d}____ {date.year} г."

def prepare_data_for_order_for_development(data):
    data['order_date'] = format_date(data['order_date'])
    data['employment_contract_date'] = format_date(data['employment_contract_date'])
    data['deadline'] = format_date(data['deadline'])
    data['service_task_date'] = format_date(data['service_task_date'])
    data['days_before_start'] = number_to_number_with_desc(data['days_before_start'])
    return data

def generate_document(document_type, document_data):
    base_template_dir = os.path.abspath('app/templates')
    base_output_dir = os.path.abspath('app/generated_documents')
    
    # Выбор шаблона в зависимости от типа документа
    template_mapping = {
        'order_for_development': 'order_for_development.docx',
        #'service_task': 'service_task.docx'
    }
    # Получаем относительный путь к шаблону и преобразуем его в абсолютный
    template_name = template_mapping.get(document_type)
    if not template_name:
        raise ValueError(f'Неподдерживаемый тип документа: {document_type}')

    template_path = os.path.join(base_template_dir, template_name)
    if not os.path.isfile(template_path):
        raise FileNotFoundError(f'Шаблон не найден по пути: {template_path}')
    # Преобразование данных для шаблона
    if document_type == 'order_for_development':
        document_data = prepare_data_for_order_for_development(document_data)
    
    # Загрузка шаблона
    doc = DocxTemplate(template_path)
    # Заполнение шаблона
    doc.render(document_data)
    
    # Сохранение сгенерированного документа
    os.makedirs(base_output_dir, exist_ok=True)
    output_path = os.path.join(base_output_dir, f'{document_type}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.docx')
    
    doc.save(output_path)
    return output_path

def convert_docx_to_pdf(docx_path):
    # Инициализация COM для текущего потока
    pythoncom.CoInitialize()
   # Конвертация в PDF
    output_pdf_path = docx_path.replace('.docx', '.pdf')
    convert(docx_path, output_pdf_path)
    return output_pdf_path

if __name__ == '__main__':
    document_type = 'order_for_development'
    document_data = {
        'organization_name': 'ТЕСТОВАЯ ОРГАНИЗАЦИЯ',
        'ogrn': '123456789012',
        'inn': '987654321098',
        'address': 'г. Тестовый, ул. Тестовая, д. 1',
        'order_number': '1',
        'order_date': '2024-01-15',
        'employment_contract_section': '1',
        'employment_contract_number': '1',
        'employment_contract_date': '2024-01-15',
        'development_subject': 'Название ПО',
        'deadline': '2024-01-15',
        'worker_position': 'Инженер-программист',
        'worker_name': 'Иванов И.И.',
        'employer_organization_name': 'Тестовая организация',
        'days_before_start': '5',
        'project_leader_position': 'Директор',
        'project_leader_name': 'Петров П.П.',
        'backup_control_position': 'Заместитель директора',
        'backup_control_name': 'Сидоров С.С.',
        'service_task_date': '2024-01-15',
        'service_task_number': '1',
        'service_task_organization_name': 'Тестовая организация',
        'service_task_ogranization_ogrn': '123456789012',
        'service_task_ogranization_inn': '987654321098',
        'service_task_ogranization_address': 'г. Тестовый, ул. Тестовая, д. 1',
        'signatory_position': 'Директор',
        'signatory_company': 'Тестовая организация',
        'signatory_name': 'Сидоров С.С.'
    }
    
    output_path = generate_document(document_type, document_data)
    output_path = convert_docx_to_pdf(output_path)  
    print(f'Документ сохранен по пути: {output_path}')