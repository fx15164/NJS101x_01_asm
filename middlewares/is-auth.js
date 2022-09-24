
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        req.session.historyUrl = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}

module.exports = isAuth;