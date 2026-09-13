import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { apiClient } from './api';

const QUEUE_KEY = '@nutriguard_sync_queue';

export interface SyncTask {
  id: string;
  endpoint: string;
  payload: any;
  timestamp: number;
}

export const queueRequest = async (endpoint: string, payload: any) => {
  try {
    const existingStr = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: SyncTask[] = existingStr ? JSON.parse(existingStr) : [];
    
    queue.push({
      id: Math.random().toString(36).substring(7),
      endpoint,
      payload,
      timestamp: Date.now(),
    });
    
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log(`Queued request for ${endpoint}`);
  } catch (error) {
    console.error('Error queuing request:', error);
  }
};

export const processQueue = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  try {
    const existingStr = await AsyncStorage.getItem(QUEUE_KEY);
    if (!existingStr) return;
    
    const queue: SyncTask[] = JSON.parse(existingStr);
    if (queue.length === 0) return;

    console.log(`Processing ${queue.length} items in sync queue...`);
    const newQueue = [];

    for (const task of queue) {
      try {
        await apiClient(task.endpoint, {
          method: 'POST',
          body: JSON.stringify(task.payload),
        });
        console.log(`Successfully synced task ${task.id}`);
      } catch (e) {
        console.error(`Failed to sync task ${task.id}, requeuing...`, e);
        newQueue.push(task); // Keep in queue if failed
      }
    }

    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
  } catch (error) {
    console.error('Error processing sync queue:', error);
  }
};

// Auto-process when connection returns
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    processQueue();
  }
});
