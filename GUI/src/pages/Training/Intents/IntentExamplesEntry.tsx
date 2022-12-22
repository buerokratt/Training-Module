import { FC, Fragment, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import regexifyString from 'regexify-string';

import { Button, FormSelect, Tooltip, Track } from 'components';
import { Entity } from 'types/entity';

type IntentExamplesEntryProps = {
  value: string;
  entities: Entity[];
}

const IntentExamplesEntry: FC<IntentExamplesEntryProps> = ({ value, entities }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLParagraphElement>(null);
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
    <p ref={ref}>
      {parsedEntry.map((e, index) => <Fragment key={`${e.toString()}-${index}`}>{e}</Fragment>)}
    </p>
  );
};

export default IntentExamplesEntry;
