import multer from 'multer';

//we create storage, there two options i.e. memory or disk storage.
//we go for dist storage, because we will need that file in order to send it to cloudinary
const storage= multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'public/uploads');
    },
    filename: (req,file,cb)=>{
        const fileName=file.originalname;
        cb(null,fileName);
    }
})

const upload = multer({storage});

export default upload;