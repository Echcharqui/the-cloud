require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');

// Function that closes the connection with the database when the server is stopped from running
const closeConnectionListener = () => {
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log(`\n\t${colors.white.bold(String.fromCharCode(0x2714))} ${colors.red.bold('Database connection is closed')}\n`);
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1); // Exit with error code if unable to close the connection
    }
  });
};


// Function that establishes a connection with the database when the server starts running
const connectingDatabase = async () => {
  mongoose.set('strictQuery', false); // Only if you need to disable strict mode for query filters
  try {
    const info = await mongoose.connect(`${process.env.DATABASE_URL}`);

    // Log that the connection was successfully established
    console.log(`\t${colors.white.bold(`${String.fromCharCode(0x2714)} ${colors.green.bold('Connection to')}`)} ${colors.white.bold(`${info.connection.name.toUpperCase()} ${colors.green.bold('database was successfully established')}`)}\n`);

    // Log main information about the database the server is connecting to
    console.log(`\t////////////////// ${colors.green.bold('Database informations')} /////////////////`);
    console.log(`\t// ${colors.green.bold('Database Name :')} ${colors.white.bold(info.connection.name)}                                 //`);
    console.log(`\t// ${colors.green.bold('Database Host :')} ${colors.white.bold(info.connection.host)} //`);
    console.log(`\t// ${colors.green.bold('Database Port :')} ${colors.white.bold(info.connection.port)}                                //`);
    console.log('\t//////////////////////////////////////////////////////////');

    // Call the listener to close the connection directly after the server stops running
    closeConnectionListener();
  } catch (error) {
    // Log that the server was not able to connect to the database and display the error log too
    console.log(`\t${colors.yellow.bold(String.fromCharCode(0x26A0))} ${colors.red.bold('Database connection failed')} ${colors.red.bold("and that's why :")}\n`);
    console.error(error);
  }
};

module.exports.connectingDatabase = connectingDatabase;
