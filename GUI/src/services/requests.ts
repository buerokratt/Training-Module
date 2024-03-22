import api from './api';
import { Trigger } from 'types/trigger';

export async function updateConnectionRequest(request: Trigger, status: "approved" | "declined") {
  const { data } = await api.post<{ response: Trigger[]}>(`services/respond-to-connection-request`, {
    serviceId: request.service,
    serviceName: request.serviceName,
    intent: request.intent,
    authorRole: request.authorRole,
    status,
  });
  
  return data.response[0];
}

export interface RequestServiceIntentConnectionData { 
  serviceId: string;
  serviceName: string;
  intent: string;
}

export async function requestServiceIntentConnection(data: RequestServiceIntentConnectionData) {
  const { data: result } = await api.post<Trigger>(`services/request-service-intent-connection`, data);
  return result;
}
