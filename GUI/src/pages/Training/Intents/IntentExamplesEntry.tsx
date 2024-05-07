import { CSSProperties, FC, Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import regexifyString from 'regexify-string';
import { useMutation } from '@tanstack/react-query';
import { Popover } from 'react-text-selection-popover';
import { AxiosError } from 'axios';

import { Button, FormSelect, Tooltip, Track } from 'components';
import { Entity } from 'types/entity';
import { useToast } from 'hooks/useToast';
import { deleteEntity } from 'services/entities';
import { useForm } from 'react-hook-form';
import i18n from '../../../../i18n';

type IntentExamplesEntryProps = {
  value: string;
  entities: Entity[];
  onEntityAdd?: (example: string) => void;
}

const IntentExamplesEntry: FC<IntentExamplesEntryProps> = ({ value, entities, onEntityAdd }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const { register, handleSubmit } = useForm<{ entity: string }>({
    mode: 'onChange',
    shouldUnregister: true,
  });

  const entityDeleteMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteEntity(id),
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Entity deleted from example',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
  });

  const handleEntityAdd = handleSubmit((data) => {
    console.log(data);
  });

  const parsedEntry = useMemo(
    () => getRegexifiedString(entities, value, () => entityDeleteMutation.mutate({ id: value })), 
  [entities, value]);

  return (
    <>
      <p ref={(el) => el !== null && setRef(el)}>
        {parsedEntry.map((e, index) => <Fragment key={`${e.toString()}-${index}`}>{e}</Fragment>)}
      </p>
      {ref && (
        <Popover target={ref} render={
          ({ clientRect, isCollapsed, textContent }) => {
            if (!clientRect || isCollapsed) return null;

            const popoverStyles = {
              position: 'absolute',
              minWidth: '340px',
              left: `${clientRect.left + clientRect.width / 2}px`,
              top: `${clientRect.top - 7}px`,
              background: 'white',
              borderRadius: '4px',
              filter: 'drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.25))',
              transform: 'translate(-50%, -100%)',
              userSelect: 'none',
            } as CSSProperties;

            const arrowStyles = {
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              width: '6.73px',
              height: '6.73px',
              backgroundColor: 'white',
            } as CSSProperties;

            return (
              <div style={popoverStyles}>
                <Track
                  direction='vertical'
                  gap={4}
                  align='stretch'
                  style={{ padding: 16 }}
                >
                  <h4>{textContent}</h4>
                  <FormSelect
                    {...register('entity')}
                    label={t('training.intents.entity')}
                    hideLabel
                    options={entities.map((e) => ({ label: e.name, value: e.id + '' }))}
                  />
                  <Track gap={4} justify='end'>
                    <Button onClick={handleEntityAdd}>{t('global.add')}</Button>
                  </Track>
                </Track>
                <span style={arrowStyles}></span>
              </div>
            );
          }
        } />
      )}
    </>
  );
};

const getRegexifiedString = (entities: Entity[], value: string, onClick: () => void) => {
  return regexifyString({
    pattern: /\[(.{1,512}?)\]\((.{1,512}?)\)/gmu,
    decorator: (match, index, result) => (
      <Tooltip content={<Track direction='vertical' gap={4} align='left' style={{ padding: 8 }}>
        <h4>{result?.[1]}</h4>
        <FormSelect
          label={i18n.t('training.intents.entity')}
          hideLabel
          name='entity'
          defaultValue={entities.find((e) => e.name === result?.[2])?.id + ''}
          options={entities.map((e) => ({ label: e.name, value: e.id + '' }))} />
        <Track gap={4}>
          <Button
            appearance='error'
            onClick={onClick}
          >
            {i18n.t('global.delete')}
          </Button>
          <Button>{i18n.t('global.save')}</Button>
        </Track>
      </Track>}>
        <span className='entity'>{result?.[1]}<span>{result?.[2]}</span></span>
      </Tooltip>
    ),
    input: value,
  });
}

export default IntentExamplesEntry;
