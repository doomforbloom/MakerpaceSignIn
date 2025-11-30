import { Client, Account, TablesDB } from 'appwrite';

export const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('makerspace-sign-in')
    .setDevKey('f323da808da42f799484710c1716a3e654472dc11ba87f854609ff9cdba398bc1c9c930a9a7be0709b6f05053e8507ac246612db3f28f17a3e1e10a24c7987cc27629eea1c5923f59080cd0057b6c7cab4d46c4bf685d85bf9ae736e9cf2346e398c85b46e528c472e4bf599eac3131f3e7eae42c2d4e8ca17f42d51586399f2');

export const tablesDB = new TablesDB(client)
export { ID } from 'appwrite';
