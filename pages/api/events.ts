interface ApiResponse {
  status: number;
  message: string;
  data?: {};
}

export default async function(): Promise<ApiResponse> {
  return {
    status: 200,
    message: 'OK',
  };
}
