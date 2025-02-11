import { Account, Databases, Client } from 'appwrite';

export const client = new Client();

client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID } from 'appwrite';
