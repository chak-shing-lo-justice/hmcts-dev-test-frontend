import { LOGIN_ROUTE, LOGOUT_ROUTE } from '../constant';
import { doGet } from '../requestSvc';

import { Application } from 'express';

export const LOGIN_VIEW = 'login';

export default function (app: Application): void {
  app.get(LOGOUT_ROUTE, async (req, res) => {
    await doGet(req, '/user/logout');
    res.redirect(LOGIN_ROUTE);
  });
}

