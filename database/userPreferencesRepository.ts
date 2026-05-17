import db from "./db";
export interface UserPreferences {
  id?: number;
  username: string;
  shopping_period: string;
  onboarding_completed: number;
}
export function saveUserPreferences(data: UserPreferences) {
  const existing = getUserPreferences();
  if (existing) {
    updateUserPreferences({ ...data, id: existing.id });
  } else {
    db.runSync(
      `
    INSERT INTO user_preferences
    (username, shopping_period, onboarding_completed)
    VALUES (?, ?, ?)
    `,
      [data.username, data.shopping_period, data.onboarding_completed]
    );
  }
}

export function getUserPreferences(): UserPreferences | null {
  const result = db.getFirstSync<UserPreferences>(
    `SELECT * FROM user_preferences LIMIT 1`
  );

  return result ?? null;
}

export function updateUserPreferences(data: UserPreferences) {
  db.runSync(
    `
    UPDATE user_preferences
    SET username = ?, shopping_period = ?
    WHERE id = ?
    `,
    [data.username, data.shopping_period, data.id ?? null]
  );
}

export function updatePeriod(shopping_period: string, id: number) {
  db.runSync(
    `
      UPDATE user_preferences
      SET shopping_period = ?
      WHERE id = ?
    `,
    [shopping_period, id ?? null]
  );
}
