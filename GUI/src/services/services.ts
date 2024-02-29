import api from './api';
const baseUrl = import.meta.env.REACT_APP_API_URL;

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

export const respondToConnectionRequest = (): string =>
  `${baseUrl}/services/respond-to-connection-request`;

export const getConnectionRequests = (): string =>
  `${baseUrl}/services/connection-requests`;

export const getServicesList = () => `${baseUrl}/services`;
