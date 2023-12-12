import Job from "../models/JobModel.js";
import {StatusCodes} from 'http-status-codes';
import mongoose from "mongoose";
import day from 'dayjs';

export const getAllJobs = async (req,res)=>{
    const {search,jobStatus,jobType,sort}=req.query;


    const queryObject={
        createdBy:req.user.userId
    };

    if (search){
        queryObject.$or =[
            {position:{$regex:search, $options:'i'}},
            {company:{$regex:search,$options:'i'}}
        ]
    };

   if (jobStatus && jobStatus !== 'all'){
    queryObject.jobStatus=jobStatus;
   };
   
   if (jobType && jobType !== 'all'){
    queryObject.jobType=jobType;
   };

   const sortOptions={
    newest:'-createdAt',
    oldest:'createdAt',
    'a-z':'position',
    'z-a':'-position'
   };

    const sortKey=sortOptions[sort] || sortOptions.newest;

    //setup pagination
    const page=Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 10;
    const skip=(page-1) * limit;

    const jobs= await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit);

    const totalJobs= await Job.countDocuments(queryObject);
    const numOfPages= Math.ceil(totalJobs/limit);

    res.status(StatusCodes.OK).json({totalJobs,numOfPages, currentPage:page, jobs});
};

export const createJob = async (req,res)=>{
    //validation has been done at validationMiddleware
    req.body.createdBy=req.user.userId;
    const job= await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
};

export const getJob = async (req,res)=>{
    //validation has been done at validationMiddleware
    const job =await Job.findById(req.params.id);
    res.status(StatusCodes.OK).json({job})
};

export const updateJob = async (req,res)=>{
    //validation has been done at validationMiddleware
    const updatedJob = await Job.findOneAndUpdate({_id:req.params.id},req.body,{new:true,runValidators:true});
    res.status(StatusCodes.OK).json({msg:'job modified',job:updatedJob});
};

export const deleteJob= async (req,res)=>{
    //validation has been done at validationMiddleware
    const removedJob = await Job.findOneAndDelete({_id:req.params.id});
    res.status(StatusCodes.OK).json({msg:'job deleted', job:removedJob});
}

export const showStats= async (req,res)=>{
    let stats = await Job.aggregate([
        //we need to convert the req.user.userId as String to ObjecId type, as it dictated in JobModel.
        {$match:{createdBy:new mongoose.Types.ObjectId(req.user.userId)}},
        {$group:{_id:'$jobStatus',count:{$sum:1}}}
    ]);
    // [
    //     { _id: 'pending', count: 38 },
    //     { _id: 'interview', count: 24 },
    //     { _id: 'declined', count: 38 }
    // ]

    stats= stats.reduce((total,item)=>{
        total[item._id]=item.count;
        return total;
    },{});

    //{ pending: 38, interview: 24, declined: 38 }

    const defaultStats={
        pending:stats.pending || 0,
        interview:stats.interview || 0,
        declined:stats.declined || 0
    };

    let monthlyApplications= await Job.aggregate([
        {$match:{createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {$group:
            {
                // The way in mongo to pull out year and month from a date
                _id:{year:{$year:'$createdAt'}, month:{$month:'$createdAt'}},
                count:{$sum:1}
            }
        },
        {$sort:{'_id.year':-1,'_id.month':-1}},
        {$limit:6}
    ]);

    monthlyApplications=monthlyApplications.map((item)=>{
        const {_id:{year,month},count}=item;

        const date= day().month(month -1).year(year).format('MMM YY');
        return (
            {date,count}
        )
    }).reverse();


    // let monthlyApplications =[
    //     {
    //         date:'May 23',
    //         count:12
    //     },
    //     {
    //         date:'Jun 23',
    //         count:9
    //     },
    //     {
    //         date:'Jul 23',
    //         count:3
    //     },
    // ];
    res.status(StatusCodes.OK).json({defaultStats,monthlyApplications});
}