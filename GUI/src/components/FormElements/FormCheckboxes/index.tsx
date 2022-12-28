import { FC } from 'react';

import './FormCheckboxes.scss';

type FormCheckboxesType = {
  label: string;
  name: string;
  hideLabel?: boolean;
  items: {
    label: string;
    value: string;
  }[];
}

const FormCheckboxes: FC<FormCheckboxesType> = ({ label, name, hideLabel, items }) => {


  return (
    <fieldset className='checkboxes'>
      {label && !hideLabel && <legend className='checkboxes__legend'>{label}</legend>}
      <div className='checkboxes__wrapper'>
        {items.map((item) => (
          <div className='checkboxes__item'>
            <input type='checkbox' name={name} id={`${name}-${item.value}`} value={item.value} />
            <label htmlFor={`${name}-${item.value}`}>{item.label}</label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default FormCheckboxes;
