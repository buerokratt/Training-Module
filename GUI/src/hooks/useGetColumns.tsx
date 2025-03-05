import { createColumnHelper } from '@tanstack/react-table';
import { MdOutlineModeEditOutline, MdDeleteOutline } from 'react-icons/md';
import { NavigateFunction } from 'react-router-dom';
import i18n from '../../i18n';
import { Button, Icon } from 'components';
import { useMemo } from 'react';

export const useGetColumns = (navigate: NavigateFunction, setDeletableSlot: (id: string) => void) => {
  const cols = useMemo(() => {
    const columnHelper = createColumnHelper<string>();
    return [
      columnHelper.accessor((row) => row, {
        header: i18n.t('training.slots.titleOne') || '',
      }),
      columnHelper.display({
        header: '',
        cell: (props) => (
          <Button appearance="text" onClick={() => navigate(`/training/slots/${props.row.original}`)}>
            <Icon label={i18n.t('global.edit')} icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />} />
            {i18n.t('global.edit')}
          </Button>
        ),
        id: 'edit',
        meta: {
          size: '1%',
        },
      }),
      columnHelper.display({
        header: '',
        cell: (props) => (
          <Button appearance="text" onClick={() => setDeletableSlot(props.row.original)}>
            <Icon label={i18n.t('global.delete')} icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />} />
            {i18n.t('global.delete')}
          </Button>
        ),
        id: 'delete',
        meta: {
          size: '1%',
        },
      }),
    ];
  }, [navigate, setDeletableSlot]);

  return cols;
};
