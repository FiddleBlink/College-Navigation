const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getUser(user){
  const rows = await db.query(
    `SELECT * 
    FROM user WHERE email='${user.email}'`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}
async function createUser(user)
{ 
  const result = await db.query(
    `INSERT INTO user 
    (user_id, name, phone, email, password) 
    VALUES 
    (${user.id},'${user.username}',${user.phoneNumber},'${user.email}','${user.password}')`
  );

  let message = 'Error in creating new location';

  if (result.affectedRows) {
    message = 'New user created successfully';
  }

  return {message};
}


async function insertLoggedInUser(user)
{ console.log(user)
  const result = await db.query(
    `INSERT INTO login 
    (login_id, username, password, user_id) 
    VALUES 
    (${user.login_id},'${user.name}','${user.password}',${user.user_id})`
  );

  let message = 'Error in creating new location';

  if (result.affectedRows) {
    message = 'New user created successfully';
  }

  return {message};
}

async function removeLoggedInUser(id){
  const result = await db.query(
    `DELETE FROM login WHERE user_id=${id}`
  );

  let message = 'Error in deleting logged in user ';

  if (result.affectedRows) {
    message = 'user deleted successfully';
  }

  return {message};
}

async function createtravel(user)
{ 
  const result = await db.query(
    `INSERT INTO travel 
    (user_id, source, destination, travel_id) 
    VALUES 
    ('${user.user_id}','${user.source}','${user.destination}',${user.travel_id})`
  );

  let message = 'Error in creating new travel';

  if (result.affectedRows) {
    message = 'New travel created successfully';
  }

  return {message};
}



module.exports = {
  createUser,
  getUser,
  insertLoggedInUser,
  removeLoggedInUser,
  createtravel
}