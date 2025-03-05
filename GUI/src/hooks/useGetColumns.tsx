import { createColumnHelper } from '@tanstack/react-table';
import { MdOutlineModeEditOutline, MdDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import i18n from '../../i18n';
import { Button, Icon } from 'components';
import { useMemo } from 'react';

export const useGetColumns = (type: 'slots' | 'forms', onDeleteItem: (id: string) => void) => {
  const navigate = useNavigate();

  const cols = useMemo(() => {
    const columnHelper = createColumnHelper<string>();

    return [
      columnHelper.accessor((row) => row, {
        header: i18n.t(`training.${type}.titleOne`) || '',
      }),
      columnHelper.display({
        header: '',
        cell: (props) => (
          <Button appearance="text" onClick={() => navigate(`/training/${type}/${props.row.original}`)}>
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
          <Button appearance="text" onClick={() => onDeleteItem(props.row.original)}>
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
  }, [navigate, onDeleteItem, type]);

  return cols;
};
