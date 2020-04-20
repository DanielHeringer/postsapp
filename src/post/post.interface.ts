import { Document } from 'mongoose';

export interface Post extends Document {
  _id: string
  text: string
  created: string
  upvotes: [string]
  downvotes: [string]
  creator: string
}