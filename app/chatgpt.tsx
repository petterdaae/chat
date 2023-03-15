const url = "https://api.openai.com/v1/chat/completions";

type RequestBody = {
  model: "gpt-3.5-turbo";
  messages: Message[];
  max_tokens: number;
};

type ResponseBody = {
  choices: {
    index: number;
    message: Message;
  }[];
};

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function chat(chatHistory: Message[]): Promise<Message> {
  const requestBody: RequestBody = {
    model: "gpt-3.5-turbo",
    messages: chatHistory,
    max_tokens: 1000,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_TOKEN}`,
    }),
    body: JSON.stringify(requestBody),
  });
  const responseBody: ResponseBody = await response.json();
  return responseBody.choices[0].message;
}
