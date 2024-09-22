import {DaysSelect} from "../components/FormElements/FormDaySelect/FormDaySelect";

export interface TrainConfigData {
    folds: number;
    scheduled: boolean;
    date: string | null;
    days: DaysSelect[];
    time: string | null;
}

export interface TrainConfigDataDTO {
    rasaFolds: number;
    scheduled: boolean;
    fromDate: string;
    daysOfWeek: string;
    modifierId: string;
    modifierName: string;
}

export interface TrainedDataDTO {
    modelType: string;
    state: string;
    trainedDate: string;
}

export interface LatestStatusDTO {
  id: number;
  versionNumber: string;
  state: string;
}

export interface TrainConfigDataEditDTO extends Omit<TrainConfigData, 'id'> {
}
