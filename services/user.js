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

async function travelcompleted(id)
{
  const result = await db.query(
    `UPDATE TRAVEL
    SET IS_COMP=1 WHERE travel_id=${id}`
    )
    return true;
}

async function travelincompleted(id)
{
  const result = await db.query(
    `UPDATE TRAVEL
    SET IS_COMP=0 WHERE travel_id=${id}`
    )
    return true;
}


async function gettravelid(userid){
  const rows = await db.query(
    `SELECT travel_id 
    FROM travel WHERE T_Userid='${userid}'`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

async function getUsers(){
  const rows = await db.query(
    `SELECT * 
    FROM users;`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

async function getloginlogs(){
  const rows = await db.query(
    `select User_id,login_date,status,fname,lname,email 
    from login_logs inner join users on userid=User_id order by login_date desc;`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

async function getactiveUsers(){
  const rows = await db.query(
    `select Login_id,fname,lname,email from active inner join users on userid = User_id;`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

async function gettravellogs(){
  const rows = await db.query(
    `select travelid,fname,lname,Travel_date,status,purpose,st.Loc_name as source,fin.Loc_name 
    as destination from travel_logs inner join travel on travelid = travel_id inner join users on User_id=T_Userid join location st on source=st.Loc_id join location fin on desti=fin.Loc_id order by travel_date desc;`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

async function getfrequency(){
  const rows = await db.query(
    `select Loc_Name, count(Travel_id) as count from travel inner join location on desti=loc_id group by Loc_Name order by count desc limit 4;`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

module.exports = {
  createUser,
  getUser,
  insertLoggedInUser,
  removeLoggedInUser,
  getLoggedUser,
  createtravel,
  getlocationid,
  gettravelid,
  travelcompleted,
  getUsers,
  getloginlogs,
  getactiveUsers,
  gettravellogs,
  getfrequency,
  travelincompleted
}