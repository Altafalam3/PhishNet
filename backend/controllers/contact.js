import contact from "../models/contact.js";


export const createcontact = async(req,res,next)=>{
    console.log(req.body)
    const newContact=new contact(req.body)
    try{
        const savedContact=await newContact.save()
        res.status(200).json(savedContact);
    }catch(err){
        next(err)
    }
}



export const getcontact = async (req, res, next) => {
    try {
        const a = await contact.find()
        res.status(200).json(a);
    } catch (err) {
        next(err)
    }
}