/* console.log("starting"); */
document.addEventListener("DOMContentLoaded",function(){
    let chatLog=document.getElementById("chat-log");
    let scrollPosition = 0;
    let sendButton = document.getElementById("send-button");
    let userInput = document.querySelector(".user-input")
    let apiKey = "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"
    let apiUrl = "https://api.openai.com/chat/completions"

    //const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    const endpoint =  "https://instanciachatgpt.openai.azure.com/";  // process.env["AZURE_OPENAI_ENDPOINT"] ;
    const azureApiKey = "2993309da8914082b131e6a42b25219c"; //process.env["AZURE_OPENAI_KEY"] ;

    function displayMessage(type,message){
        let messageContainer=document.createElement("div");
        console.log("Creando el <div>");
        messageContainer.classList.add("message",type);
        console.log("estoy en el message container");
        let messageText=document.createElement("p");
        messageText.textContent=message;
        messageContainer.appendChild(messageText);
        chatLog.appendChild(messageContainer);
        chatLog.scrollTop=chatLog.scrollHeight;
    }

    function checkInternetConnection(){
        return navigator.onLine;
    }

    console.log("Checking internet connection", checkInternetConnection());

    function showLoadingIndicator(){
        document.getElementById("loading-indicator").style.display="flex";
    }
    function hideLoadingIndicator(){
        document.getElementById("loading-indicator").style.display="none";
    }

    function scrollChatLog(){
        let isScrolledToBottom=chatLog.scrollHeight - chatLog.clientHeight <= chatLog.scrollTop + 1;
        chatLog.scrollTop = chatLog.scrollHeight;
        if(isScrolledToBottom){
            restoreScrollPosition();
        }
    }

    function restoreScrollPosition(){
        chatLog.scrollTop = scrollPosition;
    }

    function processSpecialCommand(command){
        if(command === "/help"){
            displayMessage("sent", "You can find help at azure.openai.com");
        }else if(command === "/about"){
            displayMessage("sent", "Azure OpenAI ChatGPT version 4.0 Model davinci");
        }else{
            displayMessage("sent", "Lo siento, no entiendo el comando, prueba a introducir /help para obtener ayuda");
        }
    }

    async function sendChatMessage(message){
        let data = {
            "model" : "gpt-35-turbo", //"NanforGPT-35-turbo",
            "messages" : [
                {role: "system", content: "You are a helpful assistant." },
                { role: "user", content: message }
            ]
        };
        try {
            let response = await fetch(apiUrl,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${apiKey}`,
                },
                body:JSON.stringify(data)
            });
            if (!response.ok){
                throw new Error("Se ha producido un error al enviar el mensaje")
            }
            let responseData=await response.json();
            if(responseData && responseData.choices && responseData.choices.length > 0){
                let botResponse=responseData.choices[0].message.content;
                displayMessage("received",botResponse);                
            }
        } catch (error) {
            console.error(error);
            displayMessage("error", "Se ha producido un error al obtener la respuesta")
        }
    }

    sendButton.addEventListener("click", async function(){
        let userMessage = userInput.value.trim();
        // console.log(userMessage);
        if (userMessage !== ""){
            // console.log("mensaje vacio");
            if(!checkInternetConnection){
                // console.log("verificando conexion");
                displayMessage("Error", "Sin conexion");
                return;
            }else{
                if(userMessage.startsWith("/")){
                    // console.log("si comando especial con /");
                    const command = userMessage.toLowerCase();
                    processSpecialCommand(command);
                    userInput.value = "";
                }else{
                    if(apiKey){
                        console.log("check api key");
                        try {
                            console.log("mensaje usuario enviado");
                            displayMessage("sent", userMessage);
                            let response = await sendChatMessage(userMessage);
                            console.log(response);
                            if(response){
                                
                                displayMessage("received",response);
                                scrollChatLog();
                            }
                        } catch (error) {
                            console.error(error);
                            displayMessage("error","Error: no se ha obtenido respuesta");
                            
                        }
                    }
                    userInput.value = "";
                }
            }
            // displayMessage("sent","Estas conectado");
            
        }
    })

})