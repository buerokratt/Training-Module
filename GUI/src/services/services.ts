import api from './api';

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
