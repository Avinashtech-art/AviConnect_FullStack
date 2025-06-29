import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  chatType: {
    type: String,
    enum: ['private', 'group'],
    default: 'private'
  },
  groupName: {
    type: String,
    trim: true,
    maxlength: [50, 'Group name cannot exceed 50 characters']
  },
  groupAvatar: {
    type: String
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
chatSchema.index({ participants: 1 });
chatSchema.index({ lastActivity: -1 });
chatSchema.index({ chatType: 1 });

// Virtual for unread count (will be calculated per user)
chatSchema.virtual('unreadCount', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat',
  count: true,
  match: { isRead: false }
});

// Ensure private chats have exactly 2 participants
chatSchema.pre('save', function(next) {
  if (this.chatType === 'private' && this.participants.length !== 2) {
    return next(new Error('Private chat must have exactly 2 participants'));
  }
  next();
});

// Update last activity
chatSchema.methods.updateLastActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

export default mongoose.model('Chat', chatSchema);