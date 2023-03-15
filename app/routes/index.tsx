import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import type { Message } from "~/chatgpt";
import { chat } from "~/chatgpt";
import styles from "../styles.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

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
  const [newMessage, setNewMessage] = useState("");
  const messageHistory = useActionData<typeof action>();
  const stringifiedMessageHistory = useMemo(
    () => JSON.stringify(messageHistory),
    [messageHistory]
  );

  const navigation = useNavigation();
  const loading = navigation.state !== "idle";
  useEffect(() => {
    if (navigation.state === "submitting") {
      setNewMessage("");
    }
  }, [navigation.state]);

  return (
    <div>
      <ul>
        {messageHistory?.map((message, index) => (
          <li key={index}>{message.content}</li>
        ))}
      </ul>
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
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </Form>
    </div>
  );
}
