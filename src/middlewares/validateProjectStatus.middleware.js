import {getProjectById} from "../services/project.service.js";

export const projectCompleted = async(req,res,next)=>{
    try{
        const {id} = req.params;
        const projectData = await getProjectById(id);
        const status = projectData.status;
        if(!projectData){
            return res.status(404).json({message: 'Project not found'});
        }
        if(status === 'completed'){
            return res.status(400).json({message: 'Project is already completed'});
        }
        next();

    }catch(error){
        console.log("Project Completed Middleware Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }   
}