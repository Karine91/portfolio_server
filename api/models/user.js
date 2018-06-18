const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
      type: String,
      unique: true,
      required: true
    },
    password: {
        type: String,
        required: [true, 'Укажите пароль']      
    }
  });
  
  userSchema.methods.setPassword = function (password) {
    this.password = crypto
      .createHash('md5')
      .update(password)
      .digest('hex')
  };
  
  //просим mongoose сохранить модель для ее дальнейшего использования
  mongoose.model('user', userSchema);
