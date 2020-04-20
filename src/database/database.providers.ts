import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qdo0g.gcp.mongodb.net/${process.env.MONGO_DB}`,
       { useUnifiedTopology: true, useNewUrlParser: true }),
  },
];