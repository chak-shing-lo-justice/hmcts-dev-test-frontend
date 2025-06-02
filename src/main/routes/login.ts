import { LOGIN_ROUTE } from '../constant';
import { doGet } from '../requestSvc';
import { renderListView } from '../searchCaseSvc';

import axios from 'axios';
import { Application, Request, Response } from 'express';

export const LOGIN_VIEW = 'login';

export function toLoginPage(req: Request, res: Response): void  {
  const redirectUrl = encodeURI(req.originalUrl);
  res.redirect(`${LOGIN_ROUTE}?redirect=${redirectUrl}`);
}

export function requireLogin (redirectView: string, callback: (req: any, res: Response) => void | Promise<void>) {
  return async (req: any, res: Response) : Promise<void> => {
    if (req?.cookies?.token) {
      await doGet(req, '/user/verify')
        .then(async () => callback(req, res))
        .catch(() => {
          toLoginPage(req, res);
        });
    } else {
      toLoginPage(req, res);
    }
  };
}

export default function (app: Application): void {
  app.get(LOGIN_ROUTE, async (req, res) => {
    res.render(LOGIN_VIEW, req.query);
  });

  app.post(LOGIN_ROUTE, async (req, res) => {
    let data = {};
    if (!req.body.username || !req.body.password) {
      console.log('Empty username or password');
      data = { errorMsg: 'Cannot be empty', errHref: '#login-user-name' };
    } else {
      try {
        const response = await axios.post('http://localhost:4000/user/login',
          { username: req.body.username, password: req.body.password });

        if (response.status === 200) {
          res.cookie('token', `${response.data}`);
          if (req.query.redirect) {
            res.redirect(decodeURI(req.query.redirect as string));
          } else {
            await renderListView(req, res);
          }
          return;
        } else {
          data = { errorMsg: 'Login failed. Please try again.', errorHref: '#login-user-name' };
        }
      } catch (err) {
        data = { errorMsg: 'Login failed. Please try again.', errorHref: '#login-user-name' };
      }
    }

    res.render(LOGIN_VIEW, { ...data, view: req.query.view, param: req.query.param, LOGIN_ROUTE });
  });
}
