
// Re-export all APIs for backward compatibility
export { authAPI } from './authApi.js';
export { eventsAPI } from './eventApi.js';
export { productsAPI } from './productApi.js';
export { venuesAPI } from './venueApi.js';
export { paymentsAPI } from './paymentApi.js';
export { organizerAPI } from './organizerApi.js';
export { ordersAPI } from './orderApi.js';
export { reviewsAPI } from './reviewApi.js';


// Also export utils
export { API_BASE_URL, getAuthHeader, handleResponse } from './utils.js';