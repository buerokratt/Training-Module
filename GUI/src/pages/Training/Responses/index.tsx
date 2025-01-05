import {FC, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {createColumnHelper} from '@tanstack/react-table';
import {Controller, useForm} from 'react-hook-form';
import {AxiosError} from 'axios';
import {MdDeleteOutline, MdOutlineModeEditOutline, MdOutlineSave} from 'react-icons/md';

import {Button, Card, DataTable, Dialog, FormInput, FormTextarea, Icon, Label, Track} from 'components';
import {RESPONSE_TEXT_LENGTH} from 'constants/config';
import type {Responses as ResponsesType} from 'types/response';
import type {Dependencies as DependenciesType} from 'types/dependencises';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import {useToast} from 'hooks/useToast';
import {deleteResponse, editResponse} from 'services/responses';
import LoadingDialog from "../../../components/LoadingDialog";
import i18n from '../../../../i18n';
import withAuthorization, { ROLES } from 'hoc/with-authorization';

type NewResponse = {
  name: string;
  text: string;
}

const Responses: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: dependencies } = useQuery<DependenciesType>({
    queryKey: ['responses/dependencies'],
  });
  const { data: responses, refetch } = useQuery<ResponsesType>({
    queryKey: ['responses-list'],
  });
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [editableRow, setEditableRow] = useState<{ id: string; text: string; } | null>(null);
  const [deletableRow, setDeletableRow] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const { register,control, handleSubmit, resetField } = useForm<NewResponse>();
  const [formattedResponses, setFormattedResponses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useMemo(() => {
    if (responses && responses.length > 0) {
      const formattedData = responses[0].response.map((r, i) => ({
        id: i,
        response: r.name,
        text: r.text,
      }));
      setFormattedResponses(formattedData);
    } else {
      setFormattedResponses([]);
    }
  }, [responses]);

  let editingTrainingTitle: string;
  useDocumentEscapeListener(() => setEditableRow(null));

  function setEditingTrainingTitle(title: string) {
    editingTrainingTitle = title;
  }

  const responseSaveMutation = useMutation({
    mutationFn: ({ id, text }: { id: string, text: string }) => editResponse(id,  text),
    onMutate: async () => {
      await queryClient.cancelQueries(['responses-list']);
      setRefreshing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['responses-list']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.responseSaved'),
      });
      setTimeout(() => refetch(), 800);
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
      setRefreshing(false)
    },
    onSettled: () => {
      setEditableRow(null);
      setRefreshing(false)
    },
  });

  const responseDeleteMutation = useMutation({
    mutationFn: (data: { response: string }) => deleteResponse(data),
    onMutate: async () => {
      await queryClient.invalidateQueries(['responses-list']);
      setRefreshing(true);
    },
    onSuccess: async () => {
      setTimeout(() => refetch(), 1300);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.responseDeleted'),
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
      setRefreshing(false)
    },
    onSettled: async () => {
      const updatedResponses = formattedResponses.filter((r) => r.response !== deletableRow);
      setFormattedResponses(updatedResponses);
      setDeletableRow(null);
      setRefreshing(false)
    },
  });

  const newResponseMutation = useMutation({
    mutationFn: ({ name, text}: { name: string, text: string}) => editResponse("utter_" + name.trim().replace(/\s+/g, '_'),  text, false),
    onMutate: async () => {
      await queryClient.invalidateQueries(['responses-list']);
      setRefreshing(true);
    },
    onSuccess: async () => {
      setAddFormVisible(false);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.responseSaved'),
      });
      resetField('name');
      resetField('text');
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
      setRefreshing(false)
    },
    onSettled: () => {
      setTimeout(() => refetch(), 1100);
      setRefreshing(false);
    }
  });

  const handleNewResponseSubmit = handleSubmit(async (data) => {
    newResponseMutation.mutate(data);
  });

  const handleEditableRow = async (response: { id: string; text: string }) => {
    setEditableRow(response);
  };

  const columnHelper = createColumnHelper<typeof formattedResponses[0]>();

  const getRules = (responseId: string) => {
    const dependency = dependencies?.response.find(d => d.name === responseId);
    return dependency?.rules.map((name, i) => <p key={name}>{name}</p>);
  };

  const getStories = (responseId: string) => {
    const dependency = dependencies?.response.find(d => d.name === responseId);
    return dependency?.stories.map((name, i) => <p key={name}>{name}</p>);
  };

  const responsesColumns = useMemo(() => [
    columnHelper.accessor('response', {
      header: t('training.responses.response') || '',
      meta: {
        size: '1%',
      },
    }),
    columnHelper.display({
      id: 'dependencies',
      cell: (props) => buildDependenciesCell(
        getRules(props.row.original.response),
        getStories(props.row.original.response)
      ),
      meta: {
        size: '167px',
      },
    }),
    columnHelper.accessor('text', {
      header: '',
      cell: (props) => buildTextCell(
        props.getValue(),
        editableRow?.id === props.row.original.response,
        setEditingTrainingTitle,
      ),
      enableSorting: false,
    }),
    columnHelper.display({
      header: '',
      cell: (props) => buildSaveCell(
        editableRow?.id === props.row.original.response,
        () => editableRow && responseSaveMutation.mutate({id: editableRow.id , text: editingTrainingTitle.replaceAll(/\n{2,}/g, '\n').replaceAll('\n', '\\n\\n') ?? props.row.original.text.replaceAll(/\n{2,}/g, '\n').replaceAll('\n', '\\n\\n')}),
        () => {
          setEditingTrainingTitle(props.row.original.text);
          handleEditableRow({ id: props.row.original.response, text: props.row.original.text });
        },
      ),
      id: 'edit',
      meta: {
        size: '1%',
      },
    }),
    columnHelper.display({
      id: 'delete',
      cell: (props) => buildDeleteCell(() => setDeletableRow(props.row.original.response)),
      meta: {
        size: '1%',
      },
    }),
  ], [columnHelper, editableRow, t]);

  if (!responses) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.responses.title')}</h1>

      <Card>
        <Track gap={16}>
          <FormInput
            label={t('training.responses.searchResponse')}
            name='responseSearch'
            placeholder={t('training.responses.searchResponse') + '...'}
            hideLabel
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={() => {setAddFormVisible(true); setEditingTrainingTitle("")}}>
            {t('global.add')}
          </Button>
        </Track>
      </Card>

      {addFormVisible && (
        <Card>
          <Track justify='between' gap={16}>
            <div style={{ flex: 1 }}>
              <Track gap={16}>
                <p>utter_</p>
                <FormInput
                  {...register('name')}
                  label={t('training.responses.responseName')}
                  hideLabel
                />
                <Controller name='text' control={control} render={({ field }) => (
                  <FormTextarea
                    {...field}
                    label={t('training.responses.responseText')}
                    placeholder={t('training.responses.newResponseTextPlaceholder') || ''}
                    hideLabel
                    minRows={1}
                    maxLength={RESPONSE_TEXT_LENGTH}
                    showMaxLength
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      setEditingTrainingTitle(e.target.value)
                    }}
                  />
                )} />
              </Track>
            </div>
            <Track gap={16}>
              <Button appearance='secondary' onClick={() => setAddFormVisible(false)}>{t('global.cancel')}</Button>
              <Button onClick={handleNewResponseSubmit}>{t('global.save')}</Button>
            </Track>
          </Track>
        </Card>
      )}

      <Card>
        <DataTable
          data={formattedResponses}
          columns={responsesColumns}
          sortable
          globalFilter={filter}
          setGlobalFilter={setFilter}
        />
      </Card>

      {/* Refactor dialog content later */}
      {deletableRow !== null && (
        <Dialog
          title={t('training.responses.deleteResponse')}
          onClose={() => setDeletableRow(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableRow(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => responseDeleteMutation.mutate({ response: deletableRow })}
              >
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}

      {refreshing && (
          <LoadingDialog title={t('global.updatingDataHead')} >
            <p>{t('global.updatingDataBody')}</p>
          </LoadingDialog>
      )}
    </>
  );
};

const buildDependenciesCell = (rules: JSX.Element[] | undefined, stories: JSX.Element[] | undefined) => {
  return (
    <Label tooltip={
      <>
        <strong>{i18n.t('global.dependencies')}</strong>
        {rules}
        {stories}
      </>
    }>
      {i18n.t('global.dependencies')}
    </Label>
  )
}

const buildTextCell = (value: string, isEditable: boolean, onEdit: (value: string) => void) => {
  if(isEditable) {
    return (
      <FormTextarea
        label='label'
        name='name'
        defaultValue={value}
        hideLabel
        minRows={1}
        maxLength={RESPONSE_TEXT_LENGTH}
        showMaxLength
        onChange={(e) => onEdit(e.target.value)}
      />
    )
  }
  
  return (
    <p>{value}</p> 
  )
}

const buildSaveCell = (
  isEditable: boolean,
  onSave: () => void,
  onEdit: () => void,
) => {
  if(isEditable){
    return (
      <Button appearance='text' onClick={onSave}>
        <Icon label={i18n.t('global.save')} icon={<MdOutlineSave color={'rgba(0,0,0,0.54)'} />} />
        {i18n.t('global.save')}
      </Button>
    )
  }

  return (
    <Button
      appearance='text'
      onClick={onEdit}
    >
      <Icon label={i18n.t('global.edit')} icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />} />
      {i18n.t('global.edit')}
    </Button>
  )
}

const buildDeleteCell = (onClick: () => void) => {
  return (
    <Button appearance='text' onClick={onClick}>
      <Icon label={i18n.t('global.delete')} icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />} />
      {i18n.t('global.delete')}
    </Button>
  )
}

export default withAuthorization(Responses, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
