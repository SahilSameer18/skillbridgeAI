const mongoose = require('mongoose')


const blacklistTokenSchema = new mongoose.Schema({
  token:{
    type: String,
    required:[true, "token is required to be added in blacklist"],
  },
  createdAt: { type: Date, default: Date.now, index: {expires: '1d'}}   // expires after 1 day
}, {
  timestamps: true
})

const tokenBlacklistModel = mongoose.model('blacklistTokens', blacklistTokenSchema)

module.exports = tokenBlacklistModel;