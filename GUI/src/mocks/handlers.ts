import { rest } from 'msw';

import { mainNavigationET } from './mainNavigation';
import { intentsData } from './intents';
import { examplesData } from './examples';
import { responsesData } from './responses';
import { entitiesData } from './entities';

export const handlers = [
  rest.get(`/api/main-navigation`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: mainNavigationET,
      })
    );
  }),
  rest.get(`/api/intents`, (req, res, ctx) => {
    const intents = intentsData.map((intent) => ({
      ...intent,
      examplesCount: (examplesData as Record<string, string[]>)[
        String(intent.id)
      ].length,
    }));

    return res(ctx.status(200), ctx.json(intents));
  }),
  rest.post(`/api/intents`, async (req, res, ctx) => {
    const newIntent = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        id: new Date().getTime(),
        ...newIntent,
      })
    );
  }),
  rest.get(`/api/intents/:id/examples`, (req, res, ctx) => {
    const requestedExamples = (examplesData as Record<string, string[]>)[
      String(req.params.id)
    ];

    if (!requestedExamples) {
      return res(ctx.status(404));
    }

    return res(ctx.status(200), ctx.json(requestedExamples));
  }),
  rest.post(`/api/intents/:id/examples`, async (req, res, ctx) => {
    const { example } = await req.json();

    if (example.length > 600) {
      return res(
        ctx.status(422),
        ctx.json({
          message: `Example length exceeds the maximum length of 600 characters`,
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: new Date().getTime(),
        example,
      })
    );
  }),
  rest.get(`/api/responses`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(responsesData));
  }),
  rest.get(`/api/entities`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(entitiesData));
  }),
];
