import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useMemo, useState } from "react";
import type { Message } from "~/chatgpt";
import { chat } from "~/chatgpt";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const stringifiedMessageHistory = formData.get("messageHistory") as string;
  let messageHistory: Message[] =
    stringifiedMessageHistory === ""
      ? []
      : JSON.parse(stringifiedMessageHistory);
  const newMessage = formData.get("newMessage") as string;
  messageHistory = [...messageHistory, { role: "user", content: newMessage }];
  const answer = await chat(messageHistory);
  messageHistory = [...messageHistory, answer];
  return json(messageHistory);
}

export default function Index() {
  const messageHistory = useActionData<typeof action>();
  const stringifiedMessageHistory = useMemo(
    () => JSON.stringify(messageHistory),
    [messageHistory]
  );
  const [newMessage, setNewMessage] = useState("");
  return (
    <div>
      {messageHistory?.map((message, index) => (
        <div key={index}>{message.content}</div>
      ))}
      <Form method="post">
        <input
          type="hidden"
          name="messageHistory"
          value={stringifiedMessageHistory}
        />
        <input
          type="text"
          name="newMessage"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
