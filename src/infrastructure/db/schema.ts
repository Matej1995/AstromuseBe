// Database schema for Kysely

export interface Database {
    users: UsersTable;
    // You can add more tables here as needed
  }
  
  export interface UsersTable {
    id: number;
    email: string;
    password: string;
    name: string | null;
    created_at: Date;
    updated_at: Date;
  }
  
  // Useful types for working with users
  export type User = Omit<UsersTable, 'password'>;
  export type NewUser = Omit<UsersTable, 'id' | 'created_at' | 'updated_at'>;
  export type UserWithPassword = Omit<UsersTable, 'created_at' | 'updated_at'>;