// here we define endpoints and use handlers to process API calls into DB requests

import { NextApiResponse, NextApiRequest } from 'next';
import databaseService from '../../services/databaseService';

type FixMeLater = any;

export default async function(
  req: NextApiRequest | { method: any; body: any },
  res: NextApiResponse | FixMeLater,
) {
  try {
    const { method, body } = req;

    switch (method) {
    case 'GET': // fetch all events
      const getRes = await databaseService.getAllAgendaEvents();
      res.status(getRes.status).end(JSON.stringify([...getRes.list]));
      break;

    case 'POST': // create new event
      const postRes = await databaseService.createNewAgendaEvent(body);
      res.status(postRes.status).end(JSON.stringify({ id: postRes.id }));
      break;

    case 'DELETE': // remove existing event
      const delRes = await databaseService.deleteAgendaEvent(body);
      res.status(delRes.status).end(JSON.stringify({ id: delRes.id }));
      break;

    case 'PUT': // update existing event
      const putRes = await databaseService.updateAgendaEvent(
        body.id,
        body.payload,
      );
      res.status(putRes.status).end(JSON.stringify({ id: putRes.id }));
      break;

    default:
      res.status(405).end('');
      break;
    }
  } catch (err) {
    res.status(500).end(err.message || 'Something went wrong with the DB');
  }
}
