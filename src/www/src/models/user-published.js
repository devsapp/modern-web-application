import { openDb, createTable, addData, readAllData } from '../utils/db';

const TABLE_NAME = 'user-published';



export async function addPublishData(data) {
  const db = await openDb();
  return await addData(db, TABLE_NAME, data);
}

export async function findAllPublishedData() {
  const db = await openDb();
  return await readAllData(db, TABLE_NAME);
}


export async function removePublishedData(data) {
  const db = await openDb();
  db.transaction([TABLE_NAME], 'readwrite')
    .objectStore(TABLE_NAME)
    .delete(data.id);
  const { removeUserUsedData } = window;
  if (removeUserUsedData) {
    const result = await removeUserUsedData({data});
    console.log(result, 'result');
  }
}