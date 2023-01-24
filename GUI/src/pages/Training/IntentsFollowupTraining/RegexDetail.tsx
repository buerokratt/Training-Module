import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { createColumnHelper } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { MdOutlineModeEditOutline, MdOutlineSave } from 'react-icons/md';

import { Button, Card, DataTable, FormInput, Icon, Track } from 'components';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { useToast } from 'hooks/useToast';
import { editRegex } from 'services/regex';

type Regex = {
  readonly id: number;
  name: string;
  examples: string[];
  modifiedAt: Date | string;
}

const RegexDetail: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const toast = useToast();
  const [editingRegexTitle, setEditingRegexTitle] = useState<string | null>(null);
  const [editableRow, setEditableRow] = useState<{
    id: number;
    value: string;
  } | null>(null);
  const [deletableRegex, setDeletableRegex] = useState<string | number | null>(null);
  const { data: regex } = useQuery<Regex>({
    queryKey: [`regex/${id}`],
    enabled: !!id,
  });

  useDocumentEscapeListener(() => setEditableRow(null));

  const regexData = useMemo(
    () => regex && regex.examples.map((e, index) => ({ id: index, value: e })),
    [regex],
  );

  const regexEditMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: { name: string } }) => editRegex(id, data),
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New regex example added',
      });
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

  const columnHelper = createColumnHelper<{ id: number; value: string }>();

  const regexColumns = useMemo(() => [
    columnHelper.accessor('value', {
      header: t('training.intents.examples') || '',
    }),
  ], [columnHelper, t]);

  const handleRegexExamplesUpload = (regexId: string | number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.click();
  };

  const handleRegexExamplesDownload = (regexId: string | number) => {

  };

  return (
    <>
      <h1>{t('training.intents.regex')}</h1>

      {regex && (
        <Card
          header={
            <Track direction='vertical' align='stretch' gap={8}>
              <Track justify='between'>
                <Track gap={16}>
                  {editingRegexTitle ? (
                    <FormInput
                      label='Intent title'
                      name='intentTitle'
                      value={editingRegexTitle}
                      onChange={(e) =>
                        setEditingRegexTitle(e.target.value)
                      }
                      hideLabel
                    />
                  ) : (
                    <h3>{regex.name}</h3>
                  )}
                  {editingRegexTitle ? (
                    <Button
                      appearance='text'
                      onClick={() =>
                        regexEditMutation.mutate({ id: regex.id, data: { name: editingRegexTitle } })
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
                <p style={{ color: '#4D4F5D' }}>
                  {`${t('global.modifiedAt')} ${format(
                    new Date(regex.modifiedAt),
                    'dd.MM.yyyy',
                  )}`}
                </p>
              </Track>
              <Track justify='end' gap={8}>
                <Button
                  appearance='secondary'
                  onClick={() =>
                    handleRegexExamplesUpload(regex.id)
                  }
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
          <DataTable data={regexData} columns={regexColumns} />
        </Card>
      )}
    </>
  );
};

export default RegexDetail;
