import { TASK_ROUTE } from '../constant';
import { TASK_VIEW, renderTaskView, saveTask } from '../viewAndUpdateTaskSvc';

import { requireLogin } from './login';

import { Application } from 'express';

export default function (app: Application): void {
  app.get(
    TASK_ROUTE,
    requireLogin(TASK_VIEW, async (req, res) => renderTaskView(req, res))
  );

  app.post(TASK_ROUTE, requireLogin(TASK_VIEW, async (req, res) => {
    try {
      const updatedData = await saveTask(req);
      req.query.taskId = updatedData?.id || req.query.taskId;
      renderTaskView(req, res);
    } catch (e) {
      renderTaskView(req, res, 'Please retry');
    }
  }));
}
