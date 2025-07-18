import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

//Authenticate
const authenticate = asyncHandler(async(req,res,next) => {
  let token;

  token = req.cookies.jwt;

  if(token) {
    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      req.user = await User.findById(decoded.userId).select('-password'); //Creating a user in req to be used in the user controller
      next();
      
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed!")
    }
  }else {
    res.status(401);
    throw new Error("Not authorized, no token!")
  }
});

//Check for admin
const authorizedAdmin = (req,res,next) => { 
  if(req.user && req.user.isAdmin) {
    next();
  }else {
    res.status(401).send("Not authorized as an admin")
  }
};

export {authenticate,authorizedAdmin};