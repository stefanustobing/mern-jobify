import { BadRequestError, UnauthenticatedError, UnauthorizedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req,res,next)=>{
    //access the token sent back by client to server, if there is token
    const {token} = req.cookies;
    if (!token) throw new UnauthenticatedError ('authentication invalid');
    try {
        //When the verification is match, we will get the payload data we set when we create a token
        const {userId,role}= verifyJWT(token);

        const testUser=userId==='65677aa310d6edf72bc336d9';

        //Creating user object with userId and role as key in the req
        req.user={userId,role,testUser};

        next();
    } catch (error) {
        throw new UnauthenticatedError ('authentication invalid');
    }
}

export const authorizePermissions = (...roles)=>{ //creating an array of roles
    return (req,res,next)=>{
        //console.log(roles); roles spit out an array
        if(!roles.includes(req.user.role)) throw new UnauthorizedError ('Unauthorized to access this route')
        next();

    }
}

export const checkForTestUser= (req,res,next)=>{
    if(req.user.testUser) throw new BadRequestError ('Demo user are read only mode!')
    next();
}