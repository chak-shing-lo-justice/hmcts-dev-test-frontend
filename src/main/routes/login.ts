import { LOGIN_ROUTE } from '../constant';
import { doGet } from '../requestSvc';

import axios from 'axios';
import { Application, Response } from 'express';

export const LOGIN_VIEW = 'login';

// Return true if not login and will to redirect to login page
export function toLoginPage(res: Response, redirectView: string, data: any): void  {
  res.render(LOGIN_VIEW, { view: redirectView, param:JSON.stringify(data) });
}

export function requireLogin (redirectView: string, callback: (req: any, res: Response) => void | Promise<void>) {
  return async (req: any, res: Response) : Promise<void> => {
    if (req?.cookies?.token) {
      await doGet(req, '/user/verify')
        .then(async () => callback(req, res))
        .catch((err) => {
          console.log(err);
          toLoginPage(res, redirectView, req.query);
        });
    } else {
      toLoginPage(res, redirectView, req.query);
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
          if (req.query.view) {
            let param;
            if (req.query.param) {
              param = JSON.parse(req.query.param as string);
            }
            res.render(req.query.view as string, param);
          } else {
            res.render('list');
          }
          return;
        } else {
          data = { errorMsg: 'Login failed. Please try again.', errorHref: '#login-user-name' };
        }
      } catch (err) {
        data = { errorMsg: 'Login failed. Please try again.', errorHref: '#login-user-name' };
      }
    }

    res.render('login', { ...data, view: req.query.view, param: req.query.param, LOGIN_ROUTE });
  });
}
