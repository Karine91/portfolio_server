'use strict';

const mongoose = require('mongoose');
const ModelSkills = require('./skills'),
  Schema = mongoose.Schema,
  TypeOfSkillsSchema = new Schema({
    type: {
      type: Number,
      unique: true,
      required: true
    },
    name: {
        type: String
    },
    skills: [ModelSkills]

  });

//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('skillsType', TypeOfSkillsSchema);