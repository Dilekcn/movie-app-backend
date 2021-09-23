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
const companyProfileRouter = require('./routes/companyProfile.routes');
const messagesRouter = require('./routes/messages.routes');
const listsRouter = require('./routes/lists.routes');
const mediasRouter = require('./routes/medias.routes');
const notificationRouter = require('./routes/notification.routes');
const trailersRouter = require('./routes/trailers.routes');
const staticPageRouter = require('./routes/staticPage.routes');
const moviesRouter = require('./routes/movies.routes');
const complaintRouter =require('./routes/complaint.routes')
const userRatingsRouter =require('./routes/userratings.routes')
const watchlistRouter =require('./routes/watchlist.routes')
const watchedRouter =require('./routes/watcheds.routes')
const likedRouter =require('./routes/liked.routes')
const listLikesRouter =require('./routes/listLikes.routes')
const commentLikesRouter =require('./routes/commentLikes.routes')

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
app.use('/', companyProfileRouter);
app.use('/', messagesRouter);
app.use('/', listsRouter);
app.use('/', mediasRouter);
app.use('/', trailersRouter);
app.use('/', notificationRouter);
app.use('/', staticPageRouter); 
app.use('/', moviesRouter);
app.use('/',complaintRouter);
app.use('/',userRatingsRouter);
app.use('/',watchlistRouter);
app.use('/',watchedRouter);
app.use('/',likedRouter);
app.use('/',listLikesRouter);
app.use('/',commentLikesRouter);





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
