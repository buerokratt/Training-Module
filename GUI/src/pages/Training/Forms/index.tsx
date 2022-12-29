import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';

import { Button, Card, DataTable, FormInput, Icon, Track } from 'components';
import { Form } from 'types/form';

const Forms: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const { data: forms } = useQuery<Form[]>({
    queryKey: ['forms'],
  });

  const columnHelper = createColumnHelper<Form>();

  const formsColumns = useMemo(() => [
    columnHelper.accessor('form', {
      header: t('training.forms.titleOne') || '',
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button
          appearance='text'
          // onClick={() => navigate(`/treening/kasutuslood/${props.row.original.id}`)}
        >
          <Icon
            label={t('global.edit')}
            icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />}
          />
          {t('global.edit')}
        </Button>
      ),
      id: 'edit',
      meta: {
        size: '1%',
      },
    }),
    columnHelper.display({
      header: '',
      cell: () => (
        <Button appearance='text'>
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
  ], [columnHelper, t]);

  if (!forms) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.forms.title')}</h1>

      <Card header={
        <Track gap={16}>
          <FormInput
            label={t('global.search')}
            name='search'
            placeholder={t('global.search') + '...'}
            hideLabel
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={() => navigate('/treening/treening/vormid/uus')}>{t('global.add')}</Button>
        </Track>
      }>
        <DataTable data={forms} columns={formsColumns} globalFilter={filter} setGlobalFilter={setFilter} />
      </Card>
    </>
  );
};

export default Forms;
