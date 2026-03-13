import axios from 'axios';

export async function sendNotificationsFor(ids: string[], message: string) {
  const headers = {
    Authorization: process.env.ONESIGNAL_PRIVATEKEY,
    accept: 'application/json',
    'content-type': 'application/json',
  };

  const data = {
    app_id: process.env.ONESIGNAL_APP_ID_CLIENT,
    include_subscription_ids: ids,
    data: { foo: 'bar' },
    headings: { en: 'Rappidex Espress' },
    contents: { en: message },
  };

  const api = axios.create({
    baseURL: 'https://onesignal.com/api/v1',
    headers,
  });

  try {
    await api.post('/notifications', data);
  } catch (error) {
    console.log(error);
  }
}
