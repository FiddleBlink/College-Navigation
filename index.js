const express = require('express');
const app = express();
const path = require('path')
const mysql = require('mysql2')
const location = require("./routes/location");
const ejsMate = require('ejs-mate');
const session = require('express-session');
const userHandler = require('./services/user');
const { render } = require('ejs');

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
    let index = Math.floor(Math.random() * 100);
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
  let index = Math.floor(Math.random() * 100);
  result = data['data'][0];
  let user = {
    login_id: index,
    ...result
  }
  if(data['data'][0].password == req.body.password)
  {
    await userHandler.insertLoggedInUser(user);
    req.session.user_id =  data['data'][0].user_id;
    res.redirect('/map')
  }else{
    res.redirect('/login');
  }
})


app.get('/logout',async(req,res)=>{
  const message = await userHandler.removeLoggedInUser(req.session.user_id);
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
    "destination":destination
  }
  let index = Math.floor(Math.random() * 100);

  //  await userHandler.createtravel({travel_id:index,source:req.body.source,destination:req.body.destination,user_id:req.session.user_id});
  //  res.json(data);
  res.render('home',{data})
//  res.json({source,destination});
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