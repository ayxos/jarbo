var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var findOrCreate = require('./plugins')
var Schema = mongoose.Schema

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } } }

mongoose.Promise = global.Promise

var mongoConnectTo = process.env.MONGODDBBLINK
mongoose.connect(mongoConnectTo, options, function (err) {
  if (err) throw err
})

var userSchema = mongoose.Schema({
  log: Array,
  prets: Array,
  email: {
    type: String,
    index: { unique: true }
  },
  rank: { type: Number, default: 0 },
  password: String,
  name: String,
  facebookId: String
})

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
userSchema.methods.comparePassword = function comparePassword (password, callback) {
  bcrypt.compare(password, this.password, callback)
}

/**
 * The pre-save hook method.
 */
userSchema.pre('save', function saveHook (next) {
  const user = this

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next()

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError) }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError) }
      // replace a password string with hash value
      user.password = hash
      return next()
    })
  })
})

var pretSchema = mongoose.Schema({
  author: { type: Schema.ObjectId, ref: 'user' },
  start: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  action: String, 
  removed: { type: Boolean, default: false }
})

// Plugins ======================
userSchema.plugin(findOrCreate)

module.exports = {
  User: mongoose.model('user', userSchema),
  Todo: mongoose.model('todo', pretSchema)
}
