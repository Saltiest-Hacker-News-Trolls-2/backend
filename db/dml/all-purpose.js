const kx = require("../db_interface");

module.exports = {
  getOneBy,
  getAllBy,
  add,
  update,
  remove,
  findChildren
};

function getOneBy(filter, table, fields = "*") {
  return kx
    .select(fields)
    .from(table)
    .where(filter)
    .first();
}

function getAllBy(filter, table, fields = "*") {
  return kx
    .select(fields)
    .from(table)
    .where(filter);
}

function add(data, table, fields = "*") {
  return kx(table).insert(data, fields);
}

function update(changes, id, table) {
  return kx(table)
    .where("id", id)
    .update(changes);
}

function remove(id, table) {
  return kx(table)
    .where("id", id)
    .del();
}

function findChildren(id) {
  return kx("steps")
    .join("schemes", "schemes.id", "steps.scheme_id")
    .select("schemes.scheme_name", "steps.instructions", "steps.step_number")
    .where("scheme_id", id)
    .orderBy("steps.step_number");
}
