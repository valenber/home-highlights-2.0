// here we define endpoints and use handlers to process API calls into DB requests

import { NextApiResponse, NextApiRequest } from 'next';
import databaseService from '../../services/databaseService';

type FixMeLater = any;

export default async function(
  req: NextApiRequest | { method: any; body: any },
  res: NextApiResponse | FixMeLater,
) {
  const { method, body } = req;

  switch (method) {
  case 'GET': // fetch all events
    try {
      const { status, list } = await databaseService.getAllAgendaEvents();
      res.status(status).end(JSON.stringify([...list]));
    } catch (err) {
      res.status(500).end(err.message || 'something is wrong with the DB');
    }
    break;

  case 'POST': // create new event
    res.status(200).end(JSON.stringify({ _id: 'createdRecordID' }));
    break;

  case 'DELETE': // remove existing event
    res.status(200).end(JSON.stringify({ _id: 'deletedRecordID' }));
    break;

  case 'PUT': // update existing event
    res.status(200).end(JSON.stringify({ _id: 'updatedRecordID' }));
    break;

  default:
    res.status(405).end('');
    break;
  }
}
