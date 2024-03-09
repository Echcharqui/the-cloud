require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const colors = require('colors')
const cors = require('cors')
const path = require('path')
const packageJson = require('./package.json')

// requiring routes
const authRoute = require('./src/routes/auth/auth')

// requiring configuration
const { connectingDatabase } = require('./src/config')


// init the expresse app
const app = express()

// connection the database
connectingDatabase()

// Trusting proxy forward headers if the app is running behind a proxy
app.set('trust proxy', 1);

// Middleware functions
app.use(express.json({ limit: '10mb' })) // Parse JSON requests
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded form data
app.use(morgan('dev')) // Log HTTP requests
app.use(cors({ origin: '*' })) // Enable CORS
app.use('/api/static', express.static(path.join(__dirname, '/public'))) // Serve static files from the "public" folder

app.get('/api/', (req, res) => {
    return res.status(200).json('hellow master')
})

app.use('/api/auth', authRoute)

// handle 404 errors
app.use((req, res) => {
    return res.status(404).send({
        status: 404,
        eroors: [
            {
                message: 'Not Found',
                description: 'The requested resource could not be found but may be available in the future.'
            }
        ]
    })
})

// handle all other errors
app.use((err, req, res, next) => {
    console.error(err)
    return res.status(500).send({
        status: 500,
        eroors: [
            {
                message: 'Internal Server Error',
                description: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.'
            }
        ]
    })
})

app.listen(process.env.PORT, () => {
    // write the ASCII art of the api name
    console.log(
        colors.white.bold(`
        ░▒▓█▓▒░░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░  
        ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
        ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
        ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
        ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
        ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
        ░▒▓█▓▒░░▒▓██████▓▒░░▒▓████████▓▒░▒▓██████▓▒░ ░▒▓██████▓▒░░▒▓███████▓▒░             
                                   
                                    API : V${packageJson.version}
                            AUTHOR : ${packageJson.author}
                                    LICENSE : ${packageJson.license.toUpperCase()}
   `))
    console.log(`\n\t${colors.bold(`${colors.white.bold(String.fromCharCode(0x2714))} ${colors.green.bold('The server is started and running successfully on port  :')}`)} ${colors.white.bold(process.env.PORT)}`)
})
