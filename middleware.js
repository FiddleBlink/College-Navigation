const userHandler = require('./services/user');

module.exports.isadmin = async (req, res, next) => {
    const loginid = req.session.login_id;
    //console.log(loginid);
    const userid = await userHandler.getLoggedUser(loginid);
    //console.log(userid);
    const user = await userHandler.getUseremail(userid['data'][0].userid);
    //console.log(user);
    const email = user['data'][0].email;
    //console.log(email);
    if(email.includes('admin'))
    { 
        next();
    }
    else
    {
        res.send("You are unauthorized");
    }
}