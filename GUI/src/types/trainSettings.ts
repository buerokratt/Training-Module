import {DaysSelect} from "../components/FormElements/FormDaySelect/FormDaySelect";

export interface TrainConfigData {
    folds: number;
    scheduled: boolean;
    date: string | null;
    days: DaysSelect[];
    time: string | null;
}

export interface TrainConfigDataDTO {
    folds: number;
    scheduled: boolean;
    fromdate: string;
    daysofweek: string;
}

export interface TrainConfigDataEditDTO extends Omit<TrainConfigData, 'id'> {
}