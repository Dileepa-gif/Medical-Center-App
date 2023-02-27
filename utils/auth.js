const jsonwebtoken = require('jsonwebtoken');
const User = require("../models/user.model");


  
function issueJWT(user) {
  const expiresIn = '4w';

  const payload = {
    sub: {
      _id: user.id,
      email: user.email,
      is_completed: user.is_completed,
      role : user.role,
      is_verified : user.is_verified,
      is_completed : user.is_completed,
      medical_center_id : user.medical_center_id || null
    },
    iat: Date.now()/1000
  };

  const signedToken = jsonwebtoken.sign( payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn});

  user.generateToken(signedToken,(err,user)=>{
      if(err) console.log(err);
  }); 

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_verified : user.is_verified,
      is_completed : user.is_completed,
      role : user.role,
      medical_center_id : user.medical_center_id || null
    }
  }
}



const authMiddleware = (role_arr) => {
  return async (req, res, next) => {
    if (req.headers.authorization) {
      const tokenParts = req.headers.authorization.split(' ');
      
      if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
        try {
          const verification = jsonwebtoken.verify(tokenParts[1], process.env.ACCESS_TOKEN_SECRET);
          var user = await User.findById(verification.sub._id).select("+token");
          if(user.token === tokenParts[1]){
            var temp = true;
            var role_list = '';
            role_arr.forEach((role) => {
              role_list=role_list + ', ' +role
              if(verification.sub.role=== role){
                req.jwt = verification;
                temp = false;
                next();
              }
            });
            if(temp){
              res.status(200).json({ code :200, success: false, message: "You are not" +  role_list});
            }
          } else{
            res.status(200).json({ code :200, success: false, message: "You must login again to visit this route" });
          } 
        } catch (error) {
          res.status(200).json({ code :200, success: false, message: error.message });
        }
  
      } else {
        res.status(200).json({ code :200, success: false, message: "You must login to visit this route" });
      }
    } else {
      res.status(200).json({ code :200, success: false, message: "You must login to visit this route" });
    }
  }
}




module.exports.issueJWT = issueJWT;
module.exports.authMiddleware = authMiddleware;
