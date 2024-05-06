import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import Papa from "papaparse";
import {
  MdAddCircle,
  MdDeleteOutline,
  MdOutlineArrowBack,
  MdOutlineModeEditOutline,
  MdOutlineSave,
} from 'react-icons/md';

import { Button, Card, DataTable, Dialog, FormInput, FormSelect, FormTextarea, Icon, Track } from 'components';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { useToast } from 'hooks/useToast';
import {
  addRegexExample,
  deleteRegex,
  deleteRegexExample,
  downloadExamples,
  editRegex,
  editRegexExample
} from 'services/regex';
import { Entity } from 'types/entity';
import i18n from '../../../../i18n';

type Regex = {
  readonly id: string;
  name: string;
  examples: string[];
}

type RegexTeaser = {
  readonly id: number;
  name: string;
}

const RegexDetail: FC = () => {
  const { id } = useParams();
  let updatedExampleName = '';
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const newExampleRef = useRef<HTMLTextAreaElement>(null);
  const [exampleText, setExampleText] = useState<string>('');
  const [editingRegexTitle, setEditingRegexTitle] = useState<string | null>(null);
  const [editableRow, setEditableRow] = useState<{
    id: number;
    value: string;
  } | null>(null);
  const { data: regex, refetch } = useQuery<Regex>(['regex',id, 'examples']);
  const [deletableRow, setDeletableRow] = useState<string | undefined | null>(null);
  const [deletableRegex, setDeletableRegex] = useState<string | number | null>(null);
  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });
  const { data: existingRegexes} = useQuery<RegexTeaser[]>({
    queryKey: ['regexes'],
  });
  const [editRegexName, setEditRegexName] = useState<string>('');

  const [regexList, setRegexList] = useState<{
    id: number;
    value: string;
  }[]>([]);

  useDocumentEscapeListener(() => {
    setEditableRow(null);
    setEditingRegexTitle(null);
    setEditableRow(null);
  });

  let regexData = useMemo(
    () => regex?.examples.map((e, index) => ({ id: index, value: e })),
    [regex],
  );

  const availableEntities = useMemo(() => entities?.filter((e) => {
    return !existingRegexes?.some((r) => r.name === e.name);
  }).map((e) => ({ label: e.name, value: String(e.id) })), [entities, regexList]);

  useEffect(() => {
    const result = regex?.examples.map((e, index) => ({ id: index, value: e }));
    setRegexList(result ?? []);
    setEditRegexName((availableEntities && availableEntities.length > 0) ? availableEntities[0].label : '');
  }, [regex?.examples, regex?.name, availableEntities?.length,regex])

  const regexEditMutation = useMutation({
    mutationFn: (data : {  name: string , newName: string }) => editRegex(data),
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New regex example added',
      });
      refetch();
      navigate(`/training/regex/${editRegexName}`)
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setEditingRegexTitle(null),
  });

  const regexDeleteMutation = useMutation({
    mutationFn: (deleteData : { regex_name: string | number }) => deleteRegex(deleteData),
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Regex deleted',
      });
      setTimeout(() => refetch(), 1000);
      navigate(`/training/intents-followup-training`)
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setDeletableRegex(null),
  });

  const regexExampleAddMutation = useMutation({
    mutationFn: (data: { regex_name: string, examples: string[] }) => addRegexExample(data),
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Example added',
      });
      refetch();
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setDeletableRow(null),
  });

  const regexExampleDeleteMutation = useMutation({
    mutationFn: (data : { regex_name: string , example: string }) => deleteRegexExample(data),
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Example deleted',
      });
      refetch();
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setDeletableRow(null),
  });

  const regexExampleEditMutation = useMutation({
    mutationFn: (example_data : {
      regex_name: string,
      input: {
        regex: string,
        example: string,
        newExample: string
    }}) => editRegexExample(example_data),
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Example changed',
      });
      refetch();
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setEditableRow(null),
  });

  const downloadExamplesMutation = useMutation({
    mutationFn: (data: { example: any }) => downloadExamples(data),
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Downloaded Examples',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => { },
  });


  const handleEditableRow = (example: { id: number; value: string }) => {
    setEditableRow(example);
  };

  const handleNewExampleSubmit = () => {
    if (!newExampleRef.current || !regex) return;
    regexExampleAddMutation.mutate({ regex_name: regex.name,examples: [newExampleRef.current.value] });
    newExampleRef.current.value = '';
    setExampleText('');
  };

  const newExampleName = (newName: string)  => {
    updatedExampleName = newName;
  }

  const regexColumns = useMemo(() => getColumns(
    editableRow,
    setDeletableRow,
    (value) => regexExampleEditMutation.mutate({
      regex_name: regex!.name,
      input: {
        regex: regex!.name,
        example: value,
        newExample: updatedExampleName ?? value
      },
    }),
    handleEditableRow,
    newExampleName,
  ), [editableRow]);

  const handleRegexExamplesUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = ((e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0)
        uploadFiles(files);
    });
    input.click();
  };

  const uploadFiles = (files: FileList) => {
    const file: File = files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const csvOutput: string = event?.target?.result as string ?? '';
        let result = Papa.parse(csvOutput);
        const data: string[] = result.data as string[] ?? []
        data.splice(0,1);
        const res = data.map((e) => (e[1]));
        if(res.length !== 0 && regex) {
          regexExampleAddMutation.mutate({ regex_name: regex.name,examples: res });
        }
      };

      fileReader.readAsText(file);
    }
  }

  const handleRegexExamplesDownload = (regexId: string | number) => {
    downloadExamplesMutation.mutate({
      example: {
        "data": regexData,
        "layout": false,
        "qul": "",
        "del": ""
      }
    });
  };

  return (
    <>
      <Track gap={16}>
        <Button appearance='icon' onClick={() => navigate('/training/intents-followup-training?tab=regex')}>
          <MdOutlineArrowBack />
        </Button>
        <h1>{t('training.intents.entity')}</h1>
      </Track>

      {regex && (
        <Card
          header={
            <Track direction='vertical' align='stretch' gap={8}>
              <Track justify='between'>
                <Track gap={16}>
                  {editingRegexTitle ? (
                    <FormSelect
                      name='intentTitle'
                      label={t('training.intents.regexExampleTitle')}
                      hideLabel
                      options={availableEntities || []}
                      defaultValue={editRegexName}
                      style={{ minWidth: 400 }}
                      onSelectionChange={(e) => setEditRegexName(e?.label || '')}
                    />
                  ) : (
                    <h3>{regex.name}</h3>
                  )}
                  {editingRegexTitle ? (
                    <Button
                      appearance='text'
                      onClick={() =>
                        regexEditMutation.mutate({ newName: editRegexName, name: editingRegexTitle })
                      }
                    >
                      <Icon icon={<MdOutlineSave />} />
                      {t('global.save')}
                    </Button>
                  ) : (
                    <Button
                      appearance='text'
                      onClick={() =>
                        setEditingRegexTitle(regex.name)
                      }
                    >
                      <Icon icon={<MdOutlineModeEditOutline />} />
                      {t('global.edit')}
                    </Button>
                  )}
                </Track>
              </Track>
              <Track justify='end' gap={8}>
                <Button
                  appearance='secondary'
                  onClick={handleRegexExamplesUpload}
                >
                  {t('training.intents.upload')}
                </Button>
                <Button
                  appearance='secondary'
                  onClick={() =>
                    handleRegexExamplesDownload(regex.id)
                  }
                >
                  {t('training.intents.download')}
                </Button>
                <Button
                  appearance='error'
                  onClick={() => setDeletableRegex(regex.id)}
                >
                  {t('global.delete')}
                </Button>
              </Track>
            </Track>
          }
        >
          <DataTable
            data={regexList}
            columns={regexColumns}
            tableBodyPrefix={
              <tr>
                <td>
                  <FormTextarea
                    ref={newExampleRef}
                    label={t('global.addNew')}
                    name='newExample'
                    minRows={1}
                    placeholder={t('global.addNew') + '...' || ''}
                    hideLabel
                    onChange={(e) => setExampleText(e.target.value)}
                  />
                </td>
                <td>
                  <Button
                    appearance='text'
                    onClick={handleNewExampleSubmit}
                    disabled={exampleText.length === 0}
                  >
                    <Icon icon={<MdAddCircle color={'rgba(0,0,0,0.54)'} />} />
                    {t('global.add')}
                  </Button>
                </td>
                <td></td>
              </tr>
            }
          />
        </Card>
      )}

      {deletableRegex !== null && (
        <Dialog
          title={t('training.intents.deleteRegex')}
          onClose={() => setDeletableRegex(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableRegex(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => regexDeleteMutation.mutate({ regex_name: deletableRegex })}
              >
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}

      {deletableRow !== null && regex && (
        <Dialog
          title={t('training.intents.deleteRegexExample')}
          onClose={() => setDeletableRow(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableRow(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => regexExampleDeleteMutation.mutate({ regex_name: regex.name, example: deletableRow || '' })}
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

const getColumns = (
  editableRow: { id: number; value: string } | null,
  setDeletableRow: (id: string) => void,
  onSaveClick: (value: string) => void,
  handleEditableRow: (row: { id: number; value: string }) => void,
  newExampleName: (value: string) => void,
) => {
  const columnHelper = createColumnHelper<{ id: number; value: string }>();
  
  return [
    columnHelper.accessor('value', {
      header: i18n.t('training.intents.examples') || '',
      cell: (props) => (
        editableRow?.id === props.row.original.id ? (
          <FormInput
            name={`example-${props.row.original.id}`}
            label=''
            defaultValue={editableRow.value}
            hideLabel
            onChange={(e) => newExampleName(e.target.value)}
          />
        ) : props.getValue()
      ),
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <>
          {editableRow && editableRow.id === props.row.original.id ? (
            <Button appearance='text' onClick={() => onSaveClick(props.row.original.value)}>
              <Icon
                label={i18n.t('global.save')}
                icon={<MdOutlineSave color={'rgba(0,0,0,0.54)'} />}
              />
              {i18n.t('global.save')}
            </Button>
          ) : (
            <Button
              appearance='text'
              onClick={() => handleEditableRow(props.row.original)}
            >
              <Icon
                label={i18n.t('global.edit')}
                icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />}
              />
              {i18n.t('global.edit')}
            </Button>
          )}
        </>
      ),
      id: 'edit',
      meta: {
        size: '1%',
      },
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button appearance='text' onClick={() => setDeletableRow(props.row.original.value)}>
          <Icon
            label={i18n.t('global.delete')}
            icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />}
          />
          {i18n.t('global.delete')}
        </Button>
      ),
      id: 'delete',
      meta: {
        size: '1%',
      },
    }),
  
  ];
}

export default RegexDetail;
