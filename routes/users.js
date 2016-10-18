const router = require('express').Router()
const db = require('sqlite')

/* Users : liste */
router.get('/', function(req, res, next) {
  let limit = parseInt(req.query.limit) || 20
  let offset = parseInt(req.query.offset) || 0
  if (limit > 100) limit = 100

  Promise.all([
    db.all('SELECT rowid, * FROM users LIMIT ? OFFSET ?', limit, offset),
    db.get('SELECT COUNT(*) as count FROM users')
  ]).then((results) => {
    res.format({
      html: () => {
        res.render('users/index', {
          users: results[0],
          count: results[1].count,
          limit: limit,
          offset: offset
        })
      },
      json: () => {
        res.send({
          data: results[0],
          meta: {
            count: results[1].count
          }
        })
      }
    })
  }).catch(next)
})

router.post('/', (req, res, next) => {
  db.run(
    'INSERT INTO users (pseudo, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
    req.body.pseudo,
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.password
  ).then(() => {
    res.format({
      html: () => { res.redirect('/users') },
      json: () => { res.status(201).send({message: 'success'}) }
    })
  }).catch(next)
})


router.get('/add', function(req, res, next) {
  res.format({
    html: () => {
      res.render('users/edit', {
        user: {},
        action: '/users'
      })
    },
    json: () => {
      let error = new Error('Bad Request')
      error.status = 400
      next(error)
    }
  })
})

router.get('/:userId(\\d+)/edit', function(req, res, next) {
  db.get('SELECT rowid, * FROM users WHERE rowid = ?', req.params.userId).then((user) => {
    if (!user) return next()

    res.format({
      html: () => {
        res.render('users/edit', {
          user: user,
          action: `/users/${user.rowid}?_method=put`
        })
      },
      json: () => {
        let error = new Error('Bad Request')
        error.status = 400
        next(error)
      }
    })
  }).catch(next)
})

router.get('/:userId(\\d+)', (req, res, next) => {
  db.get('SELECT rowid, * FROM users WHERE rowid = ?', req.params.userId).then((user) => {
    if (!user) return next()

    res.format({
      html: () => { res.render('users/show', { user: user }) },
      json: () => { res.send({ data: user }) }
    })
  }).catch(next)
})

router.put('/:userId(\\d+)', (req, res, next) => {
  const possibleKeys = ['firstname', 'lastname', 'email', 'pseudo', 'password']

  let dbArgs = []
  let queryArgs = []
  for (key in req.body) {
    if (-1 !== possibleKeys.indexOf(key)) {
      queryArgs.push(`${key} = ?`)
      dbArgs.push(req.body[key])
    }
  }

  dbArgs.push(req.params.userId)
  dbArgs.unshift('UPDATE users SET ' + queryArgs.join(', ') + ' WHERE rowid = ?')

  console.log('dbArgs > ', dbArgs)
  console.log('queryArgs > ', queryArgs)

  db.run.apply(db, dbArgs).then(() => {
    res.format({
      html: () => { res.redirect(`/users/${req.params.userId}`) },
      json: () => { res.status(200).send({ message: 'success' }) }
    })
  }).catch(next)
})

module.exports = router

























///
