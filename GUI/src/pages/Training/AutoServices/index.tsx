import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Card, DataTable, Icon } from 'components';
import { Trigger } from 'types/trigger';
import { Intent } from 'types/intent';
import useIntentsListStore from 'store/intents.store';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';

const AutoServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const [intents, setIntents] = useState<Intent[] | undefined>(undefined);
  const [triggers, setTriggers] = useState<Trigger[] | undefined>(undefined);

  const loadIntentsList = () => {
    useIntentsListStore
      .getState()
      .loadAvailableIntentsList((requests) => setIntents(requests), t('error'));
  };

  const loadConnectionRequests = () => {
    useIntentsListStore
      .getState()
      .loadRequestsList(
        (requests: Trigger[]) => setTriggers(requests),
        t('connectionRequests.toast.failed.requests')
      );
  };

  useEffect(() => {
    loadIntentsList();
    loadConnectionRequests();
  }, []);

  const respondToConnectionRequest = (status: boolean, request: Trigger) => {
    useIntentsListStore
      .getState()
      .respondToConnectionRequest(
        () => loadConnectionRequests(),
        t('connectionRequests.approvedConnection'),
        t('connectionRequests.declinedConnection'),
        status,
        request
      );
  };

  const appRequestColumnHelper = createColumnHelper<Trigger>();
  const appRequestColumns = useMemo(
    () => [
      appRequestColumnHelper.accessor('intent', {
        header: 'Intent',
        cell: (uniqueIdentifier) => uniqueIdentifier.getValue(),
      }),
      appRequestColumnHelper.accessor('serviceName', {
        header: 'Service',
        cell: (uniqueIdentifier) => uniqueIdentifier.getValue(),
      }),
      appRequestColumnHelper.accessor('requestedAt', {
        header: 'Requested At',
        cell: (props) => (
          <span>
            {format(new Date(props.getValue()), 'dd-MM-yyyy HH:mm:ss')}
          </span>
        ),
      }),
      appRequestColumnHelper.display({
        header: '',
        cell: (props) => (
          <Icon
            icon={
              <AiFillCheckCircle
                fontSize={22}
                color="rgba(34,139,34, 1)"
                onClick={() =>
                  respondToConnectionRequest(true, props.row.original)
                }
              />
            }
            size="medium"
          />
        ),
        id: 'approve',
        meta: {
          size: '1%',
        },
      }),
      appRequestColumnHelper.display({
        header: '',
        cell: (props) => (
          <Icon
            icon={
              <AiFillCloseCircle
                fontSize={22}
                color="rgba(210, 4, 45, 1)"
                onClick={() =>
                  respondToConnectionRequest(false, props.row.original)
                }
              />
            }
            size="medium"
          />
        ),
        id: 'reject',
        meta: {
          size: '1%',
        },
      }),
      appRequestColumnHelper.display({
        header: '',
        id: 'space',
        meta: {
          size: '1%',
        },
      }),
    ],
    [appRequestColumnHelper, t]
  );

  if (!triggers) return <label>Loading ...</label>;

  return (
    <>
      <h1>Connected intents list</h1>
      <Card>
        <DataTable data={triggers} columns={appRequestColumns} sortable />
      </Card>
    </>
  );
};
export default AutoServicesPage;
