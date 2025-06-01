import React from 'react';

// Converted from JavaScript
/**
 * SQLite Database Service for React Native
 */
import SQLite from 'react-native-sqlite-storage';

// Enable promise wrapper and debugging
SQLite.enablePromise(true);
SQLite.DEBUG(true);

class DatabaseService {
  constructor(databaseName = 'app.db') {
    this.databaseName = databaseName;
    this.database = null;
  }

  /**
   * Initialize database connection
   */
  async initialize() {
    try {
      // Create/open the database
      this.database = await SQLite.openDatabase({
        name: this.databaseName,
        location: 'default'
      });
      
      // Create tables
      await this.createTables();
      
      console.log(`Database ${this.databaseName} initialized successfully`);
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw new Error(`Failed to initialize database: ${error.message}`);
    }
  }

  /**
   * Close database connection
   */
  async close() {
    try {
      if (this.database) {
        await this.database.close();
        this.database = null;
        console.log(`Database ${this.databaseName} closed successfully`);
      }
    } catch (error) {
      console.error('Error closing database:', error);
      throw new Error(`Failed to close database: ${error.message}`);
    }
  }

  /**
   * Create database tables
   */
  async createTables() {
    // Create users table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL,
        firstName TEXT,
        lastName TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create profiles table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        bio TEXT,
        avatarUrl TEXT,
        preferences TEXT,
        lastActive TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create contents table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS contents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        authorId INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        tags TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create comments table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contentId INTEGER NOT NULL,
        authorId INTEGER NOT NULL,
        body TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        parentId INTEGER,
        FOREIGN KEY (contentId) REFERENCES contents(id) ON DELETE CASCADE,
        FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parentId) REFERENCES comments(id) ON DELETE CASCADE
      )
    `);
  }

  /**
   * Execute a SQL statement
   * @param {string} sql - SQL statement to execute
   * @param {Array} params - Parameters for the SQL statement
   * @returns {Promise<number>} - ID of the inserted row for inserts
   */
  async execute(sql, params = []) {
    try {
      if (!this.database) {
        throw new Error('Database not initialized');
      }
      
      await this.database.executeSql(sql, params);
      
      // For INSERT statements, return the last inserted ID
      if (sql.trim().toUpperCase().startsWith('INSERT')) {
        const [{ rows }] = await this.database.executeSql('SELECT last_insert_rowid() as id');
        return rows.item(0).id;
      }
      
      return true;
    } catch (error) {
      console.error('SQL execution error:', error);
      throw new Error(`Failed to execute SQL: ${error.message}`);
    }
  }

  /**
   * Execute a SQL query and return the results
   * @param {string} sql - SQL query to execute
   * @param {Array} params - Parameters for the SQL query
   * @returns {Promise<Array>} - Query results
   */
  async query(sql, params = []) {
    try {
      if (!this.database) {
        throw new Error('Database not initialized');
      }
      
      const [{ rows }] = await this.database.executeSql(sql, params);
      
      // Convert row items to an array of objects
      const results = [];
      for (let i = 0; i < rows.length; i++) {
        results.push(rows.item(i));
      }
      
      return results;
    } catch (error) {
      console.error('SQL query error:', error);
      throw new Error(`Failed to execute query: ${error.message}`);
    }
  }

  /**
   * Execute a transaction
   * @param {Function} callback - Function to execute within the transaction
   * @returns {Promise<any>} - Result of the transaction
   */
  async transaction(callback) {
    try {
      if (!this.database) {
        throw new Error('Database not initialized');
      }
      
      return await this.database.transaction(async (tx) => {
        // Create a wrapper object with query and execute methods
        const txWrapper = {
          query: async (sql, params = []) => {
            return new Promise((resolve, reject) => {
              tx.executeSql(
                sql, 
                params,
                (_, { rows }) => {
                  const results = [];
                  for (let i = 0; i < rows.length; i++) {
                    results.push(rows.item(i));
                  }
                  resolve(results);
                },
                (_, error) => reject(error)
              );
            });
          },
          execute: async (sql, params = []) => {
            return new Promise((resolve, reject) => {
              tx.executeSql(
                sql, 
                params,
                (_, { rowsAffected, insertId }) => {
                  resolve(insertId || rowsAffected);
                },
                (_, error) => reject(error)
              );
            });
          }
        };
        
        return await callback(txWrapper);
      });
    } catch (error) {
      console.error('Transaction error:', error);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }
}

// Repository Example
class UserRepository {
  constructor(db) {
    this.db = db;
  }
  
  async findById(id) {
    const users = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
    return users.length > 0 ? this.mapUser(users[0]) : null;
  }
  
  async findByUsername(username) {
    const users = await this.db.query('SELECT * FROM users WHERE username = ?', [username]);
    return users.length > 0 ? this.mapUser(users[0]) : null;
  }
  
  async findByEmail(email) {
    const users = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    return users.length > 0 ? this.mapUser(users[0]) : null;
  }
  
  async create(user) {
    try {
      const id = await this.db.execute(
        'INSERT INTO users (username, email, passwordHash, firstName, lastName) VALUES (?, ?, ?, ?, ?)',
        [user.username, user.email, user.passwordHash, user.firstName, user.lastName]
      );
      
      return {
        id,
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
  
  async update(id, user) {
    try {
      await this.db.execute(
        'UPDATE users SET username = ?, email = ?, firstName = ?, lastName = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [user.username, user.email, user.firstName, user.lastName, id]
      );
      
      return this.findById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
  
  async delete(id) {
    try {
      await this.db.execute('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
  
  async list(limit = 100, offset = 0) {
    try {
      const users = await this.db.query(
        'SELECT * FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      return users.map(user => this.mapUser(user));
    } catch (error) {
      console.error('Error listing users:', error);
      throw new Error(`Failed to list users: ${error.message}`);
    }
  }
  
  // Helper method to ensure consistent mapping of user objects
  mapUser(userData) {
    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      passwordHash: userData.passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date()
    };
  }
}

export { DatabaseService, UserRepository };

export default function ConvertedComponent() {
  return (
    <div className="p-4">
      <h1>Converted JavaScript Component</h1>
      <p>Original code has been preserved above</p>
    </div>
  );
}