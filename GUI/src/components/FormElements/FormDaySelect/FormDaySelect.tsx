import { ChangeEvent, FC, useState } from 'react';
import styles from './FormDaySelect.module.scss';

export type DaysSelect = {
  checked: boolean;
  name: string;
  id: string;
};

type Props = {
  onCheckedChange?: (values: DaysSelect[]) => void;
  value: DaysSelect[];
};

export const DAYS = [
  { id: '1', checked: true, name: 'Esmaspäev' },
  { id: '2', checked: false, name: 'Teisipäev' },
  { id: '3', checked: false, name: 'Kolmapäev' },
  { id: '4', checked: false, name: 'Neljapäev' },
  { id: '5', checked: false, name: 'Reede' },
  { id: '6', checked: false, name: 'Laupäev' },
  { id: '7', checked: false, name: 'Pühapäev' },
];

const FormDaySelect: FC<Props> = ({ onCheckedChange, value }) => {
  const [data, setData] = useState<DaysSelect[]>(value || DAYS);

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
      {data.map((day, i) => {
        const index = i + 1;
        return (
          <div key={i} className={styles.inputs}>
            <input
              type="checkbox"
              name={day.name}
              defaultChecked={day.checked}
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
