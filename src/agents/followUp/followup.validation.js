const validateFollowUpAnalysis = (email) => {
    const requiredFields = ["subject", "body"];

    for(const field of requiredFields){
        if(!email[field]){
            throw new Error(`Missing field '${field}' in AI response.`);
        }
    }


    return true;
}


export default validateFollowUpAnalysis;