const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * 
    FROM location LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function getOne(place){
  const rows = await db.query(
    `SELECT * 
    FROM location WHERE loc_name='${place}'`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

async function create(location){
  let name = String(location.name);
  const result = await db.query(
    `INSERT INTO location 
    (loc_id, loc_name, loc_lat, loc_long) 
    VALUES 
    (${location.id},${location.name},${location.latitude}, ${location.longitude})`
  );

  let message = 'Error in creating new location';

  if (result.affectedRows) {
    message = 'New location created successfully';
  }

  return {message};
}

async function update(id, location){
  const result = await db.query(
    `UPDATE location 
    SET loc_id="${location.id}", loc_name=${location.name}, loc_lat=${location.latitude}, 
    loc_long=${location.longitude}
    WHERE loc_id=${id}` 
  );

  let message = 'Error in updating location';

  if (result.affectedRows) {
    message = 'location updated successfully';
  }

  return {message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM location WHERE loc_id=${id}`
  );

  let message = 'Error in deleting location ';

  if (result.affectedRows) {
    message = 'location deleted successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  getOne
}