import { ChangeEvent, forwardRef, useId, useState } from 'react';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';
import clsx from 'clsx';

import './FormTextarea.scss';

type TextareaProps = TextareaAutosizeProps & {
  label: string;
  name: string;
  hideLabel?: boolean;
  showMaxLength?: boolean;
  disableHeightResize?: boolean;
};

const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>((
  {
    label,
    name,
    maxLength = 2000,
    minRows = 3,
    maxRows = 3,
    disabled,
    hideLabel,
    showMaxLength,
    disableHeightResize = false,
    defaultValue,
    onChange,
    ...rest
  },
  ref,
) => {
  const id = useId();
  const [currentLength, setCurrentLength] = useState((typeof defaultValue === 'string' && defaultValue.length) || 0);
  const textareaClasses = clsx(
    'textarea',
    disabled && 'textarea--disabled',
    showMaxLength && 'textarea--maxlength-shown',
    disableHeightResize && 'textarea--disable-height-resize'
  );

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (showMaxLength) {
      setCurrentLength(e.target.value.length);
    }
  };

  return (
    <div className={textareaClasses}>
      {label && !hideLabel && <label htmlFor={id} className='textarea__label'>{label}</label>}
      <div className='textarea__wrapper'>
        <TextareaAutosize
          id={id}
          maxLength={maxLength}
          minRows={minRows}
          maxRows={maxRows}
          ref={ref}
          defaultValue={defaultValue}
          aria-label={hideLabel ? label : undefined}
          onKeyDown={(e) => {
            if (disableHeightResize && e.key === 'Enter') e.preventDefault();
          }}
          onChange={(e) => {
            if (onChange) onChange(e);
            handleOnChange(e);
          }}
          {...rest}
        />
        {showMaxLength && (
          <div className='textarea__max-length'>{currentLength}/{maxLength}</div>
        )}
      </div>
    </div>
  );
});

export default FormTextarea;
