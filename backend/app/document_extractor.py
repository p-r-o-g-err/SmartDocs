from groq import Groq
from .data import DOCUMENT_FORMS
import json

GROQ_API_KEY='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'

def extract_document_info(text, model_name="llama3-8b-8192"):
    """
    Извлечение информации из текста с использованием указанной модели
    """
    
    client = Groq(
        api_key=GROQ_API_KEY, # os.environ.get("GROQ_API_KEY"),
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": text
            }
        ],
        model=model_name,
    )

    return chat_completion.choices[0].message.content 

def get_description_fields(document_type):
    result = ''
    # Проходим по всем секциям и полям
    for section in DOCUMENT_FORMS[document_type]['sections']:
        for field in section['fields']:
            result += f"{field['name']} - {field['label']} - {field['type']}\n" # - Пример: {field['placeholder']}\n"
    
    return result

def get_template_output_json(document_type):
    result = {}
    # Проходим по всем секциям и полям
    for section in DOCUMENT_FORMS[document_type]['sections']:
        for field in section['fields']:
            result[field['name']] = None
    
    return result


def extract(text, document_type, model_name="llama3-8b-8192"):
    """
    Извлечение информации из текста с использованием указанной модели
    """ 
    template_output_json = get_template_output_json(document_type)
    # description_fields = get_description_fields(document_type)
    prompt = (
    f"Извлечь информацию из приведенного текста для заполнения JSON следующей структуры: {template_output_json}. "
    f"Текст для анализа: {text}. Верни только JSON! "
    f"Если данные для какого-либо ключа отсутствуют, установи значение null. Ничего кроме JSON не добавлять в ответ."
    f"В JSON значения полей с датами должны быть в формате YYYY-MM-DD."
    f"Начни ответ открывающейся фигурной скобкой ({{) и обязательно закончи закрывающейся фигурной скобкой (}})."
    )

    #print('Примерное число токенов: ', len(prompt.split()))
    #print(prompt)
    response = extract_document_info(prompt, model_name=model_name)

    # print(response)
    # Преобразование в json с проверкой
    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        return None
    return result

document_type = 'order_for_development'
text = ""
extract(text, document_type)
