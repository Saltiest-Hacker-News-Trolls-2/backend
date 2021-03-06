const kx = require('../db_interface')

module.exports = {
  getOneBy,
  getAllBy,
  add,
  update,
  remove
}

function getOneBy(filter, table, fields = '*') {
  return kx(table)
    .where(filter)
    .select(fields)
    .first()
}

function getAllBy(filter, table, fields = '*') {
  return kx
    .select(fields)
    .from(table)
    .where(filter)
}

function add(data, table, fields = '*') {
  return kx(table).insert(data, fields)
}

function update(changes, id, table) {
  return kx(table)
    .where('id', id)
    .update(changes)
}

function remove(id, table) {
  return kx(table)
    .where('id', id)
    .del()
}
