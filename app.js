var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const upload = require('express-fileupload');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.routes');
const faqsRouter = require('./routes/faqs.routes');
const commentsRouter = require('./routes/comments.routes');
const footerRouter = require('./routes/footers.routes');
const messagesRouter = require('./routes/messages.routes');
const listsRouter = require('./routes/lists.routes');
const mediasRouter = require('./routes/medias.routes');
const notificationRouter = require('./routes/notification.routes');
const trailersRouter = require('./routes/trailers.routes');
const categoriesRouter = require('./routes/categories.routes');
const websitesRouter = require('./routes/websites.routes');
const staticPageRouter = require('./routes/staticPage.routes');

//middlewares
// const verifyToken = require('./auth/verifyToken');
// const isAdmin = require('./auth/isAdmin');

var app = express();
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//DB connection
require('./config/db.config')();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload());
app.use(cors());
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', faqsRouter);
app.use('/', commentsRouter);
app.use('/', footerRouter);
app.use('/', messagesRouter);
app.use('/', listsRouter);
app.use('/', mediasRouter);
app.use('/', trailersRouter);
app.use('/', categoriesRouter);
app.use('/', notificationRouter);
app.use('/', websitesRouter);
app.use('/', staticPageRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
