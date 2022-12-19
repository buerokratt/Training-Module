import { rest } from 'msw';

import { mainNavigationET } from './mainNavigation';
import { intentsData } from './intents';
import { examplesData } from './examples';

export const handlers = [
  rest.get(`${import.meta.env.BASE_URL}main-navigation`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: mainNavigationET,
      }),
    );
  }),
  rest.get(`${import.meta.env.BASE_URL}common-intents`, (req, res, ctx) => {
    const intents = intentsData.map((intent) => (
      {
        ...intent,
        examplesCount: (examplesData as Record<string, string[]>)[String(intent.id)].length,
      }
    ));

    return res(
      ctx.status(200),
      ctx.json(intents),
    );
  }),
  rest.get(`${import.meta.env.BASE_URL}common-intents/:id/examples`, (req, res, ctx) => {
    const requestedExamples = (examplesData as Record<string, string[]>)[String(req.params.id)];

    if (!requestedExamples) {
      return res(
        ctx.status(404),
      );
    }

    return res(
      ctx.status(200),
      ctx.json(requestedExamples),
    );
  }),
];
