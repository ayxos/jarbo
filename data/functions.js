import mongoose from 'mongoose'

module.exports = function (app, db) {
  return {
        // Common functions
    getAll: function (res, Table, element) {
      db[Table].find((err, result) => {
        var status = (err) ? 500 : 200
        var response = (err) ? {status: 'DDBB Err:', err} : {[element]: result}
        res.status(status).send(response)
      }).populate('author', '-password').exec();
    },
    getAllbyId: function (res, id, Table, element) {
      db[Table].find({ _id: id }, (err, result) => {
        var status = (err) ? 500 : 200
        var response = (err) ? {status: 'DDBB Err:', err} : {[element]: result}
        res.status(status).send(response)
      })
    },
    getAllbyAuthorId: function (res, id, Table, element) {
      db[Table].find({ author: mongoose.Types.ObjectId(id), removed: false }, (err, result) => {
        var status = (err) ? 500 : 200
        var response = (err) ? {status: 'DDBB Err:', err} : {[element]: result}
        res.status(status).send(response)
      }).populate('author', '-password').exec();
    },
    getOne: function (res, id, Table, element) {
      db[Table].findOne({ _id: id }, (err, result) => {
        var status = (err) ? 500 : 200
        var response = (err) ? {status: 'DDBB Err:', err} : {[element]: result}
        res.status(status).send(response)
      }).populate('author', '-password').exec();
    },
    setOne: function (res, object, Table, element, callback) {
      db[Table](object).save((err, result) => {
        var status = (err) ? 500 : 200
        var response = (err) ? {status: 'DDBB Err:', err} : {[element]: result}
        console.log('[New' + Table + ']', result._id)
        if (!err && callback) callback(result)
        res.status(status).send(response)
      })
    },
    updateOne: function (res, id, object, Table, element) {
      db[Table].findByIdAndUpdate(id, {
        new: true, // return the newly modified document
        $set: object
      }, (err, result) => {
        console.log('err', err, result)
        var status = (err) ? 500 : 200
        var response = (err) ? {status: 'DDBB Err:', err} : {[element]: result}
        res.status(status).send(response)
      })
    },
    deleteOne: function (res, id, Table, element, callback) {
      db[Table].remove({ _id: id }, (err, result) => {
        var status = (err) ? 500 : 200
        var response = (err) ? {status: 'DDBB Err:', err} : {[element]: id}
        res.status(status).send(response)
        if (callback) callback(result)
      })
    },
        // Custom Functions
    setUser: function (user_id, object) {
      console.log('[setUser]', user_id)
      object.author = mongoose.Types.ObjectId(user_id)
      return object
    },
    setUserAfterPret: function (user_id, object_id, forceDelete) {
      console.log('[setUserAfterPret]', user_id, object_id)
      // once the object has been created, add duration and pret id.
      db.User.findOne({ _id: user_id }, (err, result) => {
        var index = result.prets.indexOf(object_id)
        if (!forceDelete && index === -1) result.prets.push(object_id)
        if (forceDelete && index > -1) result.prets.splice(index, 1)
        result.save()
      })
    },
    setTags: function (tagArray, video_id, callback) {
      console.log('[setTags]', tagArray.length, video_id)
      for (let i = 0; i < tagArray.length; i++) {
        db.Tag.findOrCreate({name: tagArray[i].text.toLowerCase()}, {videos: [video_id]}, function (err, tag, created) {
          if (!created) {
            tag.videos.push(video_id)
            tag.counter++
            tag.save(function (err, tag) {
              if (err) console.log('err', err)
            })
          }
        })
      }
      if (callback) callback()
    },
    findPretAndUpdateUser: function (im, pret_id) {
      this.setUserAfterPret(im._id, pret_id, true)
    },
    getUserById: function (id, callback) {
      db.User.findOne({ _id: id }, (err, result) => {
        callback((err) ? null : result)
      })
    },
    getAllTags: function (req, res) {
      db.Tag.find((err, result) => {
        var status = (err) ? 500 : 200
        if (!err) {
          var response = []
          for (var i = 0; i < result.length; i++) {
            var tag = result[i]
            response.push({
              _id: tag._id,
              label: tag.name,
              volume: tag.counter,
              videos: tag.videos,
              color: Math.floor(Math.random() * 3) + 1
            })
          }
        }
        var response = (err) ? {status: 'DDBB Err:', err} : {tags: response}
        res.status(status).send(response)
      })
    },
    getVideosByTag: function (req, res, id) {
      db.Pret.find({
        tags: { $eq: id }
      }, (err, prets) => {
                // Check error
        if (err) {
          res.status(500).send({status: 'DDBB Err:', err})
          return
        }
                // Get videoArr
        var videoArr = []
        prets.map((pret) => {
          for (var i = 0; i < pret.tags.length; i++) {
            if (videoArr.indexOf(pret.video.id) === -1) videoArr.push(pret.video.id)
          }
        })
        res.status(200).send({tag: videoArr})
      })
    },
    getOrCreateUser: function (uid, username, slug, email) {
      return db.User.findOrCreate({'ref.uid': uid}, {'ref.username': username, 'ref.slug': slug, 'ref.email': email})
    }
  }
}
