module.exports = function (app, config, query) {
    // Get All tags without filter
  app.get('/tags', function (req, res) {
    query.getAllTags(req, res)
  })

    // set Tag
  app.post('/tags', function (req, res) {
    query.setTags(req.body.tag_list, req.body.video_id)
    res.status(200).send({status: 'Ok'})
  })

    // Delete one
  app.delete('/tags/:id', function (req, res) {
    var id = req.params.id
    if (!id) res.status(500).send({status: 'Id needed'})
    query.deleteOne(res, id, 'Tag', 'tag')
  })
}
