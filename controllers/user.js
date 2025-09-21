const User =require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    try {
        let {email,username,password}=req.body;
    const newUser= new User({email,username});
    const registeredUser=  await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","Welcom to Wonderlust");
    res.redirect("/listings");
    });

    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm=(req,res)=>{
   res.render("user/login.ejs");
};

module.exports.login=async(req,res)=>{
         req.flash("success","Welcom to Wonderlust,You are logged in");
         redirectUrl=res.locals.redirectUrl ||"/listings";
         res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if (err){
            return next();
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });

};