import multer from 'multer';
import DataParser from 'datauri/parser.js';
import path from 'path';

//we create storage, there two options i.e. memory or disk storage.
//memory storage: we save our image as buffer. But we cannot directly push a buffer to cloudinary (therefore we need extra package that will take the buffer and turn it into something that cloudinary can work with)

//================================================================================================
//we go for disk storage, because we will need that file in order to send it to cloudinary
// const storage= multer.diskStorage({
//     destination: (req,file,cb) =>{
//         cb(null,'public/uploads');
//     },
//     filename: (req,file,cb)=>{
//         const fileName=file.originalname;
//         cb(null,fileName);
//     }
// })
//================================================================================================

//memory storage=======================================
const storage= multer.memoryStorage()
//=====================================================




const upload = multer({storage});

const parser = new DataParser();

//we add file to req object (req.file)
export const formatImage = (file)=>{
    //console.log(file);
    const fileExtension=path.extname(file.originalname).toString();
    return parser.format(fileExtension, file.buffer).content;
};

export default upload;