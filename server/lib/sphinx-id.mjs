// Уникальный числовой id для Sphinx RT-индекса.
// Младшие 12 hex-цифр ObjectId = 48 бит: влезает в безопасный Number и
// практически исключает коллизии (в отличие от ctime.getTime(), где два
// документа, созданных в одну миллисекунду, делили id).
export function sphinxId(doc) {
  return parseInt(doc._id.toString().slice(-12), 16);
}
