
export default [
    {
        name: '_id',
        type: 'text',
        label: 'ID',
        readonly: true,
        class: 'oid'
    },
    {
        name: 'lastName',
        type: 'text',
        label: 'Фамилия'
    },
    {
        name: 'firstName',
        type: 'text',
        label: 'Имя'
    },
    {
        name: 'middleName',
        type: 'text',
        label: 'Отчество'
    },
    {
        name: 'birthDay',
        type: 'date',
        label: 'Дата рождения'
    },
    {
        name: 'passport',
        type: 'textarea',
        label: 'Паспорт'
    },
    {
        type: 'group',
        repeatable: true,
        name: 'contact',
        label: 'Контакты',
        addLabel: 'Добавить',
        removeLabel: 'Убрать',
        class: 'contact-list',
        children: [
            {
                label: 'Контакт',
                type: 'text',
                name: 'data',
            },
            {
                label: 'Описание',
                type: 'text',
                name: 'description',
            }
        ]
    },
    {
        name: 'submit',
        type: 'submit',
        label: 'Сохранить'
    }
]
