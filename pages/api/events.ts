// here we define endpoints and use handlers to process API calls into DB requests

import { NextApiResponse, NextApiRequest } from 'next';
import { getAllEvents, createNewEvent } from '../../data/api.hadlers';

type FixMeLater = any;

export default async function(
  req: NextApiRequest | { method: any; body: any },
  res: NextApiResponse | FixMeLater,
) {
  const { method, body } = req;

  switch (method) {
  case 'GET': // fetch all events
    const dbGetResponse = await getAllEvents();
    const payload = dbGetResponse.documents.length
      ? dbGetResponse.documents
      : dbGetResponse.message;

    res.status(dbGetResponse.status).end(JSON.stringify(payload));
    break;

  case 'POST': // create new event
    const dbPostResponse = await createNewEvent(body);
    res
      .status(dbPostResponse.status)
      .end(JSON.stringify({ _id: dbPostResponse.message }));
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
