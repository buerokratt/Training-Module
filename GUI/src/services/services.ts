import api from './api';
const baseUrl = import.meta.env.REACT_APP_API_URL;

export async function getServicesList() {
  const { data } = await api.get(`services/get-services-list`);
  return data;
}

export async function setServiceTrigger(intentData: {
  intentName: string;
  serviceId: string;
}) {
  const { data } = await api.post(`services/set-services-trigger`, intentData);
  return data;
}

export const getAvailableIntents = (): string =>
  `${baseUrl}/training/available-intents`;

export const changeIntentConnection = (): string =>
  `${baseUrl}/services/check-intent-connection`;

export const deleteService = (id: string): string =>
  `${baseUrl}/services/delete`;
