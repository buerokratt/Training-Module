import {DomainSelection} from "../types/widgetModels";
import {api} from "./api";

export async function getWidgetData(userId: string) {
    const { data } = await api.get<DomainSelection[]>('accounts/widget-data', {
        params: {
            user_id: userId,
        },
    });
    return data;
}
