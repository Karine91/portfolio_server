'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  SkillsSchema = new Schema({
    name: {
      type: String,
    },
    percents:{
        type: String,
    }
  }, {autoIndex: false});

//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('skills', SkillsSchema);