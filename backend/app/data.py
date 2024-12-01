DOCUMENT_TYPES = [
    {
        'id': 'order_for_development',
        'name': 'Приказ на разработку',
        'description': 'Документ для инициации разработки проекта'
    },
    {
        'id': 'subscriber_service_contract',
        'name': 'Договор оказания абонентских услуг',
        'description': 'Договор на предоставление услуг на постоянной основе'
    },
    {
        'id': 'paid_service_contract',
        'name': 'Договор возмездного оказания услуг',
        'description': 'Договор между исполнителем и заказчиком на возмездной основе'
    },
    {
        'id': 'intellectual_property_order',
        'name': 'Приказ о разработке для настольной игры', # 'Приказ о разработке служебных результатов интеллектуальной деятельности для настольной игры',
        'description': 'Документ о служебных результатах интеллектуальной деятельности' #  'Документ о разработке служебных результатов интеллектуальной деятельности',
    }
]

DOCUMENT_FORMS = {
    'order_for_development': {
        'title': 'Приказ на разработку',
        'sections': [
            {
                'name': 'Информация об организации',
                'fields': [
                    { 
                        'name': 'organization_name', 
                        'label': 'Наименование организации', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Примерная организация',
                        'validationType': 'required'
                    },
                    { 
                        'name': 'ogrn', 
                        'label': 'ОГРН', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': '123456789012',
                        'validationType': 'ogrn'
                    },
                    { 
                        'name': 'inn', 
                        'label': 'ИНН', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': '987654321098',
                        'validationType': 'inn'
                    },
                    { 
                        'name': 'address', 
                        'label': 'Адрес', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'г. Москва, ул. Примерная, д. 1',
                        'validationType': 'required'
                    }
                ]
            },
            {
                'name': 'Параметры приказа',
                'fields': [
                    { 
                        'name': 'order_number', 
                        'label': 'Номер приказа', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': '1',
                        'validationType': 'number'
                    },
                    { 
                        'name': 'order_date', 
                        'label': 'Дата приказа', 
                        'type': 'date', 
                        'required': True,
                        'validationType': 'date'
                    }
                ]
            },
            {
                'name': 'Основание для разработки',
                'fields': [
                    { 
                        'name': 'employment_contract_section', 
                        'label': 'Раздел трудового договора', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': '1',
                        'validationType': 'number'
                    },
                    { 
                        'name': 'employment_contract_number', 
                        'label': 'Номер трудового договора', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': '10',
                        'validationType': 'number'
                    },
                    { 
                        'name': 'employment_contract_date', 
                        'label': 'Дата трудового договора', 
                        'type': 'date', 
                        'required': True,
                        'validationType': 'date'
                    }
                ]
            },
            {
                'name': 'Детали разработки',
                'fields': [
                    { 
                        'name': 'development_subject', 
                        'label': 'Предмет разработки', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Название программы',
                        'validationType': 'required'
                    },
                    { 
                        'name': 'deadline', 
                        'label': 'Срок исполнения', 
                        'type': 'date', 
                        'required': True,
                        'validationType': 'date'
                    },
                    { 
                        'name': 'worker_position', 
                        'label': 'Должность ответственного исполнителя', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Инженер-программист',
                        'validationType': 'required'
                    },
                    { 
                        'name': 'worker_name', 
                        'label': 'ФИО ответственного исполнителя', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Иванов Иван Иванович',
                        'validationType': 'fio'
                    }
                ]
            },
            {
                'name': 'Информация о работодателе',
                'fields': [
                    { 
                        'name': 'employer_organization_name', 
                        'label': 'Работодатель', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Примерная организация',
                        'validationType': 'required'
                    },
                    { 
                        'name': 'days_before_start', 
                        'label': 'Срок выплаты вознаграждения (не позднее)', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': '3',
                        'validationType': 'number_less_100'
                    }
                ]
            },
            {
                'name': 'Руководство и контроль',
                'fields': [
                    {
                        'name': 'project_leader_position', 
                        'label': 'Должность руководителя разработки', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Директор',
                        'validationType': 'required'
                    },
                    { 
                        'name': 'project_leader_name', 
                        'label': 'ФИО руководителя разработки', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Петров Петр Петрович',
                        'validationType': 'fio'
                    },
                    { 
                        'name': 'backup_control_position', 
                        'label': 'Должность доверенного лица', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Заместитель директора',
                        'validationType': 'required'
                    },
                    { 
                        'name': 'backup_control_name', 
                        'label': 'ФИО доверенного лица', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Сидоров Сидор Сидорович',
                        'validationType': 'fio'
                    }
                ]
            },
            {
                'name': 'Служебное задание',
                'fields': [
                    { 
                        'name': 'service_task_date', 
                        'label': 'Дата составления служебного задания', 
                        'type': 'date', 
                        'required': True,
                        'validationType': 'date'
                    },
                    { 
                        'name': 'service_task_number', 
                        'label': 'Номер служебного задания', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': '1',
                        'validationType': 'number'
                    },
                    { 
                        'name': 'service_task_organization_name', 
                        'label': 'Название организации', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Примерная организация',
                        'validationType': 'required'
                    },
                    { 
                        'name': 'service_task_ogranization_ogrn', 
                        'label': 'ОГРН организации', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': '123456789012',
                        'validationType': 'ogrn'
                    },
                    { 
                        'name': 'service_task_ogranization_inn', 
                        'label': 'ИНН организации', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': '987654321098',
                        'validationType': 'inn'
                    },
                    { 
                        'name': 'service_task_ogranization_address', 
                        'label': 'Адрес организации', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'г. Москва, ул. Примерная, д. 1',
                        'validationType': 'required' 
                    }
                ]
            },
            {
                'name': 'Подписант',
                'fields': [
                    { 
                        'name': 'signatory_position', 
                        'label': 'Должность подписанта', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Директор',
                        'validationType': 'required'
                    },
                    { 
                        'name': 'signatory_company', 
                        'label': 'Компания подписанта', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Примерная организация',
                        'validationType': 'required'
                    },
                    { 
                        'name': 'signatory_name', 
                        'label': 'ФИО подписанта', 
                        'type': 'text', 
                        'required': True,
                        'placeholder': 'Сидоров Сидор Сидорович',
                        'validationType': 'fio'
                    }
                ]
            }
        ]
    },
    # 'next_document': {

    # }
}; 