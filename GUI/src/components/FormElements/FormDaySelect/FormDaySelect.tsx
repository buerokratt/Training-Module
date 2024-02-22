import { ChangeEvent, FC, useState } from 'react';
import styles from './FormDaySelect.module.scss';
import {useTranslation} from "react-i18next";

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
  { id: '1', checked: true, name: 'global.days.monday' },
  { id: '2', checked: false, name: 'global.days.tuesday' },
  { id: '3', checked: false, name: 'global.days.wednesday' },
  { id: '4', checked: false, name: 'global.days.thursday' },
  { id: '5', checked: false, name: 'global.days.friday' },
  { id: '6', checked: false, name: 'global.days.saturday' },
  { id: '7', checked: false, name: 'global.days.sunday' },
];

const FormDaySelect: FC<Props> = ({ onCheckedChange, value }) => {
  const [data, setData] = useState<DaysSelect[]>(value || DAYS);
  const { t } = useTranslation();

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
              name={t(day.name).toString()}
              defaultChecked={day.checked}
              onChange={updateFieldChanged(i)}
              id={`${index}`}
            />
            <label htmlFor={`${index}`}>{t(day.name).slice(0, 1)}</label>
          </div>
        );
      })}
    </div>
  );
};

export default FormDaySelect;
