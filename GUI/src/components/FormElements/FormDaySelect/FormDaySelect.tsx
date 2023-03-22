import { ChangeEvent, FC, useState } from 'react';
import styles from './FormDaySelect.module.scss';

export type DaysSelect = {
  checked: boolean;
  name: string;
  id: string;
};

type Props = {
  onCheckedChange?: (values: DaysSelect[]) => void;
};

const DAYS = [
  { id: '1', name: 'Esmaspäev', checked: false },
  { id: '2', name: 'Teisipäev', checked: false },
  { id: '3', name: 'Kolmapäev', checked: false },
  { id: '4', name: 'Neljapäev', checked: false },
  { id: '5', name: 'Reede', checked: false },
  { id: '6', name: 'Laupäev', checked: false },
  { id: '7', name: 'Pühapäev', checked: false },
];

const FormDaySelect: FC<Props> = ({ onCheckedChange }) => {
  const [data, setData] = useState<DaysSelect[]>([
    { id: '1', checked: false, name: 'Esmaspäev' },
    { id: '2', checked: false, name: 'Teisipäev' },
    { id: '3', checked: false, name: 'Kolmapäev' },
    { id: '4', checked: false, name: 'Neljapäev' },
    { id: '5', checked: false, name: 'Reede' },
    { id: '6', checked: false, name: 'Laupäev' },
    { id: '7', checked: false, name: 'Pühapäev' },
  ]);

  const updateFieldChanged =
    (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { checked, id, name } = e.target;
      const newData = [...data];
      newData[i] = { id, checked, name };
      setData(newData);
      onCheckedChange && onCheckedChange(newData);
    };
  return (
    <div className={styles.container}>
      {DAYS.map((day, i) => {
        const index = i + 1;
        return (
          <div key={i} className={styles.inputs}>
            <input
              type="checkbox"
              name={day.name}
              onChange={updateFieldChanged(i)}
              id={`${index}`}
            />
            <label htmlFor={`${index}`}>{day.name.slice(0, 1)}</label>
          </div>
        );
      })}
    </div>
  );
};

export default FormDaySelect;
