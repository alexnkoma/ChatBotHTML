const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const endpoint =  "https://instanciachatgpt.openai.azure.com/";  // process.env["AZURE_OPENAI_ENDPOINT"] ;
const azureApiKey = "2993309da8914082b131e6a42b25219c"; //process.env["AZURE_OPENAI_KEY"] ;

console.log(endpoint);

const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Does Azure OpenAI support customer managed keys?" },
  { role: "assistant", content: "Yes, customer managed keys are supported by Azure OpenAI" },
  { role: "user", content: "Who wrote El quijote?" },
];

async function main() {
  console.log("== Chat Completions Sample 2 ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "NanforGPT-35-turbo"; //"gpt-35-turbo";
  const result = await client.getChatCompletions(deploymentId, messages);

  for (const choice of result.choices) {
    console.log(choice.message);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };