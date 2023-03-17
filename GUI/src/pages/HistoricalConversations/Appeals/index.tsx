import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createColumnHelper } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { MdDeleteOutline, MdOutlineSave } from 'react-icons/md';

import { Button, Card, DataTable, Dialog, FormInput, FormSelect, Icon, Track } from 'components';
import { Appeal } from 'types/appeal';
import { Intent } from 'types/intent';
import { addAppeal, deleteAppeal } from 'services/appeals';
import { useToast } from 'hooks/useToast';

const Appeals: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [filter, setFilter] = useState('');
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [processedAppeals, setProcessedAppeals] = useState<Record<string, string | null> | null>(null);
  const [deletableAppeal, setDeletableAppeal] = useState<string | number | null>(null);
  const { data: appeals } = useQuery<Appeal[]>({
    queryKey: ['appeals'],
    onSuccess: (data) => {
      const appealsMap: Record<string, string | null> = {};
      data.forEach((appeal) => appealsMap[appeal.appeal] = null);
      setProcessedAppeals(appealsMap);
    },
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });
  const { register, handleSubmit } = useForm<{ message: string }>();

  const newAppealMutation = useMutation({
    mutationFn: (data: { message: string }) => addAppeal(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['responses']);
      setAddFormVisible(false);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New appeal added',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
  });

  const handleNewAppealSubmit = handleSubmit(async (data) => {
    newAppealMutation.mutate(data);
  });

  const deleteAppealMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteAppeal(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['appeals']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Appeal deleted',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setDeletableAppeal(null),
  });

  const columnHelper = createColumnHelper<Appeal>();

  const appealsColumns = useMemo(() => [
    columnHelper.accessor('appeal', {
      header: t('training.historicalConversations.appeals') || '',
      cell: (props) => (
        <FormInput
          label={t('training.historicalConversations.appeal')}
          hideLabel
          name='appeal'
          defaultValue={props.getValue()}
        />
      ),
    }),
    columnHelper.accessor('intent', {
      header: t('training.intents.title') || '',
      cell: (props) => (
        <FormSelect
          name='intent'
          label={t('training.intents.title')}
          hideLabel
          // onSelectionChange={(selection) => setProcessedAppeals((prevState) => ({
          //   ...prevState,
          //   [props.row.original.appeal]: selection?.value ?? null,
          // }))}
          options={intents?.map((intent) => ({
            label: intent.intent,
            value: intent.intent,
          })) || []}
        />
      ),
    }),
    // columnHelper.display({
    //   id: 'save',
    //   cell: (props) => processedAppeals?.[props.row.original.appeal] ? (
    //     <Button appearance='text'>{t('global.save')}</Button>
    //   ) : null,
    // }),
    columnHelper.display({
      id: 'save',
      meta: {
        size: '1%',
      },
      cell: (props) => (
        <Button appearance='text' onClick={() => handleNewAppealSubmit()}>
          <Icon
            label={t('global.save')}
            icon={<MdOutlineSave color={'rgba(0,0,0,0.54)'} />}
          />
          {t('global.save')}
        </Button>
      ) 
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button appearance='text' onClick={() => setDeletableAppeal(props.row.original.id)}>
          <Icon
            label={t('global.delete')}
            icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />}
          />
          {t('global.delete')}
        </Button>
      ),
      id: 'delete',
      meta: {
        size: '1%',
      },
    }),
  ], [columnHelper, intents, t]);

  if (!appeals) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.historicalConversations.appeals')}</h1>

      <Card>
        <Track gap={16}>
          <FormInput
            label={t('global.search')}
            hideLabel
            name='searchIntent'
            placeholder={t('training.historicalConversations.searchAppeals') + '...'}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={() => setAddFormVisible(true)}>
            {t('global.add')}
          </Button>
        </Track>
      </Card>

      {addFormVisible && (
        <Card>
          <Track justify='between' gap={16}>
            <div style={{ flex: 1 }}>
              <Track gap={16}>
                <FormInput
                  {...register('message')}
                  label={t('training.responses.responseName')}
                  hideLabel
                />
              </Track>
            </div>
            <Track gap={16}>
              <Button appearance='secondary' onClick={() => setAddFormVisible(false)}>{t('global.cancel')}</Button>
              <Button onClick={handleNewAppealSubmit}>{t('global.save')}</Button>
            </Track>
          </Track>
        </Card>
      )}

      <Card style={{height: '100%'}}>
        <DataTable
          data={appeals}
          columns={appealsColumns}
          globalFilter={filter}
          setGlobalFilter={setFilter}
        />
      </Card>

      {deletableAppeal !== null && (
        <Dialog
          title={t('training.historicalConversations.deleteAppeal')}
          onClose={() => setDeletableAppeal(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableAppeal(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => deleteAppealMutation.mutate({ id: deletableAppeal })}
              >
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}
    </>
  );
};

export default Appeals;
