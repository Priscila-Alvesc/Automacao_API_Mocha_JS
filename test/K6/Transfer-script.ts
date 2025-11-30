import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  vus: 10,
  iterations: 10, // total de execuções (1 por VU, por exemplo)
  thresholds: {
    http_req_duration: ['p(90)<=2000', 'p(95)<=3000'], // em ms
    http_req_failed: ['rate<0.01']
  }
};

export default function() {
  let responseUserLogin = '';

  group('Fazendo login', function() {
    responseUserLogin = http.post(
      'http://localhost:3000/users/login',
      JSON.stringify({
        username: "julio",
        password: "123456"
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  });

  group('Registrando uma nova transferência', function() {
    const responseTransfer = http.post(
      'http://localhost:3000/transfers',
      JSON.stringify({
        from: "julio",
        to: "priscila",
        value: 50
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${responseUserLogin.json('token')}`
        }
      }
    );

    check(responseTransfer, {
      'status deve ser igual a 201': (r) => r.status === 201
    });
  });

  group('Simulando o pensamento do usuário', function() {
    sleep(1); // User Think Time
  });
}