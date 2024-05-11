import { registerAs } from '@nestjs/config';

const alias = 'mongodb';

export const mongodbConfig = registerAs(alias, () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp',
}));

export const mongodbTestConfig = registerAs(alias, () => ({
  uri: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/chatapp_test',
}));
