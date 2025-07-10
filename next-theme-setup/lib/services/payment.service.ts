// @/lib/services/payment.service.ts
import { paymentApi } from './api-client';
import { API_CONFIG } from '../config/api';

/**
 * Fetches the available subscription plans.
 * @returns {Promise<any>} The list of plans.
 */
export const getPlans = async (): Promise<any> => {
  try {
    const response = await paymentApi.get(API_CONFIG.ENDPOINTS.PAYMENT.PLANS);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    throw error;
  }
};

/**
 * Creates a checkout session for a given price ID.
 * @param {string} priceId - The ID of the price to subscribe to.
 * @returns {Promise<any>} The checkout session object.
 */
export const createCheckoutSession = async (priceId: string): Promise<any> => {
  try {
    const response = await paymentApi.post(API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIPTION, {
      priceId,
      successUrl: `${window.location.origin}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/dashboard/pricing`,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    throw error;
  }
};

/**
 * Creates a customer portal session.
 * @returns {Promise<any>} The portal session object.
 */
export const createPortalSession = async (): Promise<any> => {
    try {
        const response = await paymentApi.post(API_CONFIG.ENDPOINTS.PAYMENT.BILLING);
        return response.data;
    } catch (error) {
        console.error('Failed to create portal session:', error);
        throw error;
    }
};

/**
 * Fetches the user's current subscription status.
 * @returns {Promise<any>} The subscription object.
 */
export const getSubscription = async (): Promise<any> => {
    try {
        const response = await paymentApi.get(API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIPTION);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch subscription:', error);
        throw error;
    }
}; 