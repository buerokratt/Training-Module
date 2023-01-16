import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { createColumnHelper } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineArrowBack } from 'react-icons/md';

import { Button, Card, DataTable, FormCheckbox, FormInput, Track } from 'components';
import { Intent } from 'types/intent';
import { Slot } from 'types/slot';
import { FormCreateDTO } from 'types/form';
import { createForm, editForm } from 'services/forms';
import { useToast } from 'hooks/useToast';

type FormsDetailProps = {
  mode: 'new' | 'edit';
}

const FormsDetail: FC<FormsDetailProps> = ({ mode }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const [slotsFilter, setSlotsFilter] = useState('');
  const [intentsFilter, setIntentsFilter] = useState('');
  const { data: slots } = useQuery<Slot[]>({
    queryKey: ['slots'],
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });

  const { register, handleSubmit, reset } = useForm<FormCreateDTO>();

  useEffect(() => {
    if (mode === 'edit') {
      // TODO: reset form to correct values
      reset({ form: 'custom_fallback_form' });
    }
  }, [mode, reset]);

  const slotsColumnHelper = createColumnHelper<Slot>();
  const intentsColumnHelper = createColumnHelper<Intent>();

  const newFormMutation = useMutation({
    mutationFn: (data: { form: string }) => createForm(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['forms']);
      navigate('/treening/treening/vormid');
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New form added',
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

  const formEditMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: { form: string } }) => editForm(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['forms']);
      navigate('/treening/treening/vormid');
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Form changes saved',
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

  const slotsColumns = useMemo(() => [
    slotsColumnHelper.accessor('name', {
      cell: (props) => (
        <FormCheckbox
          label={t('training.forms.requiredSlots')}
          hideLabel
          name='requiredSlots'
          item={{ label: props.getValue(), value: props.getValue() }}
        />
      ),
    }),
  ], [slotsColumnHelper, t]);

  const intentsColumns = useMemo(() => [
    intentsColumnHelper.accessor('intent', {
      cell: (props) => (
        <FormCheckbox
          label={t('training.forms.ignoredIntents')}
          hideLabel
          name='ignoredIntents'
          item={{ label: props.getValue(), value: props.getValue() }}
        />
      ),
    }),
  ], [intentsColumnHelper, t]);

  const handleNewFormSave = handleSubmit((data) => {
    if (mode === 'edit' && params.id) {
      formEditMutation.mutate({ id: params.id, data: { form: data.form } });
    } else {
      newFormMutation.mutate({ form: data.form });
    }
  });

  return (
    <>
      <Track gap={16}>
        <Button appearance='icon' onClick={() => navigate('/treening/treening/vormid')}>
          <MdOutlineArrowBack />
        </Button>
        <h1>{t('training.forms.titleOne')}</h1>
        <Button onClick={handleNewFormSave} style={{ marginLeft: 'auto' }}>{t('global.save')}</Button>
      </Track>

      <Card>
        <FormInput {...register('form')} label={t('training.forms.formName')} />
      </Card>

      <Track gap={16} align='left'>
        <div style={{ flex: 1 }}>
          <Card header={
            <Track direction='vertical' align='left' style={{ margin: '-16px' }}>
              <h2
                className='h5'
                style={{
                  padding: 16,
                  width: '100%',
                  borderBottom: '1px solid #D2D3D8',
                }}
              >
                {t('training.forms.requiredSlots')}
              </h2>
              <div style={{ width: '100%', padding: 16 }}>
                <FormInput
                  label={t('global.search')}
                  name='slotsSearch'
                  placeholder={t('global.search') + '...'}
                  hideLabel
                  onChange={(e) => setSlotsFilter(e.target.value)}
                />
              </div>
            </Track>
          }>
            {slots && (
              <DataTable
                data={slots}
                columns={slotsColumns}
                disableHead
                globalFilter={slotsFilter}
                setGlobalFilter={setSlotsFilter}
              />
            )}
          </Card>
        </div>

        <div style={{ flex: 1 }}>
          <Card header={
            <Track direction='vertical' align='left' style={{ margin: '-16px' }}>
              <h2
                className='h5'
                style={{
                  padding: 16,
                  width: '100%',
                  borderBottom: '1px solid #D2D3D8',
                }}
              >
                {t('training.forms.ignoredIntents')}
              </h2>
              <div style={{ width: '100%', padding: 16 }}>
                <FormInput
                  label={t('global.search')}
                  name='intentsSearch'
                  placeholder={t('global.search') + '...'}
                  hideLabel
                  onChange={(e) => setIntentsFilter(e.target.value)}
                />
              </div>
            </Track>
          }>
            {intents && (
              <DataTable
                data={intents}
                columns={intentsColumns}
                disableHead
                globalFilter={intentsFilter}
                setGlobalFilter={setIntentsFilter}
              />
            )}
          </Card>
        </div>
      </Track>
    </>
  );
};

export default FormsDetail;
