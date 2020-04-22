import { Document } from 'mongoose';

export interface Comment extends Document {
  _id: string
  text: string
  created: string
  upvotes: [string]
  creator: string
  postRef: string
}