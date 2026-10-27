import mongoose from 'mongoose';
// category 'consultation' = farmer asks an expert (admin answers in comments); 'forum' = community discussion
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['forum', 'consultation'], default: 'forum' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: String, isExpert: Boolean,
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });
export default mongoose.model('Post', postSchema);
