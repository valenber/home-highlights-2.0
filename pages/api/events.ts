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
  case 'GET':
    res.status(200).end(JSON.stringify({ moto: 'Akuna Matata' }));
    break;

  default:
    res.status(400);
    break;
  }
};

export default eventsEndpointHandler;
