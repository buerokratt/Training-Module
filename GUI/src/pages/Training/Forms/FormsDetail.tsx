import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { createColumnHelper } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineArrowBack } from 'react-icons/md';

import { Button, Card, DataTable, FormCheckbox, FormInput, FormTextarea, Track } from 'components';
import { Intent } from 'types/intent';
import { Slot } from 'types/slot';
import {Form, FormCreateDTO} from 'types/form';
import { createForm, editForm } from 'services/forms';
import { useToast } from 'hooks/useToast';
import { RESPONSE_TEXT_LENGTH } from 'constants/config';

type FormsDetailProps = {
  mode: 'new' | 'edit';
}

const FormsDetail: FC<FormsDetailProps> = ({ mode }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const { data: formDetails, refetch } = useQuery<Form>([`forms/formById`,params.id],);
  const [slotsFilter, setSlotsFilter] = useState('');
  const [intentsFilter, setIntentsFilter] = useState('');
  const { data: slots } = useQuery<Slot[]>({
    queryKey: ['slots'],
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intent-and-id'],
  });

  const { register, handleSubmit, reset } = useForm<FormCreateDTO>({
    mode: 'onChange',
    shouldUnregister: true,
  });

  useEffect(() => {
    let updatedForm: Form = {ingored_intents: [], response: "", slots: [], id: 2,form_name: 'form', utter_ask: 'utter'};
    // if (mode === 'edit') {
      // TODO: reset form to correct values
      // reset({ form: 'custom_fallback_form', slots: [], utter_ask: 'KEKW'});
      reset(updatedForm);
    // }
  }, [mode, reset]);

  const slotsColumnHelper = createColumnHelper<Slot>();
  const intentsColumnHelper = createColumnHelper<Intent>();

  const newFormMutation = useMutation({
    mutationFn: (data: { form: string }) => createForm(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['forms']);
      navigate('/training/forms');
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
      navigate('/training/forms');
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

  const handleFormSave = handleSubmit((data) => {
    console.log('FORM DATA');
    console.log(data);
    if (mode === 'edit' && params.id) {
      formEditMutation.mutate({ id: params.id, data: { form: data.form_name } });
    } else {
      newFormMutation.mutate({ form: data.form_name });
    }
  });

  return (
    <>
      <Track gap={16}>
        <Button appearance='icon' onClick={() => navigate('/training/forms')}>
          <MdOutlineArrowBack />
        </Button>
        <h1>{t('training.forms.titleOne')}</h1>
        <Button onClick={handleFormSave} style={{ marginLeft: 'auto' }}>{t('global.save')}</Button>
      </Track>

      <Card>
        <Track direction='vertical' gap={8} align='left'>
        <Track gap={8} style={{ width: '100%' }}>
            <FormInput {...register('form')} label={t('training.forms.form')}/>
            <p style={{minWidth: '170px'}}>_form</p>
          </Track>
          <FormInput {...register('form')} label={t('training.forms.formName')} />
          <Track gap={8} style={{ width: '100%' }}>
            <p style={{minWidth: '170px'}}>{t('training.responses.response')}</p>
            <FormTextarea
            {...register('form')}
            name='ask'
            label={t('training.responses.formName')}
            hideLabel
            minRows={1}
            maxLength={RESPONSE_TEXT_LENGTH}
            showMaxLength
            />
          </Track>
        </Track>
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
              {/*SEARCH ELEMENT FOR SLOTS*/}
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
                showInput={true}
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
