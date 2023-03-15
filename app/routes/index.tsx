import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useMemo } from "react";
import type { Message } from "~/chatgpt";
import { chat } from "~/chatgpt";
import styles from "../styles.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const stringifiedMessageHistory = formData.get("messageHistory") as string;
  const messageHistory: Message[] = JSON.parse(stringifiedMessageHistory);
  const newMessage = formData.get("newMessage") as string;
  const messageHistoryWithNewMessage: Message[] = [
    ...messageHistory,
    { role: "user", content: newMessage },
  ];
  const answer = await chat(messageHistoryWithNewMessage);
  return json([...messageHistoryWithNewMessage, answer]);
}

export default function Index() {
  const messageHistory = useActionData<typeof action>();
  const stringifiedMessageHistory = useMemo(
    () => JSON.stringify(messageHistory ?? []),
    [messageHistory]
  );

  const navigation = useNavigation();
  const loading = navigation.state !== "idle";

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
        <input type="text" name="newMessage" disabled={loading} />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </Form>
    </div>
  );
}
