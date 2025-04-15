import { storageService } from './storageService';
import { initializeDatabase } from './blogService';

export const initializeServices = async () => {
  try {
    // First initialize the storage service
    await storageService.initialize();
    
    // Then initialize the database with initial posts if needed
    await initializeDatabase();
    
    console.log('Services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
    throw error;
  }
}; 