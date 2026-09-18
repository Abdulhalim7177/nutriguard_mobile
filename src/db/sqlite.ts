import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

const getDb = async () => {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync('nutriguard.db');
    await _db.execAsync(`
      CREATE TABLE IF NOT EXISTS screenings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        riskBand TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        screeningId INTEGER NOT NULL,
        followedPlan BOOLEAN NOT NULL,
        budgetChanged BOOLEAN NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (screeningId) REFERENCES screenings (id)
      );
      CREATE TABLE IF NOT EXISTS meal_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        planData TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return _db;
};

export const db = {
  reset: async () => {
    const database = await getDb();
    await database.execAsync(`
      DROP TABLE IF EXISTS checkins;
      DROP TABLE IF EXISTS screenings;
    `);
    _db = null;
  },
  
  insertScreening: async ({ userId, riskBand }: { userId: string, riskBand: string }) => {
    const database = await getDb();
    const result = await database.runAsync(
      'INSERT INTO screenings (userId, riskBand) VALUES (?, ?)',
      [userId, riskBand]
    );
    return result.lastInsertRowId;
  },

  getCheckIn: async (screeningId: number) => {
    const database = await getDb();
    const row: any = await database.getFirstAsync(
      'SELECT * FROM checkins WHERE screeningId = ? ORDER BY createdAt DESC LIMIT 1',
      [screeningId]
    );
    if (!row) return null;
    return {
      ...row,
      followedPlan: row.followedPlan === 1,
      budgetChanged: row.budgetChanged === 1
    };
  },
  
  insertCheckIn: async (screeningId: number, followedPlan: boolean, budgetChanged: boolean) => {
    const database = await getDb();
    await database.runAsync(
      'INSERT INTO checkins (screeningId, followedPlan, budgetChanged) VALUES (?, ?, ?)',
      [screeningId, followedPlan ? 1 : 0, budgetChanged ? 1 : 0]
    );
  },
  
  getAllScreenings: async () => {
    const database = await getDb();
    const rows: any[] = await database.getAllAsync(
      'SELECT * FROM screenings ORDER BY createdAt DESC'
    );
    return rows;
  },

  insertMealPlan: async (planData: string) => {
    const database = await getDb();
    const result = await database.runAsync(
      'INSERT INTO meal_plans (planData) VALUES (?)',
      [planData]
    );
    return result.lastInsertRowId;
  },

  getLatestMealPlan: async () => {
    const database = await getDb();
    const row: any = await database.getFirstAsync(
      'SELECT * FROM meal_plans ORDER BY createdAt DESC LIMIT 1'
    );
    if (!row) return null;
    return JSON.parse(row.planData);
  }
};
