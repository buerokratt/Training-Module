import { FC } from 'react';

import './FormCheckbox.scss';

type FormCheckboxType = {
  label: string;
  name: string;
  hideLabel?: boolean;
  item: {
    label: string;
    value: string;
  };
}

const FormCheckbox: FC<FormCheckboxType> = ({ label, name, hideLabel, item }) => {
  return (
    <div className='checkbox'>
      {label && !hideLabel && <label className='checkbox__label'>{label}</label>}
      <div className='checkbox__item'>
        <input type='checkbox' name={name} id={name} value={item.value} />
        <label htmlFor={`${name}-${item.value}`}>{item.label}</label>
      </div>
    </div>
  );
};

export default FormCheckbox;
