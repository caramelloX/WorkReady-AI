const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/workready');
  const users = await mongoose.connection.collection('users').find({}).toArray();
  console.log("USERS:", JSON.stringify(users, null, 2));
  process.exit();
}
check();
