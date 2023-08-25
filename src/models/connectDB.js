import mongoose from 'mongoose';

export default class ConnectDB {
  async connect() {
    return await mongoose.connect(process.env.DB_URL);
  }
}
