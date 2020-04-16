// here we define endpoints and use handlers to process API calls into DB requests
import Unbounded from '@unbounded/unbounded';
import { NextApiResponse, NextApiRequest } from 'next';
import databaseService from '../../services/databaseService';

type FixMeLater = any;

export default async function(
  req: NextApiRequest | { method: any; body: any },
  res: NextApiResponse | FixMeLater,
) {
  try {
    const { method, body } = req;

    const client = new Unbounded(
      'aws-us-east-2',
      process.env.UNBOUNDED_DB_USER,
      process.env.UNBOUNDED_DB_PASS,
    );

    let db = client.database('sample');

    switch (method) {
    case 'GET': // fetch all events
      // const getRes = await databaseService.getAllAgendaEvents(database);
      const getRes = await db
        .query()
        .match({})
        .send();
      res.status(200).json({ envents: [...getRes] });
      break;

    case 'POST': // create new event
      // await db.add({
      //   name: 'PhotoEspaña 2020',
      //   starts: '1/7/2020',
      // });
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
