import {DaysSelect} from "../components/FormElements/FormDaySelect/FormDaySelect";

export interface TrainConfigData {
    folds: number;
    scheduled: boolean;
    date: string | null;
    days: DaysSelect[];
    time: string | null;
}

export interface TrainConfigDataEditDTO extends Omit<TrainConfigData, 'id'> {
}