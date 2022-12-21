import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineModeEditOutline, MdOutlineSave } from 'react-icons/md';

import { Button, Card, DataTable, FormInput, FormTextarea, Icon, Label, Track } from 'components';
import type { Responses as ResponsesType } from 'types/response';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';

const Responses: FC = () => {
  const { t } = useTranslation();
  const { data: responses } = useQuery<ResponsesType>({
    queryKey: ['responses'],
  });
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [editableRow, setEditableRow] = useState<{ id: number; value: string; } | null>(null);
  const [filter, setFilter] = useState('');

  const formattedResponses = useMemo(() => responses ? Object.keys(responses).map((r, i) => ({
    id: i,
    response: r,
    text: responses[r].text,
  })) : [], [responses]);

  useDocumentEscapeListener(() => setEditableRow(null));

  const handleResponseDelete = async () => {
    //TODO: Add mock endpoint for deleting a response
  };

  const handleNewResponseSubmit = async () => {
    //TODO: Add mock endpoint for adding new response
  };

  const handleEditableRow = async (response: { id: number; value: string }) => {
    setEditableRow(response);
  };

  const columnHelper = createColumnHelper<typeof formattedResponses[0]>();

  const responsesColumns = useMemo(() => [
    columnHelper.accessor('response', {
      header: t('training.responses.response') || '',
      meta: {
        size: '1%',
      },
    }),
    columnHelper.display({
      id: 'dependencies',
      cell: () => (
        <Label tooltip={
          <>
            {/* TODO: Add correct dependencies */}
            <strong>{t('global.dependencies')}</strong>
            <p>Dep 1</p>
            <p>Dep 2</p>
          </>
        }>
          {t('global.dependencies')}
        </Label>
      ),
      meta: {
        size: '1%',
      },
    }),
    columnHelper.accessor('text', {
      header: '',
      cell: (props) => editableRow && editableRow.id === props.row.original.id ? (
        <FormTextarea
          label='label'
          name='name'
          defaultValue={props.getValue()}
          hideLabel minRows={1}
          maxLength={400}
          showMaxLength
        />
      ) : (
        <p>{props.getValue()}</p>
      ),
      enableSorting: false,
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <>
          {editableRow && editableRow.id === props.row.original.id ? (
            <Button appearance='text'>
              <Icon label={t('global.save')} icon={<MdOutlineSave color={'rgba(0,0,0,0.54)'} />} />
              {t('global.save')}
            </Button>
          ) : (
            <Button appearance='text'
                    onClick={() => handleEditableRow({ id: props.row.original.id, value: props.row.original.text })}>
              <Icon label={t('global.edit')} icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />} />
              {t('global.edit')}
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
      id: 'delete',
      cell: () => (
        <Button appearance='text' onClick={handleResponseDelete}>
          <Icon label={t('global.delete')} icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />} />
          {t('global.delete')}
        </Button>
      ),
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
            onChange={(e) => setFilter(e.target.value)}
            hideLabel
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
              <Track gap={16} align='left'>
                <FormInput label='responseName' name='responseName' defaultValue='utter_' hideLabel />
                <FormTextarea
                  label='responseText'
                  name='responseText'
                  placeholder={t('training.responses.newResponseTextPlaceholder') || ''}
                  minRows={1}
                  hideLabel
                />
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
    </>
  );
};

export default Responses;
