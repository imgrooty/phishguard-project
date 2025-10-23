import { startEmailFetchingService } from './emailFetcher';

// This file is used to initialize the background email fetching service
// It will be imported in the app's entry point

let serviceStarted = false;

export function initBackgroundServices() {
  if (serviceStarted) return;
  
  // Start the email fetching service
  startEmailFetchingService();
  
  serviceStarted = true;
  console.log('Background services initialized');
}