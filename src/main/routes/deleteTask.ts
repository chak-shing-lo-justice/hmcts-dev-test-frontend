import { DELETE_TASK_ROUTE } from '../constant';
import { renderListView } from '../searchTaskSvc';
import { deleteTask, renderTaskView } from '../viewAndUpdateTaskSvc';

import { requireLogin } from './login';

import { Application } from 'express';

export default function (app: Application): void {
  app.get(
    DELETE_TASK_ROUTE,
    requireLogin(DELETE_TASK_ROUTE, async (req, res) => {
      if(await deleteTask(req)) {
        renderListView(req, res);
      } else {
        renderTaskView(req, res);
      }
    })
  );
}
