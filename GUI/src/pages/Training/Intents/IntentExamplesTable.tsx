import { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineModeEditOutline, MdOutlineSave, MdAddCircle } from 'react-icons/md';

import { Button, DataTable, FormInput, FormTextarea, Icon } from 'components';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { Entity } from 'types/entity';
import IntentExamplesEntry from './IntentExamplesEntry';

type IntentExamplesTableProps = {
  examples: string[];
  onAddNewExample: (example: string) => void;
  entities: Entity[];
}

const IntentExamplesTable: FC<IntentExamplesTableProps> = ({ examples, onAddNewExample, entities }) => {
  const { t } = useTranslation();
  const newExampleRef = useRef<HTMLTextAreaElement>(null);
  const [editableRow, setEditableRow] = useState<{ id: number; value: string; } | null>(null);
  const columnHelper = createColumnHelper<{ id: number; value: string; }>();

  useDocumentEscapeListener(() => setEditableRow(null));

  const examplesData = useMemo(() => examples.map((e, index) => ({ id: index, value: e })), [examples]);

  const handleEditableRow = (example: { id: number; value: string }) => {
    setEditableRow(example);
  };

  const examplesColumns = useMemo(() => [
    columnHelper.accessor('value', {
      header: t('training.intents.examples') || '',
      cell: (props) => editableRow && editableRow.id === props.row.original.id ? (
        <FormInput
          name={`example-${props.row.original.id}`}
          label=''
          defaultValue={editableRow.value}
          hideLabel
        />
      ) : <IntentExamplesEntry value={props.getValue()} entities={entities} />,
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
            <Button appearance='text' onClick={() => handleEditableRow(props.row.original)}>
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
      header: '',
      cell: (props) => (
        <Button appearance='text'>
          <Icon label={t('global.delete')} icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />} />
          {t('global.delete')}
        </Button>
      ),
      id: 'delete',
      meta: {
        size: '1%',
      },
    }),
  ], [columnHelper, t, editableRow]);

  return (
    <DataTable data={examplesData} columns={examplesColumns} tableBodyPrefix={
      <tr>
        <td>
          <FormTextarea
            ref={newExampleRef}
            label={t('global.addNew')}
            name='newExample'
            minRows={1}
            placeholder={t('global.addNew') + '...' || ''}
            hideLabel
            maxLength={600}
            showMaxLength
          />
        </td>
        <td>
          <Button appearance='text' onClick={() => onAddNewExample(newExampleRef.current?.value || '')}>
            <Icon icon={<MdAddCircle color={'rgba(0,0,0,0.54)'} />} />
            {t('global.add')}
          </Button>
        </td>
        <td></td>
      </tr>
    } />
  );
};

export default IntentExamplesTable;
