import axios from 'axios';
import { API_BASE_URL } from './config';
import { mockDb } from './mockDb';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { API_BASE_URL, getApiBaseUrl, isDevelopmentApi } from './config';

// Utility to handle offline fallback
const withOfflineMock = async (apiCall: Promise<any>, mockAction: () => any) => {
  try {
    return await apiCall;
  } catch (error: any) {
    const isOfflineError = 
      error.code === 'ERR_NETWORK' || 
      error.message === 'Network Error' || 
      error.response?.status === 504 || 
      error.response?.status === 502 || 
      error.response?.status === 500 || error.response?.status === 404;
      
    if (isOfflineError) {
      console.warn('[Offline Mode] Falling back to local mock DB');
      const data = await mockAction();
      return { data };
    }
    throw error;
  }
};

const formDataToObject = async (fd: FormData): Promise<any> => {
  const obj: any = {};
  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
      // Convert file to base64 for offline storage
      const buffer = await value.arrayBuffer();
      const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      obj[key] = `data:${value.type};base64,${base64}`;
    } else {
      obj[key] = value;
    }
  }
  return obj;
};

// Services
export const getServices = (category?: string) =>
  withOfflineMock(
    api.get('/services', { params: category ? { category } : {} }),
    async () => ((await mockDb.get('services')) as any[]).filter((s: any) => category ? s.category === category : true)
  );

export const createService = async (data: FormData) => {
  const obj = await formDataToObject(data);
  return withOfflineMock(
    api.post('/services', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    async () => await mockDb.add('services', obj)
  );
};

export const updateService = async (id: string, data: FormData) => {
  const obj = await formDataToObject(data);
  return withOfflineMock(
    api.put(`/services/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    async () => await mockDb.update('services', id, obj)
  );
};

export const deleteService = (id: string) =>
  withOfflineMock(
    api.delete(`/services/${id}`),
    async () => await mockDb.remove('services', id)
  );

// Staff
export const getStaff = () =>
  withOfflineMock(api.get('/staff'), () => []);

// Bookings
export const getAvailableSlots = (date: string, staffId?: string) =>
  withOfflineMock(api.get('/bookings/slots', { params: { date, staffId } }), () => [
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '02:00 PM', available: true },
    { time: '04:00 PM', available: true }
  ]);

export const createBooking = (data: object) =>
  withOfflineMock(api.post('/bookings', data), async () => await mockDb.add('bookings', { ...data, status: 'pending' }));

export const getBookings = () =>
  withOfflineMock(api.get('/bookings'), async () => await mockDb.get('bookings'));

export const updateBookingStatus = (id: string, status: string) =>
  withOfflineMock(api.patch(`/bookings/${id}/status`, { status }), async () => await mockDb.update('bookings', id, { status }));

// Payments
export const createPaymentOrder = (data: object) =>
  withOfflineMock(api.post('/payments/create-order', data), () => ({ orderId: 'mock_order_123', amount: 5000 }));
export const verifyPayment = (data: object) =>
  withOfflineMock(api.post('/payments/verify', data), () => ({ success: true }));

// Offers
export const getOffers = () =>
  withOfflineMock(api.get('/offers'), async () => await mockDb.get('offers'));
export const createOffer = (data: object) =>
  withOfflineMock(api.post('/offers', data), async () => await mockDb.add('offers', data));
export const updateOffer = (id: string, data: object) =>
  withOfflineMock(api.put(`/offers/${id}`, data), async () => await mockDb.update('offers', id, data));
export const deleteOffer = (id: string) =>
  withOfflineMock(api.delete(`/offers/${id}`), async () => await mockDb.remove('offers', id));

// Courses
export const getCourses = () =>
  withOfflineMock(api.get('/courses'), async () => await mockDb.get('courses'));
export const createCourse = (data: any) =>
  withOfflineMock(api.post('/courses', data), async () => await mockDb.add('courses', data));
export const deleteCourse = (id: string) =>
  withOfflineMock(api.delete(`/courses/${id}`), async () => await mockDb.remove('courses', id));

// Testimonials
export const getTestimonials = () =>
  withOfflineMock(api.get('/testimonials'), async () => ((await mockDb.get('testimonials')) as any[]).filter((t: any) => t.isApproved));
export const getAllTestimonials = () =>
  withOfflineMock(api.get('/testimonials/all'), async () => await mockDb.get('testimonials'));
export const createTestimonial = (data: object) =>
  withOfflineMock(api.post('/testimonials', data), async () => await mockDb.add('testimonials', { ...data, isApproved: false }));
export const approveTestimonial = (id: string) =>
  withOfflineMock(api.patch(`/testimonials/${id}/approve`), async () => await mockDb.update('testimonials', id, { isApproved: true }));
export const deleteTestimonial = (id: string) =>
  withOfflineMock(api.delete(`/testimonials/${id}`), async () => await mockDb.remove('testimonials', id));

// Gallery
export const getGallery = (category?: string) =>
  withOfflineMock(api.get('/gallery', { params: category ? { category } : {} }), async () => ((await mockDb.get('gallery')) as any[]).filter((g: any) => category ? g.category === category : true));
export const createGalleryItem = async (data: FormData) => {
  const obj = await formDataToObject(data);
  return withOfflineMock(
    api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    async () => await mockDb.add('gallery', obj)
  );
};
export const deleteGalleryItem = (id: string) =>
  withOfflineMock(api.delete(`/gallery/${id}`), async () => await mockDb.remove('gallery', id));

// Before After (New)
export const getBeforeAfter = () =>
  withOfflineMock(api.get('/before-after'), async () => await mockDb.get('beforeAfter'));
export const createBeforeAfter = async (data: FormData) => {
  const obj = await formDataToObject(data);
  return withOfflineMock(
    api.post('/before-after', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    async () => await mockDb.add('beforeAfter', obj)
  );
};
export const deleteBeforeAfter = (id: string) =>
  withOfflineMock(api.delete(`/before-after/${id}`), async () => await mockDb.remove('beforeAfter', id));

// Reviews
export const submitReview = async (data: FormData) => {
  const obj = await formDataToObject(data);
  // Send to Python ML Backend as JSON for real-time sentiment analysis
  return withOfflineMock(
    api.post('/reviews', { name: obj.name || 'Anonymous', text: obj.review || obj.text || '', rating: Number(obj.rating) || 5 }),
    async () => await mockDb.add('testimonials', { ...obj, isApproved: false })
  );
};

// Settings
export const getSettings = () =>
  withOfflineMock(api.get('/settings'), () => ({}));
export const updateSettings = (data: object) =>
  withOfflineMock(api.put('/settings', data), () => ({}));

// Auth
export const adminLogin = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const getDashboardStats = () =>
  withOfflineMock(api.get('/admin/stats'), async () => {
    const bookings = (await mockDb.get('bookings')) as any[];
    const revenue = bookings.reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0);
    const clients = new Set(bookings.map((b: any) => b.customerEmail)).size;
    return { bookings: bookings.length, revenue, clients, rating: 4.9 };
  });
