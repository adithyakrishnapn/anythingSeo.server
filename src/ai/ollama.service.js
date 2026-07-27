import ollama from "ollama";

export const generateResponse  = async(systemPrompt, userPrompt) => {
    try{
        const respone = await ollama.chat({
            model: "qwen2.5:7b",
            messages:[
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ]
        })
        return respone.message.content;
    } catch (error) {
        console.error("Error generating response:", error);
        throw error;
    }
}