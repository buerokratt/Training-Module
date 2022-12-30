import { CSSProperties, FC, Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import regexifyString from 'regexify-string';
import { Popover } from 'react-text-selection-popover';

import { Button, FormSelect, Tooltip, Track } from 'components';
import { Entity } from 'types/entity';

type IntentExamplesEntryProps = {
  value: string;
  entities: Entity[];
}

const IntentExamplesEntry: FC<IntentExamplesEntryProps> = ({ value, entities }) => {
  const { t } = useTranslation();
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [editableEntity, setEditableEntity] = useState<string | null>(null);

  const handleExampleEntityDelete = () => {
    // TODO: Add mock endpoint for deleting entity
  };

  const handleExampleEntityEdit = () => {
    if (!editableEntity) return;
    // TODO: Add endpoint for mocking entity edit
  };

  const parsedEntry = useMemo(() => regexifyString({
    pattern: /\[(.+?)\]\((.+?)\)/gmu,
    decorator: (match, index, result) => (
      <Tooltip content={
        <Track direction='vertical' gap={4} align='left' style={{ padding: 8 }}>
          <h4>{result?.[1]}</h4>
          <FormSelect label='' name='entity' options={entities.map((e) => ({ label: e.name, value: e.id + '' }))} />
          <Track gap={4}>
            <Button appearance='error'>{t('global.delete')}</Button>
            <Button appearance='secondary'>{t('global.cancel')}</Button>
            <Button>{t('global.save')}</Button>
          </Track>
        </Track>
      }>
        <span className='entity'>{result?.[1]}<span>{result?.[2]}</span></span>
      </Tooltip>
    ),
    input: value,
  }), [entities, t, value]);

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
              left: `${clientRect.left + clientRect.width / 2}px`,
              top: `${clientRect.top - 7}px`,
              background: 'white',
              borderRadius: '4px',
              filter: ' drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.25))',
              transform: 'translate(-50%, -100%)',
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
              <div style={popoverStyles} onClickCapture={(e) => console.log(e)}>
                <Track
                  direction='vertical'
                  gap={4}
                  align='left'
                  style={{ padding: 16 }}
                >
                  <h4>{textContent}</h4>
                  <FormSelect
                    label={t('training.intents.entity')}
                    hideLabel
                    name='entity'
                    options={entities.map((e) => ({ label: e.name, value: e.id + '' }))}
                  />
                  <Track gap={4}>
                    <Button appearance='secondary'>{t('global.cancel')}</Button>
                    <Button>{t('global.add')}</Button>
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

export default IntentExamplesEntry;
