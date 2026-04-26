const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio']
    },
    email: {
      type: String,
      required: [true, 'El mail es obligatorio'],
      match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'El mail no es válido']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false
    },
    terms: {
      type: Boolean,
      required: [true, 'Los terminos son obligatorios'],
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
