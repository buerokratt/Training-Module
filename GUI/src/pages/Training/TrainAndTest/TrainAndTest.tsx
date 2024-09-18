import {Box, Button, Card, FormInput, Switch, Tooltip, Track} from 'components';
import {t} from 'i18next';
import styles from './TrainAndTest.module.scss';
import FormDaySelect, {DAYS, DaysSelect} from 'components/FormElements/FormDaySelect/FormDaySelect';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {TrainConfigDataDTO, TrainedDataDTO} from "../../../types/trainSettings";
import {Controller, useForm} from "react-hook-form";
import {AxiosError} from "axios";
import {useToast} from "../../../hooks/useToast";
import {
    convertFromDaySelect,
    convertToDaySelect,
    initBotTraining,
    updateTrainSettings
} from "../../../services/train-settings";
import React, {useEffect, useState} from "react";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import useStore from "../../../store/store";
import {format} from "date-fns";
import {DATE_FORMAT, TIME_FORMAT} from "../../../utils/datetime-fromat";
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import { isHiddenFeaturesEnabled } from '../../../constants/config';

const TrainAndTest = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const {data: settingsData} = useQuery<TrainConfigDataDTO>({
        queryKey: ['training/settings'],
    });
    const {data: trainedData} = useQuery<TrainedDataDTO>({
        queryKey: ['training/trained'],
    });
    const [folds, setFolds] = useState<string>('8');
    const [scheduled, setScheduled] = useState<boolean>(false);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState<string>('17:00:00');
    const [days, setDays] = useState<DaysSelect[]>(DAYS);
    const [llmFailed, setLlmFailed] = useState<boolean>(false);
    const [lastTrainedDay, setLastTrainedDay] = useState<string>(new Date().toISOString().split('T')[0]);
    const [lastTrainedTime, setLastTrainedTime] = useState<string>(new Date().toISOString().split("T")[1].split(".")[0]);
    const userInfo = useStore((state) => state.userInfo);

    const {control, handleSubmit, reset} = useForm<TrainConfigDataDTO>({
        mode: 'onChange',
        shouldUnregister: true,
    });

    useEffect(() => {
        if (settingsData) {
            setFolds(String(settingsData.rasaFolds));
            setDays(convertToDaySelect(settingsData.daysOfWeek || '', days));
            setScheduled(settingsData.scheduled);
            setDate(settingsData.fromDate.split('T')[0]);
            setTime(settingsData.fromDate.split("T")[1].split(".")[0]);
            reset(settingsData);
        }
    }, [reset, settingsData]);

    useEffect(() => {
        if(trainedData?.trainedDate) {
            setLlmFailed(trainedData.state === 'Failed');
            setLastTrainedTime(format(new Date(trainedData.trainedDate),TIME_FORMAT));
            setLastTrainedDay(format(new Date(trainedData.trainedDate),DATE_FORMAT));
        }
    }, [trainedData]);

    const trainSettingsEditMutation = useMutation({
        mutationFn: (request: TrainConfigDataDTO) => updateTrainSettings(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['training/train-settings']);
            toast.open({
                type: 'success',
                title: t('global.notification'),
                message: t('toast.trainSettingsChangesSaved'),
            });
        },
        onError: (error: AxiosError) => {
            toast.open({
                type: 'error',
                title: t('global.notificationError'),
                message: error.message,
            });
        },
    });

    const handleTrainSettingsSave = handleSubmit((data) => {
        data.fromDate = new Date(`${date}T${time}.000Z`).toISOString();
        data.daysOfWeek = convertFromDaySelect(days);
        data.modifierId = userInfo?.idCode ?? 'unknown';
        data.modifierName = `${userInfo?.firstName} ${userInfo?.lastName}`;
        trainSettingsEditMutation.mutate(data);
    });

    const trainNowMutation = useMutation({
        mutationFn: () => initBotTraining(),
        onSuccess: async () => {
            toast.open({
                type: 'success',
                title: t('global.notification'),
                message: t('toast.trainingIsInitialized'),
            });
        },
        onError: (error: AxiosError) => {
            toast.open({

                type: 'error',
                title: t('global.notificationError'),
                message: error.message,
            });
        },
    });

    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <h1>{t('training.trainNew.title')}</h1>
          <p className={styles.top__date}>
            {t('training.trainNew.lastTrained', {
              date: lastTrainedDay,
              time: lastTrainedTime,
            })}
          </p>
          <Track gap={10}>
            <Tooltip content={t('training.trainNew.trainTooltip')}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  onClick={() => trainNowMutation.mutate()}
                  appearance="primary"
                >
                  {t('training.trainNew.train')}
                </Button>
              </span>
            </Tooltip>
            <Tooltip content={t('training.trainNew.trainAndTestTooltip')}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  onClick={() => trainNowMutation.mutate()}
                  appearance="primary"
                >
                  {t('training.trainNew.trainAndTest')}
                </Button>
              </span>
            </Tooltip>
          </Track>
        </div>
        {llmFailed && trainedData && (
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
                date: lastTrainedDay,
                time: lastTrainedTime,
              })}
            </p>
          </Box>
        )}
        <Card
          header={t('training.trainNew.trainingTitle')}
          style={{
            width: '100%',
          }}
        >
          <div className={styles.card}>
            {isHiddenFeaturesEnabled && (
              <div className={`${styles.trainingInput} ${styles.input}`}>
                <Controller
                  name="rasaFolds"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      value={folds}
                      label={t('training.trainNew.folds')}
                      type="number"
                      onChange={(e) => {
                        setFolds(e.target.value);
                        field.onChange(parseInt(e.target.value));
                      }}
                    />
                  )}
                />
              </div>
            )}
            <div className={`${styles.trainingSwitch} ${styles.input}`}>
              <Controller
                name="scheduled"
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={scheduled}
                    onCheckedChange={(e) => {
                      setScheduled(e);
                      field.onChange(e);
                    }}
                    onLabel={t('global.yes') ?? ''}
                    offLabel={t('global.no') ?? ''}
                    label={t('training.trainNew.repeatTraining')}
                  />
                )}
              />
            </div>
          </div>
        </Card>
        {scheduled && (
          <Card
            header={t('training.trainNew.planTitle')}
            style={{
              width: '100%',
            }}
          >
            <div className={styles.card}>
              <div className={`${styles.planDate} ${styles.input}`}>
                <FormInput
                  name={'date'}
                  value={date}
                  label={t('training.trainNew.date')}
                  type="date"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </div>

              <div className={`${styles.planDays} ${styles.input}`}>
                <span>{t('training.trainNew.days')}</span>
                <Controller
                  name="daysOfWeek"
                  control={control}
                  render={({ field }) => (
                    <FormDaySelect
                      {...field}
                      value={days}
                      onCheckedChange={(days) => {
                        setDays(days);
                        field.onChange(days);
                      }}
                    />
                  )}
                />
              </div>
              <div className={`${styles.planTime} ${styles.input}`}>
                <FormInput
                  name={'time'}
                  value={time}
                  label={t('training.trainNew.time')}
                  type="time"
                  step="1"
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                />
              </div>
            </div>
          </Card>
        )}
        <div className={styles.bottom}>
          <Button onClick={handleTrainSettingsSave} appearance="primary">
            {t('global.save')}
          </Button>
        </div>
      </div>
    );
};

export default withAuthorization(TrainAndTest, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
