
export default [
    {
        component: 'div',
        class: 'form-content',
        children: [
            {
                component: 'div',
                class: 'form-column',
                children: [
                    {
                        name: 'lastName',
                        type: 'text',
                        label: 'Фамилия',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                    {
                        name: 'firstName',
                        type: 'text',
                        label: 'Имя',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                    {
                        name: 'middleName',
                        type: 'text',
                        label: 'Отчество',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                    {
                        name: 'birthDay',
                        type: 'date',
                        label: 'Дата рождения',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                    {
                        name: 'passport',
                        type: 'textarea',
                        label: 'Паспорт',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                ]
            },
            {
                component: 'div',
                class: 'form-column',
                children: [
                    {
                        type: 'group',
                        repeatable: true,
                        name: 'contact',
                        label: 'Контакты',
                        addLabel: '+',
                        groupAddMoreClass: 'btn btn-outline-success contact-add',
                        removeLabel: '🗑️',
                        groupRepeatableRemoveClass: 'btn btn-outline-danger contact-remove',
                        class: 'contact-list',
                        inputClass: 'form-control',
                        children: [
                            {
                                //label: 'Контакт',
                                type: 'text',
                                name: 'data',
                                placeholder: 'телефон, e-mail',
                                inputClass: 'form-control',
                            },
                            {
                                //label: 'Описание',
                                type: 'text',
                                name: 'description',
                                placeholder: 'описание',
                                inputClass: 'form-control',
                            }
                        ]
                    }
                ]
            }

        ]
    }
]
