import mysql from 'mysql2/promise';

const pool = process.env.DB_HOST
  ? mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ai_prompt_generator',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    })
  : null;

export default pool;
export async function getDbCategories() {
  if (!pool) return null;
  try {
    const [rows] = await pool.query('SELECT id, name, slug, description, template, placeholder FROM categories ORDER BY id ASC');
    return rows as any[];
  } catch (error) {
    console.error('Database connection failed or table does not exist, falling back to local data.');
    return null;
  }
}

export async function logPromptHistory(categoryId: number, userInput: string, generatedPrompt: string) {
  if (!pool) return;
  try {
    await pool.query(
      'INSERT INTO prompt_history (category_id, user_input, generated_prompt) VALUES (?, ?, ?)',
      [categoryId, userInput, generatedPrompt]
    );
  } catch (error) {
    console.error('Failed to log prompt history to DB:', error);
  }
}
