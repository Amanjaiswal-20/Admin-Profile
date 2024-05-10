const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.set("strictQuery", false);

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(DB);
    console.log('Connected To DataBase');
}


const port = process.env.PORT || 3000;

//Starting server on port 3000
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});