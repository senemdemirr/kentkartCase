import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MyDB extends DBSchema {
  users: {
    key: number; // Primary key tipi
    value: { id?: number; email: string; token: string , loggedIn: boolean }; // Saklanacak verinin yapısı
  };
  companies: {
    key: number;
    value: { id: number; name: string; location: string };
  };
  employees: {
    key: number;
    value: { id: number; name: string; position: string; companyId: number };
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db!: IDBPDatabase<MyDB>;

  constructor() {
    this.initDB();
  }

  async initDB(): Promise<void> {
    if(!this.db){
      this.db = await openDB<MyDB>('MyDatabase', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('users')) {
            db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('companies')) {
            db.createObjectStore('companies', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('employees')) {
            db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
    console.log('Database initialized');
    }
    await this.populateTables();
   }
   private async ensureDBInitialized(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  async addUser(email: string, token: string): Promise<void> {
    try {
      const tx = this.db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    await store.put({ email, token, loggedIn: true }); 
    await tx.done;
    } catch (error) {
      console.error('Error adding user to IndexedDB:', error);
    }
   
  }

  async populateTables(): Promise<void> {
    const companies = [
      { id: 1, name: 'TechCorp', location: 'San Francisco' },
      { id: 2, name: 'Business Solutions', location: 'New York' },
      { id: 3, name: 'Innovative Startups', location: 'Los Angeles' },
      { id: 4, name: 'Global Tech', location: 'London' },
      { id: 5, name: 'AI Ventures', location: 'Berlin' },
      { id: 6, name: 'Cloud Experts', location: 'Toronto' },
      { id: 7, name: 'Green Energy Co.', location: 'Amsterdam' },
      { id: 8, name: 'FinTech Hub', location: 'Singapore' },
      { id: 9, name: 'Digital Nomads', location: 'Sydney' },
      { id: 10, name: 'Quantum Solutions', location: 'Tokyo' },
    ];
    
    for (const company of companies) {
      await this.addIfNotExists('companies', company);
    }

    const employees = [
      { id: 1, name: 'John Doe', position: 'Software Engineer', companyId: 1 },
      { id: 2, name: 'Jane Smith', position: 'Product Manager', companyId: 2 },
      { id: 3, name: 'Alice Johnson', position: 'UX Designer', companyId: 1 },
      { id: 4, name: 'Bob Brown', position: 'Data Scientist', companyId: 3 },
      { id: 5, name: 'Charlie Davis', position: 'DevOps Engineer', companyId: 1 },
      { id: 6, name: 'Diana Evans', position: 'Marketing Specialist', companyId: 4 },
      { id: 7, name: 'Ethan Garcia', position: 'Frontend Developer', companyId: 2 },
      { id: 8, name: 'Fiona Harris', position: 'Backend Developer', companyId: 3 },
      { id: 9, name: 'George Lee', position: 'HR Manager', companyId: 4 },
      { id: 10, name: 'Hannah Martin', position: 'Sales Executive', companyId: 2 },
    ];

    for (const employee of employees) {
      await this.addIfNotExists('employees', employee);
    }
  }

  private async addIfNotExists<T extends keyof MyDB>(storeName: T, value: MyDB[T]['value']): Promise<void> {
    try {
      const transaction = this.db.transaction(storeName as 'users' | 'companies' | 'employees', 'readwrite');
      const store = transaction.objectStore(storeName as 'users' | 'companies' | 'employees');

      const key = value.id as number;
      const existingRecord = await store.get(key);

      if (!existingRecord) {
        await store.add(value);
        console.log(`Added to ${storeName}:`, value);
      } else {
        console.log(`Already exists in ${storeName}:`, value);
      }
    } catch (error) {
      console.error(`Error in addIfNotExists for ${storeName}:`, error);
    }
  }

  async getAllFromTable<T extends keyof MyDB>(storeName: T): Promise<MyDB[T]['value'][]> {
    try {
      await this.ensureDBInitialized();
      const transaction = this.db.transaction(storeName as 'users' | 'companies' | 'employees', 'readonly');
      const store = transaction.objectStore(storeName as 'users' | 'companies' | 'employees');
      return await store.getAll();
    } catch (error) {
      console.error(`Error fetching all records from ${storeName}:`, error);
      return [];
    }
  }
  async update(storeName: 'companies' | 'employees', key: number, value: any): Promise<void> {
    try {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      await store.put(value);
      console.log(`Updated ${storeName} record:`, value);
    } catch (error) {
      console.error(`Error updating ${storeName}:`, error);
    }
  }
  
  async deleteData(storeName: 'companies' | 'employees', key: number): Promise<void> {
    try {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      await store.delete(key);
      console.log(`Deleted record with key ${key} from ${storeName}`);
    } catch (error) {
      console.error(`Error deleting record from ${storeName}:`, error);
    }
  }  

  async updateUserStatus(email: string, loggedIn: boolean): Promise<void> {
    try {
      await this.ensureDBInitialized();
      const transaction = this.db.transaction('users', 'readwrite');
      const store = transaction.objectStore('users');
      const users = await store.getAll();
      const user = users.find((u) => u.email === email);

      if (user) {
        user.loggedIn = loggedIn;
        await store.put(user);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  }

  
}
