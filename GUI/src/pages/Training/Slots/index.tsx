import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Button, Card, DataTable, FormInput, Icon, Track } from 'components';
import { Slot } from 'types/slot';

const Slots: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const { data: slots } = useQuery<Slot[]>({
    queryKey: ['slots'],
  });
  const columnHelper = createColumnHelper<Slot>();

  const slotsColumns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Slot',
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

  if (!slots) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.slots.title')}</h1>

      <Card header={
        <Track gap={16}>
          <FormInput
            label='search'
            name='search'
            placeholder={t('global.search') + '...'}
            hideLabel
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={() => navigate('/treening/treening/pilud/uus')}>{t('global.add')}</Button>
        </Track>
      }>
        <DataTable data={slots} columns={slotsColumns} disableHead globalFilter={filter} setGlobalFilter={setFilter} />
      </Card>
    </>
  );
};

export default Slots;
