import {TrainConfigDataDTO} from "../types/trainSettings";
import { rasaApi } from "./api";
import {DaysSelect} from "../components/FormElements/FormDaySelect/FormDaySelect";

export async function updateTrainSettings(request: TrainConfigDataDTO) {
    const { data } = await rasaApi.post<TrainConfigDataDTO>(`training/settings`, request);
    return data;
}

export async function initBotTraining() {
    const { data } = await rasaApi.get<void>(`model/init-train`);
    return data;
}

export const convertToDaySelect = (input: string, days: DaysSelect[]) => {
    const convertedInput = input.split(',');
    return days.map(d => {
        if(convertedInput.includes(d.id)) {
            d.checked = true;
        }
        return d;
    });
}

export const convertFromDaySelect = (days: DaysSelect[]) => {
    return days.filter(day => day.checked)
        .map(day => day.id)
        .join(',');
}
