

async function run() {
  console.log("Registering user...");
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      role: 'student',
      fullName: 'Test User',
      username: 'testuser_' + Date.now(),
      email: 'test@example.com',
      password: 'password',
      target_track: 'Software Engineering',
      target_industry: 'Tech'
    })
  });
  const regData = await regRes.json();
  console.log("Register response:", regData);

  if (!regData.success) {
    console.log("Registration failed.");
    return;
  }

  const userId = regData.user.id;
  console.log("Updating profile for userId:", userId);

  const updRes = await fetch(`http://localhost:5000/api/auth/profile/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      major: 'Computer Science',
      education_level: 'Bachelor',
      career_goal: 'Engineer',
      occupation_goal: 'Backend',
      strengths: ['coding'],
      develop_areas: ['testing'],
      target_industry: 'Tech'
    })
  });

  const updData = await updRes.json();
  console.log("Update response:", updData);
}

run();
