import http from 'k6/http';
import { check } from 'k6';

export function loginUser(username, password, baseUrl) {
  const response = http.post(
    `${baseUrl}/users/login`,
    JSON.stringify({ username, password }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  check(response, {
    'Login status is 200': (r) => r.status === 200
  });

  return response;
}