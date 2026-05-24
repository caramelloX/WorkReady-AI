import http from 'http';

const data = JSON.stringify({
  role: "student",
  fullName: "API Test",
  username: "apitestuser" + Date.now(),
  email: "api@test.com",
  password: "Password123!"
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', e => console.error('Error:', e.message));
req.write(data);
req.end();
