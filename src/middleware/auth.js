const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = request.header('Authorization').replace('Bearer ', '') //replace Bearer with nothing, remove it
        const decoded = jwt.verify(token, 'secretstring')
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({
            error: 'Please authenticate'
        })
    }
}


module.exports = auth