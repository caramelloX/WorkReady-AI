const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/workready');
  const User = mongoose.connection.collection('users');
  const users = await User.find({}).toArray();
  console.log("USERS:", JSON.stringify(users, null, 2));
  process.exit();
}
check();
