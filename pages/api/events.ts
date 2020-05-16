import { NextApiRequest, NextApiResponse } from 'next';
import { AgendaEvent } from '../../data/dbSchema';
import { databaseService as db } from '../../data/databaseService';

export interface ApiRequest {
  method: string;
  body?: Partial<AgendaEvent>;
}

export interface ApiResponse {
  status: number;
  message: string;
  data?: {};
}

// this is exported to simplify testing
export async function eventsEndpointHandler(
  request: ApiRequest,
): Promise<ApiResponse> {
  switch (request.method) {
  case 'GET': {
    const { status, message, data } = await db.getAllAgendaEvents();
    return { status, message, data };
  }

  case 'POST': {
    const { status, message, data } = db.createNewAgendaEvent(request.body);
    return { status, message, data };
  }

  case 'DELETE': {
    const { status, message, data } = db.deleteAgendaEvent(request.body.id);
    return { status, message, data };
  }

  case 'PUT': {
    const { status, message, data } = db.updateAgendaEvent(request.body);
    return { status, message, data };
  }

  default:
    return {
      status: 422,
      message: 'Unsupported request method',
    };
  }
}

// NextJS API lambda
export default async function(
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
