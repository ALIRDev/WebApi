const express = require('express');
//const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yml');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const playersRouter = require('./routes/players');
const vehiclesRouter = require('./routes/vehicles');
const gangsRouter = require('./routes/gangs');
const wantedRouter = require('./routes/wanted');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/players', playersRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/gangs', gangsRouter);
app.use('/wanted', wantedRouter);

// Swagger documentation for Web API
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
