import mongoose from 'mongoose';

const projecSchema = new mongoose.Schema({
  Name: {
    required: [
      true,
      "Please provide Name"
    ]
  },
  brah: {},
  asdf: {},
  createdBy: {
    ref: "User",
    required: true
  },
  updatedBy: {
    ref: "User"
  },
  isDeleted: {
    default: false
  },
  deletedAt: {},
  deletedBy: {
    ref: "User"
  },
  createdAt: {},
  updatedAt: {}
});

projecSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

projecSchema.pre(/^find/, function(next) {
  if (this.getQuery().isDeleted === undefined) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

export default mongoose.model('Projec', projecSchema);
