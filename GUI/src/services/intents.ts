import { fileApi, rasaApi } from './api';
import { Intent } from 'types/intent';

export async function addIntent(newIntentData: { name: string }) {
  const { data } = await rasaApi.post('/intents/add', newIntentData);
  return data;
}

export async function markForService(markData: { name: string, isForService: boolean }) {
  const { data } = await rasaApi.get(`/intents/mark-for-service?name=${markData.name}&isForService=${markData.isForService}`);
  return data;
}

export async function addIntentWithExample(newIntentExample: { intentName: string,newExamples: string }) {
  const { data } = await rasaApi.post('/intents/add-with-example', newIntentExample);
  return data;
}

export async function editIntent(editIntentData: {oldName: string, newName: string}) {
  const { data } = await rasaApi.post(`intents/update`, editIntentData);
  return data;
}

export async function deleteIntent(deleteIntentData: { name: string }) {
  const { data } = await rasaApi.post(`intents/delete`, deleteIntentData);
  return data;
}

export async function addRemoveIntentModel(intentModelData: {name: string, inModel: boolean}) {
  const { data } = await rasaApi.post(`intents/add-remove-from-model`, intentModelData);
  return data;
}

export async function getLastModified(intentModifiedData: {intentName: string}) {
  const { data } = await rasaApi.post(`intents/last-modified`, intentModifiedData);
  return data;
}

export async function addExample(addExampleData: { intentName: string, intentExamples: string[], newExamples: string }) {
  const { data } = await rasaApi.post<{ intentName: string; example: string; }>(`intents/examples/add`, addExampleData);
  return data;
}

export async function addExampleFromHistory(intentName: string, exampleData: { example: string }) {
  const request = { intentName: intentName, intentExamples: [], newExamples: exampleData.example };
  const {data} = await rasaApi.post<{ intentName: string; example: string; }>(`intents/examples/add`, request);
  return data;
}

export async function editExample(editExampleData: { intentName: string, oldExample: string, newExample: string }) {
  const { data } = await rasaApi.post<{ intentName: string; example: string; }>(`intents/examples/update`, editExampleData);
  return data;
}

export async function deleteExample(deleteExampleData: { intentName: string, example: string }) {
  const { data } = await rasaApi.post<{ intentName: string; example: string; }>(`intents/examples/delete`, deleteExampleData);
  return data;
}

export async function downloadExamples(downloadExampleData: { intentName: string }) {
  const { data } = await rasaApi.post<{ intentName: string; }>(`intents/download`, downloadExampleData);
  return data;
}

export async function uploadExamples(intentName: string, formData: File) {
  const formDataRequest = new FormData();
  formDataRequest.append('file', formData);

  const { data } = await fileApi.post(`/intents/upload?intentName=${intentName}`, formDataRequest);
  return data;
}


export async function turnExampleIntoIntent(data: {
  exampleName: string;
  intentName: string;
}): Promise<void> {
  await rasaApi.post('intents/add', {
    intent: data.exampleName,
  });
  await rasaApi.post(
    'intents/examples/delete',
    { intent: data.intentName, example: data.exampleName }
  );
}

export async function turnIntentIntoService(
  intent: Intent
): Promise<void> {
  await rasaApi.post('intents/turn-into-service', {
    intentName: intent.id
  });
}
