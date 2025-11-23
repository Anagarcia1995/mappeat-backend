import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Email inválido"]
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: null
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List"
      }
    ]
  },
  { timestamps: true }
);

// Encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Comparar contraseñas
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
