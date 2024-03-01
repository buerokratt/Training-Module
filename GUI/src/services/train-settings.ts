import {TrainConfigDataDTO} from "../types/trainSettings";
import api from "./api";
import {DaysSelect} from "../components/FormElements/FormDaySelect/FormDaySelect";
import cronApi from "./cron-api";

export async function updateTrainSettings(request: TrainConfigDataDTO) {
    const { data } = await api.post<TrainConfigDataDTO>(`training/settings`, request);
    return data;
}

export async function initBotTraining() {
    const { data } = await cronApi.post<void>(`execute/train-bot/train_bot_now`);
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
        .map(day => String(parseInt(day.id) + 1))
        .join(',');
}