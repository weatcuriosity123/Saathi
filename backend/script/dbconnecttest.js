const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Path to .env file
const envPath = path.resolve(__dirname, '../.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('\x1b[31mError: .env file not found at ' + envPath + '\x1b[0m');
  console.log('Please create a .env file based on .env.example');
  process.exit(1);
}

// Load .env variables
dotenv.config({ path: envPath });

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('\x1b[31mError: MONGO_URI is not defined in .env\x1b[0m');
  process.exit(1);
}

console.log('\x1b[36mConnecting to MongoDB...\x1b[0m');
console.log('URI: ' + mongoUri.replace(/:([^@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(mongoUri)
  .then(() => {
    console.log('\x1b[32mSuccessfully connected to MongoDB!\x1b[0m');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\x1b[31mFailed to connect to MongoDB:\x1b[0m');
    console.error(err.message);
    process.exit(1);
  });
