import { create } from 'zustand';
import axios from 'axios';
import { changeIntentConnection, getAvailableIntents } from 'services/services';
import useToastStore from './toast.store';
import { Trigger } from 'types/trigger';
import { Intent } from 'types/intent';

enum ServiceState {
  Active = 'active',
  Inactive = 'inactive',
  Draft = 'draft',
  Ready = 'ready',
}

interface Service {
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
}

const useIntentsListStore = create<IntentStoreState>((set, get, store) => ({
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
