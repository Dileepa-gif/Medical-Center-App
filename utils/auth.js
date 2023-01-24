const jsonwebtoken = require('jsonwebtoken');


  
function issueJWT(user) {
  const expiresIn = '2w';

  const payload = {
    sub: {
      id: user.id,
      email: user.email,
      is_completed: user.is_completed,
      role : user.role,
      is_verified : user.is_verified
    },
    iat: Date.now()
  };
  const signedToken = jsonwebtoken.sign( payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn});

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_verified : user.is_verified,
      role : user.role
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
          res.status(200).json({ code :200, success: false, message: "You must login to visit this route" });
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
