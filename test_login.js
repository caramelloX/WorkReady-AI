async function run() {
  console.log("Logging in...");
  const logRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser_1779449324799', // from previous test
      password: 'password'
    })
  });
  const logData = await logRes.json();
  console.log("Login response:", logData);
}
run();
