const jsonwebtoken = require('jsonwebtoken');


  
function issueJWT(user) {
  const expiresIn = '4w';

  const payload = {
    sub: {
      _id: user._id,
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
  return (req, res, next) => {
    if (req.headers.authorization) {
      const tokenParts = req.headers.authorization.split(' ');
      
      if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
  
  
        try {
          const verification = jsonwebtoken.verify(tokenParts[1], process.env.ACCESS_TOKEN_SECRET);
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
  
        } catch (err) {
          res.status(200).json({ code :200, success: false, message: "Your login is expired. Please login again" });
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
