import { FC, Fragment, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import regexifyString from 'regexify-string';

import { Button, Tooltip, Track } from 'components';

type IntentExamplesEntryProps = {
  value: string;
}

const IntentExamplesEntry: FC<IntentExamplesEntryProps> = ({ value }) => {
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
        <Track gap={4}>
          <Button size='s' onClick={() => setEditableEntity(result?.[2] || null)}>{t('global.edit')}</Button>
          <Button size='s' onClick={handleExampleEntityDelete}>{t('global.delete')}</Button>
        </Track>
      }>
        <span className='entity'>{result?.[1]}<span>{result?.[2]}</span></span>
      </Tooltip>
    ),
    input: value,
  }), [t, value]);

  return (
    <p ref={ref}>
      {parsedEntry.map((e, index) => <Fragment key={`${e.toString()}-${index}`}>{e}</Fragment>)}
    </p>
  );
};

export default IntentExamplesEntry;
