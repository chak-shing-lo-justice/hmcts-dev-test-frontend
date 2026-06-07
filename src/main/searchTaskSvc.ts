import { SEARCH_ROUTE, TASK_ROUTE } from './constant';
import { doGet } from './requestSvc';

import { Request, Response } from 'express';

export const SEARCH_VIEW = 'list';

function buildTaskList(responseData: any[], searchString: string) {
  if (responseData) {
    return responseData.map(responseTask => [
      {
        html: `<a href='${TASK_ROUTE}?taskId=${responseTask?.id}&taskNameOrId=${searchString}'>${responseTask?.title}</a>`,
      },
      {
        text: responseTask?.status,
      },
      {
        text: responseTask?.createdDate,
      },
    ]);
  } else {
    return [];
  }
}

export async function getTaskById(req: Request, taskId: string): Promise<any> {
  return doGet(req, `/tasks/${taskId}`)
    .then(rsp => rsp.data[0]);
}

export async function searchTasksTitle(req: Request, searchString: string): Promise<any[]> {
  return doGet(req, '/tasks/search', { title: searchString }).then(titleSearchRsp => titleSearchRsp.data);
}

export async function renderListView(req: Request, res: Response, errorMsg?: string): Promise<void> {
  let taskList: any[] = [];
  const searchString = (req?.query?.taskNameOrId) ? req.query.taskNameOrId as string : '';
  if (searchString) {
    if (!isNaN(parseInt(searchString))) {
      taskList = taskList.concat(
        await getTaskById(req, searchString)
          .then(taskData => (taskData && taskData.id ? [taskData] : []))
          .catch(() => {
            return [];
          })
      );
    }
  }
  if (taskList.length === 0) {
    taskList = taskList.concat(
      await searchTasksTitle(req, searchString)
        .catch(() => {
          return [];
        })
    );
  }

  res.render(SEARCH_VIEW, { ...req.query, taskList: buildTaskList(taskList, searchString), errorMsg, SEARCH_ROUTE, TASK_ROUTE });
}
