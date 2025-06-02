import { CASE_ROUTE, SEARCH_ROUTE } from './constant';
import { doGet } from './requestSvc';

import { Request, Response } from 'express';

export const SEARCH_VIEW = 'list';

function buildCaseList(responseData: any[], searchString: string) {
  if (responseData) {
    return responseData.map(responseCase => [
      {
        html: `<a href='${CASE_ROUTE}?caseId=${responseCase?.id}&caseNameOrId=${searchString}'>${responseCase?.title}</a>`,
      },
      {
        text: responseCase?.createdDate,
      },
    ]);
  } else {
    return [];
  }
}

export async function getCaseById(req: Request, caseId: string): Promise<any> {
  return doGet(req, `/cases/${caseId}`)
    .then(rsp => rsp.data[0]);
}

export async function searchCasesTitle(req: Request, searchString: string): Promise<any[]> {
  return doGet(req, '/cases/search', { title: searchString })
    .then(titleSearchRsp => titleSearchRsp.data);
}

export async function renderListView(req: Request, res: Response, errorMsg?: string): Promise<void> {
  let caseList: any[] = [];
  const searchString = req.query.caseNameOrId as string;
  if (searchString) {
    if (!isNaN(parseInt(searchString))) {
      caseList = caseList.concat(
        await getCaseById(req, searchString)
          .then(caseData => (caseData && caseData.id ? [caseData] : []))
          .catch(() => {
            return [];
          })
      );
    }

    if (caseList.length === 0) {
      caseList = caseList.concat(
        await searchCasesTitle(req, searchString)
          .catch(() => {
            return [];
          })
      );
    }
  }

  res.render(SEARCH_VIEW, { caseList: buildCaseList(caseList, searchString), errorMsg , SEARCH_ROUTE, CASE_ROUTE });
}
