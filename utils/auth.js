const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");

function issueJWT(user) {
  const expiresIn = "4w";

  const payload = {
    sub: {
      _id: user.id,
      email: user.email,
      is_completed: user.is_completed,
      role: user.role,
      is_verified: user.is_verified,
      is_completed: user.is_completed,
      medical_center_id: user.medical_center_id || null,
    },
    iat: Date.now() / 1000,
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: expiresIn }
  );

  user.generateToken(signedToken, (err, user) => {
    if (err) console.log(err);
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_verified: user.is_verified,
      is_completed: user.is_completed,
      role: user.role,
      medical_center_id: user.medical_center_id || null,
    },
  };
}

function issueJWTForAdmin(admin) {
  const expiresIn = "4w";

  const payload = {
    sub: {
      _id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    iat: Date.now() / 1000,
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: expiresIn }
  );

  admin.generateToken(signedToken, (err, admin) => {
    if (err) console.log(err);
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      _id: admin._id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      role: admin.role,
    },
  };
}

const authMiddleware = (role_arr) => {
  return async (req, res, next) => {
    if (req.headers.authorization) {
      const tokenParts = req.headers.authorization.split(" ");

      if (
        tokenParts[0] === "Bearer" &&
        tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
      ) {
        try {
          const verification = jsonwebtoken.verify(
            tokenParts[1],
            process.env.ACCESS_TOKEN_SECRET
          );
          var user = await User.findById(verification.sub._id).select("+token");
          if (user.token === tokenParts[1]) {
            var temp = true;
            var role_list = "";
            role_arr.forEach((role) => {
              role_list = role_list + ", " + role;
              if (verification.sub.role === role) {
                req.jwt = verification;
                temp = false;
                next();
              }
            });
            if (temp) {
              res.status(200).json({
                code: 200,
                success: false,
                message: "You are not" + role_list,
              });
            }
          } else {
            res.status(200).json({
              code: 200,
              success: false,
              message: "You must login again to visit this route",
            });
          }
        } catch (error) {
          res
            .status(200)
            .json({ code: 200, success: false, message: "You must login again to visit this route" });
        }
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          message: "You must login to visit this route",
        });
      }
    } else {
      res.status(200).json({
        code: 200,
        success: false,
        message: "You must login to visit this route",
      });
    }
  };
};

const authMiddlewareForAdmin = (role_arr) => {
  return async (req, res, next) => {
    if (req.headers.authorization) {
      const tokenParts = req.headers.authorization.split(" ");

      if (
        tokenParts[0] === "Bearer" &&
        tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
      ) {
        try {
          const verification = jsonwebtoken.verify(
            tokenParts[1],
            process.env.ACCESS_TOKEN_SECRET
          );
          var admin = await Admin.findById(verification.sub._id).select("+token");
          if (admin.token === tokenParts[1]) {
            var temp = true;
            var role_list = "";
            role_arr.forEach((role) => {
              role_list = role_list + ", " + role;
              if (verification.sub.role === role) {
                req.jwt = verification;
                temp = false;
                next();
              }
            });
            if (temp) {
              res.status(200).json({
                code: 200,
                success: false,
                message: "You are not" + role_list,
              });
            }
          } else {
            res.status(200).json({
              code: 200,
              success: false,
              message: "You must login again to visit this route",
            });
          }
        } catch (error) {
          res
            .status(200)
            .json({ code: 200, success: false, message: "You must login again to visit this route" });
        }
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          message: "You must login to visit this route",
        });
      }
    } else {
      res.status(200).json({
        code: 200,
        success: false,
        message: "You must login to visit this route",
      });
    }
  };
};

const tokenValidation = async (token) => {
  try {
    if (token) {
      const tokenParts = token.split(" ");
      if (
        tokenParts[0] === "Bearer" &&
        tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
      ) {
        const verification = jsonwebtoken.verify(
          tokenParts[1],
          process.env.ACCESS_TOKEN_SECRET
        );
        var user = await User.findById(verification.sub._id).select("+token");
        if (user.token === tokenParts[1]) {
          return { validation: true, id: verification.sub._id };
        } else {
          return { validation: false, id: null };
        }
      } else {
        return { validation: false, id: null };
      }
    } else {
      return { validation: false, id: null };
    }
  } catch (error) {
    console.log(error);
    return { validation: false, id: null };
  }
};

module.exports.issueJWT = issueJWT;
module.exports.issueJWTForAdmin = issueJWTForAdmin;
module.exports.authMiddleware = authMiddleware;
module.exports.authMiddlewareForAdmin = authMiddlewareForAdmin;
module.exports.tokenValidation = tokenValidation;
