import { NextApiRequest, NextApiResponse } from 'next';
import { AgendaEvent } from '../../data/dbSchema';
import { databaseService as db } from '../../data/databaseService';
import { validationService } from '../../data/validationService';

export interface ApiRequest {
  method: string;
  body?: Partial<AgendaEvent>;
}

export interface ApiResponse {
  status: number;
  message: string;
  data?:
    | AgendaEvent[]
    | Partial<AgendaEvent>
    | { providedObject: Record<string, unknown> }
    | string;
}

// this is exported to simplify testing
export async function eventsEndpointHandler(
  request: ApiRequest,
): Promise<ApiResponse> {
  switch (request.method) {
    case 'GET': {
      try {
        const events = await db.getAllAgendaEvents();
        return { status: 200, message: 'OK', data: events };
      } catch (error) {
        return {
          status: 500,
          message: `Error on getAllAgendaEvents: ${error.message}`,
        };
      }
    }

    case 'POST': {
      if (!validationService.newEvent(request.body)) {
        return {
          status: 422,
          message: 'Invalid new event object',
          data: { providedObject: request.body },
        };
      }

      try {
        const dbResponse = await db.createNewAgendaEvent(request.body);
        return { status: 200, message: 'OK', data: dbResponse };
      } catch (error) {
        return {
          status: 500,
          message: `Error on createNewAgendaEvent: ${error.message}.`,
        };
      }
    }

    case 'DELETE': {
      if (!request?.body?.id) {
        return {
          status: 422,
          message: 'Can not delete an event. Missing ID.',
        };
      }

      try {
        const dbResponse = await db.deleteAgendaEvent(request.body.id);
        return { status: 200, message: 'OK', data: dbResponse };
      } catch (error) {
        return {
          status: 500,
          message: `Error on deleteAgendaEvent: ${error.message}.`,
        };
      }
    }

    case 'PUT': {
      if (!request?.body?.id) {
        return { status: 422, message: 'Can not update event. Missing ID.' };
      }

      if (Object.keys(request?.body).length < 2) {
        return {
          status: 422,
          message: 'Can not update event. Missing values to be updated.',
        };
      }

      try {
        const dbResponse = await db.updateAgendaEvent(request.body);
        return { status: 200, message: 'OK', data: dbResponse };
      } catch (error) {
        return {
          status: 500,
          message: `Error on updateAgendaEvent: ${error.message}.`,
        };
      }
    }

    default:
      return {
        status: 422,
        message: 'Unsupported request method',
      };
  }
}

// NextJS API lambda
export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { method, body } = req;
  const { status, message, data }: ApiResponse = await eventsEndpointHandler({
    method,
    body,
  });

  res.status(status).json({ message, data });
}
