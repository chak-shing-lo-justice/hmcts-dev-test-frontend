import { DELETE_TASK_ROUTE, SEARCH_ROUTE, TASK_ROUTE } from './constant';
import { doDelete, doPost } from './requestSvc';
import { getTaskById, renderListView } from './searchTaskSvc';

import { Request, Response } from 'express';


export const TASK_VIEW = 'task';

export async function renderTaskView(req: Request, res: Response, errorMsg?: string): Promise<void> {
  if (req?.query?.taskId) {
    await getTaskById(req, req.query.taskId as string)
      .then(taskData => res.render(TASK_VIEW, { ...req.query, ...taskData, errorMsg , SEARCH_ROUTE, TASK_ROUTE , DELETE_TASK_ROUTE ,
        backHref: `${SEARCH_ROUTE}?taskNameOrId=${req.query.taskNameOrId}` }))
      .catch(() => renderListView(req, res, 'Error occur, please try again later.'));
  } else {
    res.render(TASK_VIEW, { ...req.query, errorMsg , SEARCH_ROUTE, TASK_ROUTE ,
      backHref: `${SEARCH_ROUTE}?taskNameOrId=${req.query.taskNameOrId}` });
  }
}

export async function saveTask(req: Request): Promise<any> {
  if (req?.body && req?.body?.title && req?.body?.description) {
    const isUpdatingTask = req.query?.taskId;
    const url = isUpdatingTask ? `/tasks/${req.query.taskId}` : '/tasks';
    const rsp = await doPost(req, url, {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });
    if (rsp.status === 200) {
      return rsp.data;
    }
  }
  throw new Error('Error');
}

export async function deleteTask(req: Request): Promise<any> {
  try {
    if (req?.query?.taskId) {
      const rsp = await doDelete(req, `/tasks/${req.query.taskId}`);
      if (rsp.status === 200) {
        return true;
      }
    }
  } catch (e) { /* empty */ }
  return false;
}
