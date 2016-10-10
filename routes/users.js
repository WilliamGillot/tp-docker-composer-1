const router = require('express').Router()

/* Users : liste */
router.get('/', function(req, res, next) {
  data = {
    users: [
      { firstname: 'Jean', lastname: 'Bon' },
      { firstname: 'Emilie', lastname: 'Dubois' }
    ]
  }

  res.format({
    html: () => { res.render('users/index', data) },
    json: () => { res.send(data) }
  })
})

router.get('/:userId', function(req, res, next) {
  let err = new Error('Not implemented')
  err.status = 501
  next(err)
})

module.exports = router
