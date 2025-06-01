import { CASE_ROUTE } from '../constant';
import { CASE_VIEW, renderCaseView } from '../viewAndUpdateCaseSvc';

import { requireLogin } from './login';

import { Application } from 'express';

export default function (app: Application): void {
  app.get(CASE_ROUTE, requireLogin(CASE_VIEW, async (req, res) =>
    renderCaseView(req, res)
  ));

  app.post(CASE_ROUTE, requireLogin(CASE_VIEW, async (req, res) =>
    renderCaseView(req, res)
  ));
}
