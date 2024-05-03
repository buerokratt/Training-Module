import React, {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import {Controller, useForm} from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineArrowBack } from 'react-icons/md';

import {Button, Card,  FormInput, FormTextarea, Track} from 'components';
import { Intent } from 'types/intent';
import {SlotResponse} from 'types/slot';
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
  const { data: slots } = useQuery<SlotResponse[]>({
    queryKey: ['slot-with-response'],
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intent-and-id'],
  });
  const handleValuesChange = (values: any) => {
    setSelectedSlots(values);
  };

  const { register, control, handleSubmit, reset,setValue } = useForm<FormCreateDTO>({
    mode: 'onChange',
    shouldUnregister: true,
  });

  useEffect(() => {
    if (formDetails) {
      setFormResponse(formDetails.responses?.response);
      setFormName(formDetails.form?.name);
      setValue('form.name', formDetails.form?.name);
      setValue('responses.response', formDetails.responses?.response);
      // @ts-ignore
      setValue('form.required_slots', formDetails.form?.required_slots ?? []);
      setValue('form.ignored_intents', formDetails.form?.ignored_intents ?? []);
      reset(formDetails)
    } else {
      setValue('responses.response', '');
      setValue('form.required_slots', []);
      setValue('form.ignored_intents',  []);
    }
  }, [formDetails, reset]);

  setTimeout(() => refetch(), 200);

  const newFormMutation = useMutation({
    mutationFn: (data: FormCreateDTO) => createForm(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['forms']);
      navigate('/training/forms');
      refetch();
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
      refetch();
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

  const handleFormSave = handleSubmit((data) => {
    // @ts-ignore
    data.responses.questions = selectedSlots ?? [];
    if (mode === 'edit' && params.id) {
      formEditMutation.mutate({ form_name: params.id, data: data });
    } else {
      newFormMutation.mutate(data);
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
                <FormInput {...register('form.name',{
                  required: t('submit.slotNameRequired').toString(),
                  minLength: {
                    value: 1,
                    message: t('submit.slotCantBeEmpty')
                  }})}
                           label={t('training.forms.form')}
                           defaultValue={formName}

                />
            <p style={{minWidth: '150px'}}>_form</p>
          </Track>
          <Track gap={8} style={{ width: '100%' }}>
            <p style={{minWidth: '170px'}}>{t('training.responses.response')}</p>
            <Controller
                name='responses.response'
                control={control}
                render={({ field }) => (
                    <FormTextarea
                        {...field}
                        hideLabel
                        minRows={1}
                        maxLength={RESPONSE_TEXT_LENGTH}
                        showMaxLength
                        defaultValue={formResponse}
                        onChange={(value) => {
                          setFormResponse(value.target.value)
                          field.onChange(value.target.value)
                        }
                    }
                        label={t('training.value')}
                    />
                )}
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
                      text: slot.text,
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
                    items={intents?.map((intent) => ({
                      label: intent.intent,
                      checked: formDetails?.form.ignored_intents.some(ii => ii === intent.intent),
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
