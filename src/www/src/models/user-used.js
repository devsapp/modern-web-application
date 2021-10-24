import { openDb, addData, readData, readAllData } from '../utils/db';

const TABLE_NAME = 'user-used';


export async function addUsedData(data) {
  const db = await openDb();
  return await addData(db, TABLE_NAME, data);
}

export async function findAllCreatedData() {
  const db = await openDb();
  return await readAllData(db, TABLE_NAME);
}


export async function removeCreatedData(data) {
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