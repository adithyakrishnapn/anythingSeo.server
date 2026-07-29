const validateTaskCreation = (taskData) => {
     const requiredFields = ["title", "description", "priority", "dueDate",];
     for (const field of requiredFields) {
         if (!(field in taskData)) {
             throw new Error(`Missing field '${field}' in task data.`);
         }
     }

};

export { validateTaskCreation };