
import person from './person.js'

export default [
    {
        type: 'group',
        name: 'property',
        label: 'Объект',
        children: [
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
                name: 'description',
                type: 'textarea',
                label: 'Описание'
            },
        ]
    },
    {
        type: 'group',
        name: 'owner',
        label: 'Собственник',
        children: person
    }
]
