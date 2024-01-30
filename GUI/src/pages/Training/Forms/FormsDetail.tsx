import {FC, useEffect, useMemo, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import {Controller, useForm} from 'react-hook-form';
import { createColumnHelper } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineArrowBack } from 'react-icons/md';

import { Button, Card, DataTable, FormCheckbox, FormInput, FormTextarea, Track } from 'components';
import { Intent } from 'types/intent';
import { Slot } from 'types/slot';
import {Form, FormCreateDTO, FormEditDTO} from 'types/form';
import { createForm, editForm } from 'services/forms';
import { useToast } from 'hooks/useToast';
import { RESPONSE_TEXT_LENGTH } from 'constants/config';
import {FormCheckboxesWithInput} from "../../../components/FormElements";

type FormsDetailProps = {
  mode: 'new' | 'edit';
}

const FormsDetail: FC<FormsDetailProps> = ({ mode }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const { data: formDetails, refetch } = useQuery<Form>([`forms/formById`,params.id],);
  const [slotsFilter, setSlotsFilter] = useState('');
  const [intentsFilter, setIntentsFilter] = useState('');
  const [formResponse, setFormResponse] = useState('');
  const [formName, setFormName] = useState(params.id);
  const { data: slots } = useQuery<Slot[]>({
    queryKey: ['slots'],
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intent-and-id'],
  });
  const handleValuesChange = (values: any) => {
    setSelectedSlots(values);
  };

  const { register, formState: { errors },control, handleSubmit, reset } = useForm<FormCreateDTO>({
    mode: 'onChange',
    shouldUnregister: true,
  });

  useEffect(() => {
    if(formDetails) {
      setFormResponse(formDetails.responses?.response);
      setFormName(formDetails.form?.name);
    }
  }, [formDetails, reset]);

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
    mutationFn: ({ form_name, data }: { form_name: string , data:  FormEditDTO }) => editForm(form_name, data),
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
    console.log(selectedSlots);
    data.responses.questions = selectedSlots ?? [];
    if (mode === 'edit' && params.id) {
      formEditMutation.mutate({ form_name: params.id, data: data });
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
          <Track gap={8} style={{width: '100%'}}>
            {/* form name */}
            <Controller name='form.name' control={control} render={({field}) =>
                <FormInput {...field}
                           label={t('training.forms.form')}
                           defaultValue={formName}
                           onChange={(e) => {
                             setFormName(e.target.value);
                             field.onChange(e.target.value);
                           }}
                />
            }/>
            <p style={{minWidth: '150px'}}>_form</p>
          </Track>
          {/* This is slot question */}
          {/*<FormInput {...register('form')} label={t('training.forms.formName')} />*/}
          <Track gap={8} style={{ width: '100%' }}>
            <p style={{minWidth: '170px'}}>{t('training.responses.response')}</p>
            {/* Form response input */}
            <FormTextarea
            {...register('responses.response')}
            name='ask'
            label={t('training.responses.formName')}
            hideLabel
            minRows={1}
            maxLength={RESPONSE_TEXT_LENGTH}
            showMaxLength
            defaultValue={formResponse}
            onChange={(e) => setFormResponse(e.target.value)}
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
                  <FormCheckboxesWithInput
                    {...register('form.required_slots')}
                    label='Slots'
                    name={'form.required_slots'}
                    globalFilter={slotsFilter}
                    displayInput={true}
                    selectedElements={formDetails?.responses?.questions}
                    setGlobalFilter={setSlotsFilter}
                    hideLabel={true}
                    items={slots.map((slot) => ({
                      label: slot.name,
                      value: String(slot.name),
                    }))}
                    onValuesChange={handleValuesChange}
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
                <FormCheckboxesWithInput
                    {...register('form.ignored_intents')}
                    label='Ignored intents'
                    globalFilter={intentsFilter}
                    setGlobalFilter={setIntentsFilter}
                    hideLabel={true}
                    items={intents.map((intent) => ({
                      label: intent.intent,
                      value: String(intent.intent),
                    }))}
                />
            )}
          </Card>
        </div>
      </Track>
    </>
  );
};

export default FormsDetail;
