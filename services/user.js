const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getUser(user){
  const rows = await db.query(
    `SELECT * 
    FROM users WHERE email='${user.email}'`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}
async function createUser(user)
{ 
  const result = await db.query(
    `INSERT INTO users
    (user_id, fname, lname, phone, email, password) 
    VALUES 
    (${user.id},'${user.fname}','${user.lname}',${user.phoneNumber},'${user.email}','${user.password}')`
  );

  let message = 'Error in creating new location';

  if (result.affectedRows) {
    message = 'New user created successfully';
  }

  return {message};
}


async function insertLoggedInUser(user)
{ 
  console.log(user)
  const result = await db.query(
    `INSERT INTO Active
    (Login_id, userid) 
    VALUES 
    (${user.login_id}, ${user.User_id})`
  );

  let message = 'Error in creating new location';

  if (result.affectedRows) {
    message = 'New user created successfully';
  }

  return {message};
}

async function removeLoggedInUser(id){
  const result = await db.query(
    `DELETE FROM active WHERE Login_id=${id}`
  );

  let message = 'Error in deleting logged in user ';

  if (result.affectedRows) {
    message = 'user deleted successfully';
  }

  return {message};
}

async function getLoggedUser(loginid){
  const rows = await db.query(
    `SELECT * 
    FROM active WHERE Login_id='${loginid}'`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}


async function getlocationid(user){
  const rows = await db.query(
    `SELECT loc_id 
    FROM location WHERE Loc_Name='${user}'`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}


async function createtravel(user)
{ 
  const result = await db.query(
    `INSERT INTO travel 
    (T_Userid, source, desti, travel_id, purpose) 
    VALUES 
    ('${user.user_id}','${user.source}','${user.destination}',${user.travel_id},'${user.purpose}')`
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
  getLoggedUser,
  createtravel,
  getlocationid
}