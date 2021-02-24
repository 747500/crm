
import person from './person.js'

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
                        type: 'text',
                        name: 'price',
                        label: 'Цена',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                    {
                        name: 'address',
                        type: 'text',
                        label: 'Адрес',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                    {
                        name: 'description',
                        type: 'textarea',
                        label: 'Описание',
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
                        label: 'Тип жилья',
                        name: 'type',
                        type: 'select',
                        placeholder: '...',
                        labelClass: 'form-label',
                        inputClass: 'form-select',
                        options: [
                            {
                                value: 'new',
                                label: 'Новостройка'
                            },
                            {
                                value: 'second',
                                label: 'Вторичка'
                            },
                            {
                                value: 'room',
                                label: 'Комната'
                            },
                            {
                                value: 'part',
                                label: 'Доля'
                            },
                            {
                                value: 'house',
                                label: 'Дом'
                            },
                            {
                                value: 'partOfHouse',
                                label: 'Часть дома'
                            },
                            {
                                value: 'townhouse',
                                label: 'Таунхаус'
                            },
                            {
                                value: 'land',
                                label: 'Участок'
                            },
                        ]
                    },
                    {
                        label: 'Площадь',
                        name: 'area',
                        type: 'text',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                    {
                        name: 'balkony',
                        type: 'text',
                        label: 'Балкон/лоджия',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                    {
                        name: 'renovation',
                        type: 'text',
                        label: 'Ремонт',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                    {
                        name: 'view',
                        type: 'text',
                        label: 'Вид из окон',
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
                        label: 'Количество комнат',
                        name: 'roomsCount',
                        type: 'number',
                        labelClass: 'form-label',
                        inputClass: 'form-control',
                    },
                ]
            },
        ]
    }
]
