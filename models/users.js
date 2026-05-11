const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio']
    },
    email: {
      type: String,
      required: [true, 'El mail es obligatorio'],
      unique: true, 
      lowercase: true,
      trim: true,
      match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'El mail no es válido']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      select: false
    },
    terms: {
      type: Boolean,
      required: [true, 'Los terminos son obligatorios'],
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
