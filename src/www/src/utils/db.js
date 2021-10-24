export function initDbTable(db) {
  createTable(db, 'user-used');
  createTable(db, 'user-published');
  createTable(db, 'serverless-devs-history');
}

export function openDb(version = 1, dbName = 'serverless_devs') {
  const request = window.indexedDB.open(dbName, version);
  return new Promise((resolve, reject) => {
    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      initDbTable(db);
    }
  });
};

export function createTable(db, tableName) {
  let objectStore;
  try {
    if (!db.objectStoreNames.contains(tableName)) {
      objectStore = db.createObjectStore(tableName, { keyPath: 'id' });
      objectStore.createIndex('id', 'id', { unique: true });
    }
  } catch (e) {

  }
  return objectStore;
};


export function addData(db, tableName, data) {
  const request = db.transaction([tableName], 'readwrite')
    .objectStore(tableName)
    .add(data);
  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      resolve(event)
    };
    request.onerror = function (event) {
      reject(event);
    }
  });
}


export function readData(db, tableName, key) {
  const transaction = db.transaction([tableName]);
  const objectStore = transaction.objectStore(tableName);
  const request = objectStore.get(key);
  return new Promise((resolve, reject) => {
    request.onerror = function (event) {
      reject(event);
    };
    request.onsuccess = function (event) {
      resolve(request.result)
    };
  });
};

export function readAllData(db, tableName) {
  const objectStore = db.transaction(tableName).objectStore(tableName);
  return new Promise((resolve, reject) => {
    const resultData = []
    objectStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        resultData.push(cursor.value)
        cursor.continue();
      } else { // the end
        resolve(resultData)
      }
    };
  })
}

export function updateData(db, tableName, data) {
  const request = db.transaction([tableName], 'readwrite')
    .objectStore(tableName)
    .put(data);
  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      resolve(event)
    };
    request.onerror = function (event) {
      reject(event);
    };
  });
}

export function deleteData(db, tableName, key) {
  var request = db.transaction([tableName], 'readwrite')
    .objectStore(tableName)
    .delete(key);
  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      resolve();
    };
  })

}
