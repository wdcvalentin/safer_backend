import fetch from 'node-fetch';

export async function subscribeContactsToTopic(
  emails: string[],
): Promise<string> {
  console.log(`[subscribeContactsToTopic]: subscribing ${String(emails)}`);
  try {
    const response: any = await fetch(process.env.AWS_API_NOTIFICATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contacts: emails,
      }),
    });
    return response.statusText;
  } catch (error) {
    console.log('error while subscribing contact', error);
  }
}

export async function unSubscribeContactsToTopic(
  emails: string[],
): Promise<string> {
  console.log(`[unSubscribeContactsToTopic]: unsubscribing ${String(emails)}`);
  try {
    const response: any = await fetch(process.env.AWS_API_NOTIFICATION, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contacts: emails,
      }),
    });
    return response.statusText;
  } catch (error) {
    console.log('error while unsubscribing contact', error);
  }
}
