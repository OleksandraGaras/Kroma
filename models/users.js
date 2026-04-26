const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio']
    },
    surname: {
      type: String,
      required: [false],
    },
    mail: {
      type: String,
      required: [true, 'El mail es obligatorio'],
      match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'El mail no es válido']
    },
    username: {
      type: String
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
