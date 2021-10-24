import { addData, openDb, readAllData, deleteData } from '../utils/db';

const TABLE_NAME = 'serverless-devs-history';



export async function addHistory(data) {
  const db = await openDb();
  return await addData(db, TABLE_NAME, data);
}


export async function findAllHistory() {
  const db = await openDb();
  return await readAllData(db, TABLE_NAME);
}


export async function removeAllHistory() {
  const allHistory = await findAllHistory();
  const db = await openDb();
  return new Promise((resolve, reject) => {
    allHistory.forEach(async (data, index) => {
      try {
        const id = data.id;
        if (index === allHistory.length - 1) {
          await deleteData(db, TABLE_NAME, id);
          resolve();
        } else {
          deleteData(db, TABLE_NAME, id);
        }
      } catch (e) {
        reject(e);
      }
    });
  })

}