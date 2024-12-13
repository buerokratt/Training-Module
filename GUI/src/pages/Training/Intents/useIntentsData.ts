import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { IntentWithExamplesCount } from 'types/intentWithExamplesCount';

type IntentsWithExamplesCountResponse = {
  response: {
    intents: IntentWithExamplesCount[];
  };
};

const setIsCommon = (intent: IntentWithExamplesCount): IntentWithExamplesCount => ({
  ...intent,
  isCommon: intent.id.startsWith('common_'),
});

interface UseIntentsDataProps {
  queryKey: string;
}

export const useIntentsData = ({ queryKey }: UseIntentsDataProps) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [intents, setIntents] = useState<IntentWithExamplesCount[]>([]);
  const [selectedIntent, setSelectedIntent] = useState<IntentWithExamplesCount | null>(null);

  const { data: intentsResponse, isLoading } = useQuery<IntentsWithExamplesCountResponse>({
    queryKey: [queryKey],
  });

  useEffect(() => {
    if (intentsResponse) setIntents(intentsResponse.response.intents.map((intent) => setIsCommon(intent)));
  }, [intentsResponse]);

  const queryRefresh = useCallback(
    async (newIntent?: string) => {
      const response = await queryClient.fetchQuery<IntentsWithExamplesCountResponse>([queryKey]);

      if (response) {
        const mappedIntents = response.response.intents.map((intent) => setIsCommon(intent));
        setIntents(mappedIntents);

        if (newIntent) {
          const selectedIntent = mappedIntents.find((intent) => intent.id === newIntent);
          if (selectedIntent) setSelectedIntent(selectedIntent);
        }
      }
    },
    [queryClient, queryKey]
  );

  useEffect(() => {
    let intentParam = searchParams.get('intent');
    if (!intentParam) return;

    const queryIntent = intents.find((intent) => intent.id === intentParam);

    if (queryIntent) {
      setSelectedIntent(queryIntent);
    }
  }, [intents, searchParams]);

  return {
    intents,
    selectedIntent,
    setSelectedIntent,
    queryRefresh,
    isLoading,
  };
};
