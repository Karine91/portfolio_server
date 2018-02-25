'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  WorksSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Укажите название проекта']
    },
    technology:{
        type: String,
    },
    picture: {
      type: String
    }
  });

//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('works', WorksSchema);