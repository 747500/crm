// Собираем индексируемый текст из документа рекурсивно.
// Учитываем вложенные объекты и массивы (например, contact[]); элементы массивов
// могут быть mongoose-документами (их поля лежат в _doc). Пропускаем служебные
// поля, BSON-типы (ObjectId), Date и внутренности mongoose ($__*).

const SKIP_KEYS = { kind: true, fts: true, _id: true, __v: true, _doc: true };

function collect(value, out, seen) {
  if (value === null || value === undefined) {
    return;
  }

  if (typeof value === 'string') {
    if (value.length) {
      out.push(value);
    }
    return;
  }

  if (typeof value !== 'object') {
    return;
  }

  // Date и BSON (ObjectId и пр. — у них есть _bsontype)
  if (value instanceof Date || value._bsontype) {
    return;
  }

  // защита от циклических ссылок (mongoose-поддокументы ссылаются на родителя)
  if (seen.has(value)) {
    return;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item) => collect(item, out, seen));
    return;
  }

  // mongoose Document/Subdocument хранит значения в _doc
  const target =
    value._doc && 'object' === typeof value._doc ? value._doc : value;

  Object.keys(target).forEach((key) => {
    // служебные поля и внутренности mongoose ($__, $isNew, $__parent, ...)
    if (SKIP_KEYS[key] || key.charCodeAt(0) === 36) {
      return;
    }

    collect(target[key], out, seen);
  });
}

function fts() {
  const out = [];

  collect(this._doc, out, new WeakSet());

  return out;
}

export default fts;
