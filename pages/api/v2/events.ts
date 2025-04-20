import { NextApiRequest, NextApiResponse } from 'next';
import { AgendaEvent } from '../../../data/dbSchema';
import { supabaseService as db } from '../../../data/supabaseService';
import { rollbarReporter } from '../../../services/rollbar';
import { validationService } from '../../../data/validationService';

export interface ApiRequest {
  method: string;
  body?: Omit<AgendaEvent, 'id'>;
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
        rollbarReporter.error('DB: failed to getAllAgendaEvents');

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
        rollbarReporter.error('DB: failed to createNewAgendaEvent');

        return {
          status: 500,
          message: `Error on createNewAgendaEvent: ${error.message}.`,
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
