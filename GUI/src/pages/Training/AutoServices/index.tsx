import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Card, DataTable, Icon } from 'components';
import { Trigger } from 'types/trigger';
import { Intent } from 'types/intent';
import useIntentStore from 'store/intents.store';
import { deleteService } from 'services/services';

const AutoServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const [intents, setIntents] = useState<Intent[] | undefined>(undefined);

  const loadIntentsList = () => {
    useIntentStore
      .getState()
      .loadAvailableIntentsList((requests) => setIntents(requests), t('error'));
  };

  useEffect(() => {
    loadIntentsList();
  }, []);

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
      appRequestColumnHelper.accessor('status', {
        header: 'Unlink service',
        cell: (props) => {
          const status = props.getValue();
          return (
            <Icon
              icon={status === 'active' ? 'check' : 'close'}
              color={status === 'active' ? 'success' : 'error'}
              onClick={() => deleteService(props.row.original.id.toString())}
            />
          );
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

  if (!intents) return <label>Loading ...</label>;

  return (
    <>
      <h1>Connected intents list</h1>
      <Card>
        <DataTable data={intents} columns={appRequestColumns} sortable />
      </Card>
    </>
  );
};
export default AutoServicesPage;
