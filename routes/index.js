const router = require('express').Router(),
  Short = require('../models'),
  Haikunator = require('haikunator'),
  { isWebUri } = require('valid-url')

const slugger = new Haikunator()

router.get('/', async (req, res, next) => {
  const { id } = req.query
  let short
  try {
    short = await Short.findOne({ _id: id }).exec()
  } catch { } finally{ 
    res.render('index', { short })
  }
})

router.get('/whoops', (req, res, next) => res.send('whoops! something went wrong!'))

router.get('/all/shorts', async (req, res, next) => res.send(await Short.find().exec()))

router.post('/new/short', async (req, res, next) => {
  const { url } = req.body
  if (!isWebUri(url) || url.includes('127.0.0.1') || url.includes('localhost'))
    return res.redirect('/whoops')
  const slug = slugger.haikunate({ delimiter: "-", tokenLength: 0 })
  let short
  try {
    short = await (new Short({ slug, url, created: +new Date() })).save()
  } catch { } finally{ 
    res.redirect(`/?id=${short && short._id}`)
  }
})

router.get('/:slug', async (req, res, next) => {
  const { slug } = req.params
  let short
  try{
    short = await Short.findOne({ slug }).exec()
  } catch { } finally {
    if (short) {
      res.render('redirect', { redirect: short.url })
    }else{
      res.redirect('/whoops')
    }
  }
})


module.exports = router