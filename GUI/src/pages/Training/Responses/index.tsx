import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline } from 'react-icons/md';

import { Button, Card, DataTable, FormInput, FormTextarea, Icon, Label, Track } from 'components';
import type { Responses as ResponsesType } from 'types/response';

const Responses: FC = () => {
  const { t } = useTranslation();
  const { data: responses } = useQuery<ResponsesType>({
    queryKey: ['responses'],
  });
  const [addFormVisible, setAddFormVisible] = useState(false);

  const formattedResponses = useMemo(() => responses ? Object.keys(responses).map((r) => ({
    response: r,
    text: responses[r].text,
  })) : [], [responses]);

  const handleResponseDelete = async () => {
    //TODO: Add mock endpoint for deleting a response
  };

  const handleNewResponseSubmit = async () => {
    //TODO: Add mock endpoint for adding new response
  };

  const columnHelper = createColumnHelper<typeof formattedResponses[0]>();

  const responsesColumns = [
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
      cell: (props) =>
        <FormTextarea
          label='label'
          name='name'
          defaultValue={props.getValue()}
          hideLabel minRows={1}
          maxLength={400}
          showMaxLength
        />,
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
  ];

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
        <DataTable data={formattedResponses} columns={responsesColumns} />
      </Card>
    </>
  );
};

export default Responses;
