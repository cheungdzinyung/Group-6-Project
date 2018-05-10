const passport = require('passport');

module.exports = (express) => {
    const router = express.Router();

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login');
    }

    router.get('/', (req, res) => {
        res.sendFile(__dirname + '/login.html');
    });

    router.get('/profile',  isLoggedIn, (req, res) => {
        res.send(__dirname + '/profile.html');
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/index',
        failureRedirect: '/error'
    }));

    router.get('/error', (req, res) => {
        res.send('You are not logged in!');
    });

    router.get('/index', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    router.get('/signup', (req, res) => {
        res.sendFile(__dirname + '/signup.html');
    });
    
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/index',
        failureRedirect: '/error'
    }));


    router.get('/auth/facebook',
    passport.authenticate('another-strategy'));

    router.get('/auth/facebook/callback',
        passport.authenticate('another-strategy', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/index');
        });

    return router;
};