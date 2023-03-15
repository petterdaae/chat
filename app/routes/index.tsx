import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export async function action() {
  return json(["foo", "bar"]);
}

export default function Index() {
  const chatHistory = useActionData<typeof action>();
  return (
    <div>
      <Form method="post">
        {chatHistory?.map((message) => (
          <div key={message}>{message}</div>
        ))}
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
