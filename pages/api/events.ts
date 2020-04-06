// here we handle all DB requests
// all events
// add event
// delete event
// edit event

import { NextApiRequest, NextApiResponse } from 'next';

export const eventsEndpointHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { method } = req;

  switch (method) {
  case 'GET': // fetch all events
    res.status(200).end(JSON.stringify([{ _id: 'deletedRecordID' }]));
    break;

  case 'POST': // create new event
    res.status(200).end('newRecordID');
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
};

export default eventsEndpointHandler;
