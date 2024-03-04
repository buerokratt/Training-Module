import { create } from 'zustand';
import axios from 'axios';
import {
  changeIntentConnection,
  getAvailableIntents,
  respondToConnectionRequest,
  getConnectionRequests,
  getServicesList,
} from 'services/services';
import useToastStore from './toast.store';
import { Trigger } from 'types/trigger';
import { Intent } from 'types/intent';

enum ServiceState {
  Active = 'active',
  Inactive = 'inactive',
  Draft = 'draft',
  Ready = 'ready',
}

export interface Service {
  readonly id: number;
  readonly name: string;
  usedCount: number;
  readonly state: ServiceState;
  readonly type: 'GET' | 'POST';
  readonly isCommon: boolean;
  readonly description?: string;
  readonly structure: any;
  readonly endpoints: any;
  readonly serviceId: string;
}

interface IntentStoreState {
  services: Service[];
  checkServiceIntentConnection: (
    onConnected: (response: Trigger) => void,
    onNotConnected: () => void
  ) => Promise<void>;
  loadAvailableIntentsList: (
    onEnd: (requests: Intent[]) => void,
    errorMessage: string
  ) => Promise<void>;
  selectedService: Service | undefined;
  setSelectedService: (service: Service) => void;
  respondToConnectionRequest: (
    onEnd: () => void,
    successMessage: string,
    errorMessage: string,
    status: boolean,
    request: Trigger
  ) => Promise<void>;
  loadRequestsList: (
    onEnd: (requests: Trigger[]) => void,
    errorMessage: string
  ) => Promise<void>;
  loadServicesList: () => Promise<void>;
}

const useIntentsListStore = create<IntentStoreState>((set, get, store) => ({
  services: [],
  respondToConnectionRequest: async (
    onEnd,
    successMessage,
    errorMessage,
    status,
    request
  ) => {
    try {
      await axios.post(respondToConnectionRequest(), {
        serviceId: request.service,
        serviceName: request.serviceName,
        intent: request.intent,
        authorRole: request.authorRole,
        status: status === true ? 'approved' : 'declined',
      });
      useToastStore.getState().success({ title: successMessage });
    } catch (_) {
      useToastStore.getState().error({ title: errorMessage });
    }
    onEnd();
  },
  loadRequestsList: async (onEnd, errorMessage) => {
    try {
      const requests = await axios.get(getConnectionRequests());
      onEnd(requests.data.response);
    } catch (_) {
      onEnd([]);
      useToastStore.getState().error({ title: errorMessage });
    }
  },
  loadServicesList: async () => {
    const result = await axios.get(getServicesList());
    const services = result.data.response.map(
      (item: any) =>
        ({
          id: item.id,
          name: item.name,
          description: item.description,
          state: item.state,
          type: item.type,
          isCommon: item.iscommon,
          serviceId: item.serviceId,
          usedCount: 0,
        } as Service)
    );

    set({
      services,
    });
  },
  selectedService: undefined,
  setSelectedService: (service: Service) => {
    set({
      selectedService: service,
    });
  },
  loadAvailableIntentsList: async (onEnd, errorMessage) => {
    try {
      const requests = await axios.get(getAvailableIntents());
      onEnd(requests.data.response);
    } catch (_) {
      onEnd([]);
      useToastStore.getState().error({ title: errorMessage });
    }
  },
  checkServiceIntentConnection: async (onConnected, onNotConnected) => {
    const selectedService = get().selectedService;
    if (!selectedService) return;

    try {
      const res = await axios.post(changeIntentConnection(), {
        serviceId: selectedService.serviceId,
      });
      if (res.data.response) {
        onConnected(res.data.response);
      } else {
        onNotConnected();
      }
    } catch (_) {
      onNotConnected();
    }
  },
}));

export default useIntentsListStore;
