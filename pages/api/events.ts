// here we define endpoints and use handlers to process API calls into DB requests

import { NextApiRequest, NextApiResponse } from 'next';
import { createNewEvent } from '../../data/api.hadlers';

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  switch (method) {
  case 'GET': // fetch all events
    res.status(200).end(JSON.stringify([{ _id: 'someRecordID' }]));
    break;

  case 'POST': // create new event
    const dbResponse = await createNewEvent(body);
    const { status, message } = dbResponse;
    res.status(status).end(JSON.stringify(message));
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
