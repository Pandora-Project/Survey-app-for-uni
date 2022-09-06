const router = require('express').Router();
let Survey = require('../models/survey.model');

router.route('/').get((req, res) => {
    Survey.find()
    .then(surveys => res.json(surveys))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const result = req.body.result;
  const user = req.body.user;
  const date = Date.parse(req.body.date);

  const newSurvey = new Survey({
    result,
    user,
    date,
  });

  newSurvey.save()
  .then(() => res.json('Survey result added!'))
  .catch(err => res.status(400). json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Survey.findById(req.params.id)
    .then(survey => res.json(survey))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Survey.findByIdAndDelete(req.params.id)
    .then(() => res.json('Survey deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Survey.findById(req.params.id)
    .then(survey => {
        survey.result = req.body.result;
        survey.user = req.body.user;
        survey.date = Date.parse(req.body.date);

        survey.save()
        .then(() => res.json('Survey updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;