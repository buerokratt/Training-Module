import { Box, Button, Card, FormInput, Switch } from 'components';
import { t } from 'i18next';
import styles from './TrainAndTest.module.scss';
import FormDaySelect, {
  DaysSelect,
} from 'components/FormElements/FormDaySelect/FormDaySelect';
import { useState } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

type Props = {};

type Data = {
  folds: number;
  newTopic: boolean;
  date: string | null;
  days: DaysSelect[];
  time: string | null;
};

const TrainAndTest = (props: Props) => {
  const [data, setData] = useState<Data>({
    folds: 0,
    newTopic: false,
    date: new Date().toISOString().split('T')[0],
    days: [],
    time: '12:00:00',
  });

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h1>{t('training.trainNew.title')}</h1>
        <p className={styles.top__date}>
          {t('training.trainNew.lastTrained', {
            date: '12.10.2022',
            time: '12:30:00',
          })}
        </p>
        <Button appearance="primary">{t('training.trainNew.trainNow')}</Button>
      </div>
      <Box
        color="red"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <AiOutlineExclamationCircle />
        <p className={styles.warning}>
          {t('training.trainNew.warning', {
            date: '12.10.2022',
            time: '12:30:00',
          })}
        </p>
      </Box>
      <Card
        header={t('training.trainNew.trainingTitle')}
        style={{
          width: '100%',
        }}
      >
        <div className={styles.card}>
          <div className={`${styles.trainingInput} ${styles.input}`}>
            <FormInput
              name={t('training.trainNew.folds')}
              label={t('training.trainNew.folds')}
              type="number"
              value={data.folds}
              onChange={(e) =>
                setData({ ...data, folds: parseInt(e.target.value) })
              }
            />
          </div>
          <div className={`${styles.trainingSwitch} ${styles.input}`}>
            <Switch
              name={t('training.newIntent')}
              label={t('training.newIntent')}
              onLabel={t('global.yes') || ''}
              offLabel={t('global.no') || ''}
              onCheckedChange={() =>
                setData({ ...data, newTopic: !data.newTopic })
              }
            />
          </div>
        </div>
      </Card>
      <Card
        header={t('training.trainNew.planTitle')}
        style={{
          width: '100%',
        }}
      >
        <div className={styles.card}>
          <div className={`${styles.planDate} ${styles.input}`}>
            <FormInput
              name={t('training.trainNew.date')}
              label={t('training.trainNew.date')}
              type="date"
              onChange={(e) => setData({ ...data, date: e.target.value })}
              value={data.date as string}
            />
          </div>

          <div className={`${styles.planDays} ${styles.input}`}>
            <span>{t('training.trainNew.days')}</span>
            <FormDaySelect
              onCheckedChange={(days) => setData({ ...data, days })}
            />
          </div>
          <div className={`${styles.planTime} ${styles.input}`}>
            <FormInput
              name={t('training.trainNew.time')}
              label={t('training.trainNew.time')}
              type="time"
              onChange={(e) => setData({ ...data, time: e.target.value })}
              step="1"
              value={data.time as string}
            />
          </div>
        </div>
      </Card>
      <div className={styles.bottom}>
        <Button appearance="primary">{t('global.save')}</Button>
      </div>
    </div>
  );
};

export default TrainAndTest;
