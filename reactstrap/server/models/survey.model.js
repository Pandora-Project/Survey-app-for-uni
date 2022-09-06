const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const surveySchema = new Schema({
  result: { type: String, required: true },
  user: { type: String, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;