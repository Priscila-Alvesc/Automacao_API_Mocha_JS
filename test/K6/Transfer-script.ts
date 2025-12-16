import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Trend } from 'k6/metrics';
import { getBaseUrl } from './helpers/baseUrlHelper.js';
import { loginUser } from './helpers/loginHelper.js';
import { getRandomUser } from './helpers/randomUserHelper.js';

const transferTrend = new Trend('transfer_duration');

export const options = {
  vus: 10,
  duration: '15s',
  thresholds: {
    http_req_duration: ['p(95)<=2000']
  }
};

export default function() {
  const baseUrl = getBaseUrl();
  const username = getRandomUser();
  const password = '123456'; // Assuming default password

  group('Login', function() {
    const loginResponse = loginUser(username, password, baseUrl);
    const token = loginResponse.json('token');
  });

  group('Transfer', function() {
    const loginResponse = loginUser(username, password, baseUrl); 
    const token = loginResponse.json('token');

    const from = username;
    const to = username === 'julio' ? 'priscila' : 'julio';

    const responseTransfer = http.post(
      `${baseUrl}/transfers`,
      JSON.stringify({
        from,
        to,
        value: 50
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    check(responseTransfer, {
      'Transfer status is 201': (r) => r.status === 201
    });

    transferTrend.add(responseTransfer.timings.duration);
  });

  group('User Think Time', function() {
    sleep(1);
  });
}