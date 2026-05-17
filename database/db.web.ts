const db = {
  execSync: () => {},
  runSync: () => ({ lastInsertRowId: 0, changes: 0 }),
  getFirstSync: () => null,
  getAllSync: () => [],
  prepareSync: () => ({
    executeSync: () => ({ lastInsertRowId: 0, changes: 0, rows: [] }),
    finalizeSync: () => {},
  }),
};

export default db;
