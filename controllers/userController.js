import { StatusCodes } from "http-status-codes";
import User from '../models/UserModel.js';
import Job from '../models/JobModel.js';
import cloudinary from 'cloudinary';
import {promises as fs} from 'fs';


export const getCurrentUser= async (req,res)=>{
    const user = await User.findById(req.user.userId);
    //using the instance method from User model to delete the password value before sending to client
    const userWithoutPassword= user.toJSON();
    res.status(StatusCodes.OK).json({user:userWithoutPassword});
}
export const getApplicationStats= async (req,res)=>{
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    res.status(StatusCodes.OK).json({users,jobs});
}
export const updateUser= async (req,res)=>{
    //we get access to the file being uploaded in req.file. 
    //console.log(req.file);

    //The data of the form is available in req.body
    const newUser = {...req.body};
    delete newUser.password

    //if the user upload a file
    if(req.file){
        //we upload the file to cloudinary, and we will get an object
        const response=await cloudinary.v2.uploader.upload(req.file.path);
        //after we successfully uploading the file to cloudinary, we delete the file we have uploaded to our server (to public/uploads folder) through the form in previous process
        await fs.unlink(req.file.path);

        //we grab the url of the picture we uploaded to cloudinary
        newUser.avatar=response.secure_url;
        //we grab the public_id of the picture we uploaded to cloudinary
        newUser.avatarPublicId=response.public_id;
    }
    
    //we update the user and the response will give the old instance of the user as we don't key it field {new:true} in the update method.
    const updatedUser=await User.findByIdAndUpdate(req.user.userId,newUser);

    //if the user upload a new file and previous was exist before upadating process, then we want to delete the previous file in cloudinary.
    if(req.file && updatedUser.avatarPublicId){
       await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId) 
    }
    res.status(StatusCodes.OK).json({msg:'update user'});
}