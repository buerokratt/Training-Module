import { TrainConfigData } from "../types/trainSettings";
import api from "./api";

export async function updateTrainSettings(request: TrainConfigData) {
    const { data } = await api.post<TrainConfigData>(`slots/update`, request);
    return data;
}