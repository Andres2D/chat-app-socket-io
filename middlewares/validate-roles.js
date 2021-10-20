const { response } = require("express")

const isAdmin = (req, res = response, next) => {

    if(!req.user) {
        return res.status(500).json({
            ok: false,
            msg: 'Internal server Error'
        });
    }

    const {role, name} = req.user;

    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            msg: `The User ${name} is not allwed to delete users`
        });
    }

    next();
}

const hasRole = (...roles) => {

    return (req, res = response, next) => {
        if(!req.user) {
            return res.status(500).json({
                ok: false,
                msg: 'Internal server Error'
            });
        }

        if(!roles.includes(req.user.role)) {
            return res.status(401).json({
                ok: false,
                msg: `The user ${req.user.name} is not allowed to delete users`
            });
        }

        next();
    }
}

module.exports = {
    isAdmin,
    hasRole
}
