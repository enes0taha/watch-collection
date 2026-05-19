import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';

const SALT_ROUNDS = 10;

export const register = async (username, password) => {
  if (!username || username.trim() === '')
    throw new Error('Kullanıcı adı zorunludur.');
  if (!password || password.length < 6)
    throw new Error('Şifre en az 6 karakter olmalıdır.');

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) throw new Error('Bu kullanıcı adı zaten alınmış.');

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const result = db.prepare(
    'INSERT INTO users (username, password) VALUES (?, ?)'
  ).run(username.trim(), hashedPassword);

  return { id: result.lastInsertRowid, username: username.trim() };
};

export const login = async (username, password) => {
  if (!username || !password)
    throw new Error('Kullanıcı adı ve şifre zorunludur.');

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) throw new Error('Kullanıcı adı veya şifre hatalı.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Kullanıcı adı veya şifre hatalı.');

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, username: user.username };
};