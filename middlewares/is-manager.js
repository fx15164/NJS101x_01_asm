
const isManager = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        req.session.historyUrl = req.originalUrl;
        return res.redirect('/login');
    }
    if (!req.staff.isManager) {
        return res.redirect('/');
    }    
    next();
}

module.exports = isManager;