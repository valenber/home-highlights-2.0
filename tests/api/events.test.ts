import { mockRequest } from '../utils';

test('GET method is allowed by API', () => {
  const { res } = mockRequest('GET');
  expect(res._getStatusCode()).not.toBe(405);
});

test('POST method is  allowed by API', () => {
  const { res } = mockRequest('POST');
  expect(res._getStatusCode()).not.toBe(405);
});

test('DELETE method is allowed by API', () => {
  const { res } = mockRequest('DELETE');
  expect(res._getStatusCode()).not.toBe(405);
});

test('PUT method is allowed by API', () => {
  const { res } = mockRequest('PUT');
  expect(res._getStatusCode()).not.toBe(405);
});
