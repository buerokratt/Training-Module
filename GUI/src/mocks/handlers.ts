import { rest } from 'msw';

import { mainNavigationET } from './mainNavigation';
import { intentsData } from './intents';
import { examplesData } from './examples';
import { responsesData } from './responses';
import { entitiesData } from './entities';
import { configurationData } from './configuration';
import { storiesData } from './stories';
import { rulesData } from './rules';
import { slotsData } from './slots';
import { formsData } from './forms';
import { conversationsData, singleConversation } from './conversations';
import { appealsData } from './appeals';
import { intentsReportData } from './intentsReport';
import { testStoriesData } from './testStories';

export const handlers = [
  rest.get(`${import.meta.env.BASE_URL}api/main-navigation`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: mainNavigationET,
      }),
    );
  }),
  rest.get(`${import.meta.env.BASE_URL}api/intents`, (req, res, ctx) => {
    const intents = intentsData.map((intent) => ({
      ...intent,
      examplesCount: (examplesData as Record<string, string[]>)[
        String(intent.id)
        ].length,
    }));

    return res(ctx.status(200), ctx.json(intents));
  }),
  rest.post(`${import.meta.env.BASE_URL}api/intents`, async (req, res, ctx) => {
    const newIntent = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        id: new Date().getTime(),
        ...newIntent,
      }),
    );
  }),
  rest.patch(`${import.meta.env.BASE_URL}api/intents/:id`, async (req, res, ctx) => {
    const intent = intentsData.find((i) => i.id === Number(req.params.id));
    const body = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        ...intent,
        ...body,
      }),
    );
  }),
  rest.delete(`${import.meta.env.BASE_URL}api/intents/:id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
    );
  }),
  rest.get(`${import.meta.env.BASE_URL}api/intents/:id/examples`, (req, res, ctx) => {
    const requestedExamples = (examplesData as Record<string, string[]>)[String(req.params.id)];

    if (!requestedExamples) {
      return res(ctx.status(404));
    }

    return res(ctx.status(200), ctx.json(requestedExamples));
  }),
  rest.post(`${import.meta.env.BASE_URL}api/intents/:id/examples`, async (req, res, ctx) => {
    const { example } = await req.json();

    if (example.length > 600) {
      return res(
        ctx.status(422),
        ctx.json({
          message: `Example length exceeds the maximum length of 600 characters`,
        }),
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: new Date().getTime(),
        example,
      }),
    );
  }),
  rest.patch(`${import.meta.env.BASE_URL}api/intents/:id/examples`, async (req, res, ctx) => {

  }),
  rest.get(`${import.meta.env.BASE_URL}api/responses`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(responsesData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/entities`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(entitiesData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/active-configuration`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(configurationData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/stories`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(storiesData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/rules`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(rulesData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/slots`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(slotsData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/forms`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(formsData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/conversations`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(conversationsData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/conversations/:id`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(singleConversation));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/appeals`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(appealsData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/intents-report`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(intentsReportData));
  }),
  rest.get(`${import.meta.env.BASE_URL}api/test-stories`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(testStoriesData));
  }),
];
