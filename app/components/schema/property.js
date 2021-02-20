
import person from './person.js'

export default [
    /*{
        type: 'group',
        name: 'property',
        label: 'Объект',
        children: [*/
            {
                class: 'oid',
                name: '_id',
                type: 'text',
                label: 'ID',
                readonly: true
            },
            {
                type: 'text',
                name: 'price',
                label: 'Цена'
            },
            {
                name: 'address',
                type: 'text',
                label: 'Адрес'
            },
            {
                label: 'Тип жилья',
                name: 'type',
                type: 'select',
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
                label: 'Количество комнат',
                name: 'roomsCount',
                type: 'number'
            },
            {
                label: 'Площадь',
                name: 'area',
                type: 'text'
            },
            {
                name: 'balkony',
                type: 'text',
                label: 'Балкон/лоджия'
            },
            {
                name: 'renovation',
                type: 'text',
                label: 'Ремонт'
            },
            {
                name: 'view',
                type: 'text',
                label: 'Вид из окон'
            },
            {
                name: 'description',
                type: 'textarea',
                label: 'Описание'
            },
        /*]
    },
    {
        type: 'group',
        name: 'owner',
        label: 'Собственник',
        children: person
    }
    */
]
