const express = require('express');
const app = express();
const path = require('path')
const mysql = require('mysql2')
const location = require("./routes/location");
const ejsMate = require('ejs-mate');
const session = require('express-session');
const userHandler = require('./services/user');
const { render } = require('ejs');
const { isadmin } = require('./middleware');


const locationHandler = require('./services/handler')

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret:'notagoodsecret',resave: false,saveUninitialized: true,}))
app.use("/location", location);




app.get('/register',(req,res)=>{
  res.render('register')
})

app.post('/register',async(req,res,next)=>{
  try {
    const body = req.body;
    let index = Math.floor(Math.random() * 1000);
    let user = {
      id :index,
      ...body
    }
    console.log(user);
    await userHandler.createUser(user);
    res.redirect('/login');
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
})




app.get('/login',(req,res)=>{
  res.render('login');
})

app.post('/login',async(req,res)=>{

  const body = req.body;
  let data =await userHandler.getUser(body);
  // console.log(data)
  let index = Math.floor(Math.random() * 1000);
  result = data['data'][0];
  let user = {
    login_id: index,
    ...result
  }
  //console.log(user);
  if(data['data'][0].password == req.body.password)
  {
    await userHandler.insertLoggedInUser(user);
    req.session.login_id =  user.login_id;
    res.redirect('/map')
  }else{
    res.redirect('/login');
  }
})




app.get('/logout',async(req,res)=>{
  const message = await userHandler.removeLoggedInUser(req.session.login_id);
  req.session.user_id = null;
  res.redirect('/login')
})





app.get("/map", (req, res) => {
  // if(!req.session.user_id)
  // {
  //   res.redirect('/login')
  // }
  res.render('index');
})





app.post('/route',async (req,res)=>{
  const body = req.body;
  const data1 = await locationHandler.getOne(body.source);
  //console.log(data1['data'][0]);
  let source = {
    lat:data1['data'][0]['loc_lat'],
    longi:data1['data'][0]['loc_long']
  }
  const data2 = await locationHandler.getOne(body.destination);
  let destination = {
    lat:data2['data'][0]['loc_lat'],
    longi:data2['data'][0]['loc_long']
  }
  const data = {
    "source" :source,
    "destination":destination,
  }
  let index = Math.floor(Math.random() * 1000);
  
  const userdata = await userHandler.getLoggedUser(req.session.login_id);
  const sourceid = await userHandler.getlocationid(req.body.source);
  const destinationid = await userHandler.getlocationid(req.body.destination);
  await userHandler.createtravel({travel_id:index,source:sourceid['data'][0].loc_id,destination:destinationid['data'][0].loc_id,purpose:req.body.purpose,user_id:userdata['data'][0].userid});
  
  // res.json(data);
  res.render('home',{data})
  //  res.json({source,destination});
})




app.post('/accept', async (req, res) => {
  
  const userdata = await userHandler.getLoggedUser(req.session.login_id);
  const comp = await userHandler.gettravelid(userdata['data'][0].userid);
  await userHandler.travelcompleted(comp['data'][0].travel_id);
  //console.log(comp);
  res.render('index',{status:true});
})

app.post('/reject', async (req, res) => {
  const userdata = await userHandler.getLoggedUser(req.session.login_id);
  const comp = await userHandler.gettravelid(userdata['data'][0].userid);
  await userHandler.travelincompleted(comp['data'][0].travel_id);
  //console.log(comp);
  res.render('index');
})




app.post('/getdashboard', isadmin, async (req, res)=>{
  // login logs, active user, travel log, all users, frequently visited
  const temp0 = await userHandler.getUsers();
  const alluser = temp0['data'];
  //console.log(alluser);
  console.log("**************************************************");
  const temp1 = await userHandler.getloginlogs();
  const alluserlogs = temp1['data'];
  //console.log(alluserlogs);
  console.log("**************************************************");
  const temp2 = await userHandler.getactiveUsers();
  const allactive = temp2['data'];
  //console.log(allactive);
  console.log("**************************************************");
  const temp3 = await userHandler.gettravellogs();
  const alltravellogs = temp3['data'];
  //console.log(alltravellogs);
  console.log("**************************************************");
  const temp4 = await userHandler.getfrequency();
  const mostvisited = temp4['data'];
  console.log(mostvisited);
  console.log("**************************************************");


  res.render('dashboard',{alluser,alluserlogs,allactive,alltravellogs,mostvisited});
})










/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
})