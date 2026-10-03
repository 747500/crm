export type FieldType = 'text' | 'textarea' | 'date' | 'number' | 'select';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
}

export interface KindDef {
  kind: string;
  title: string;
  nested: string;
  fields: FieldDef[];
  listKeys: string[];
  special?: 'contact' | 'owner';
}

export const KINDS: Record<string, KindDef> = {
  person: {
    kind: 'person',
    title: 'Контакты',
    nested: 'person',
    listKeys: ['lastName', 'firstName', 'middleName'],
    special: 'contact',
    fields: [
      { name: 'lastName', label: 'Фамилия', type: 'text' },
      { name: 'firstName', label: 'Имя', type: 'text' },
      { name: 'middleName', label: 'Отчество', type: 'text' },
      { name: 'birthDay', label: 'Дата рождения', type: 'date' },
      { name: 'comments', label: 'Комментарии', type: 'textarea' },
    ],
  },
  property: {
    kind: 'property',
    title: 'Объекты',
    nested: 'property',
    listKeys: ['address'],
    special: 'owner',
    fields: [
      { name: 'address', label: 'Адрес', type: 'text' },
      { name: 'price', label: 'Цена', type: 'text' },
      {
        name: 'type',
        label: 'Тип жилья',
        type: 'select',
        options: [
          'new',
          'second',
          'room',
          'part',
          'house',
          'partOfHouse',
          'townhouse',
          'land',
        ],
      },
      { name: 'area', label: 'Площадь', type: 'text' },
      { name: 'balkony', label: 'Балкон/лоджия', type: 'text' },
      { name: 'renovation', label: 'Ремонт', type: 'text' },
      { name: 'view', label: 'Вид из окон', type: 'text' },
      { name: 'roomsCount', label: 'Комнат', type: 'number' },
      { name: 'description', label: 'Описание', type: 'textarea' },
    ],
  },
  contract: {
    kind: 'contract',
    title: 'Сделки',
    nested: 'contract',
    listKeys: ['title'],
    fields: [
      { name: 'title', label: 'Суть', type: 'text' },
      { name: 'description', label: 'Описание', type: 'textarea' },
      { name: 'property', label: 'Объект', type: 'text' },
    ],
  },
};

export function docTitle(doc: any, def: KindDef): string {
  const nested = doc?.[def.nested] ?? {};
  const t = def.listKeys
    .map((k) => nested[k])
    .filter(Boolean)
    .join(' ');
  return t || doc?._id || '';
}
