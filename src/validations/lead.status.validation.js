import Lead from '../models/lead.model.js';
const leadToCustomerValidation = async(req, res, next) => {
    const {id} = req.params;
    const leadData = await Lead.findById(id);
    if(!leadData){
        return res.status(404).json({message: 'Lead not found'});
    }

    const status = leadData.status;
    if(status === 'converted'){
        return res.status(400).json({message: 'Lead is already converted to customer'});
    }
    next();

};

const statusValidation = async(req,res,next)=>{
    try{
        const { id } = req.params;
        const leadData = await Lead.findById(id);
        const status = leadData.status;

        if(status !== 'converted'){
            return res.status(400).json({message: 'Lead is not converted to customer'});
        }
        next();
    }catch(error){
        return res.status(500).json({message: 'Internal server error'});
    }
}


export { leadToCustomerValidation, statusValidation };