import { CASE_ROUTE, SEARCH_ROUTE } from './constant';
import { getCaseById, renderListView } from './searchCaseSvc';

import { Request, Response } from 'express';


export const CASE_VIEW = 'case';

export async function renderCaseView(req: Request, res: Response, errorMsg?: string): Promise<void> {
  if (req?.query?.caseId) {
    await getCaseById(req, req.query.caseId as string)
      .then(caseData => res.render(CASE_VIEW, { ...req.query, ...caseData, errorMsg , SEARCH_ROUTE, CASE_ROUTE ,
        backHref: `${SEARCH_ROUTE}?caseNameOrId=${req.query.caseNameOrId}` }))
      .catch(() => renderListView(req, res, 'Error occur, please try again later.'));
  } else {
    await renderListView(req, res, 'Error occur, please try again later.');
  }
}
