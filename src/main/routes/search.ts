import { SEARCH_ROUTE } from '../constant';
import { renderListView } from '../searchCaseSvc';

import { requireLogin } from './login';

import { Application } from 'express';


export default function (app: Application): void {
  app.get(
    SEARCH_ROUTE,
    requireLogin('list', async (req, res) =>
      renderListView(req, res)
    )
  );
}
