/**
 * Integrations Types
 *
 * TypeScript interfaces for integrations and API management.
 */
/**
 * External integration
 */
export interface Integration {
  /** Unique identifier for the integration */
  id: number;
  /** Name of the integration */
  name: string;
  /** Description of the integration */
  description: string;
  /** Icon identifier */
  icon: string;
  /** Current status of the integration */
  status: 'Active' | 'Inactive' | 'Error' | 'Coming Soon';
  /** Last synchronization timestamp */
  lastSync: string;
  /** Configuration settings */
  config?: Record<string, any>;
}
/**
 * API token
 */
export interface ApiToken {
  /** Unique identifier for the token */
  id: number;
  /** Name of the token */
  name: string;
  /** Token value */
  token: string;
  /** Creation date */
  created: string;
  /** Last usage timestamp */
  lastUsed: string;
  /** Scopes and permissions */
  scopes?: string[];
  /** Whether the token is active */
  isActive?: boolean;
}
/**
 * Billing plan
 */
export interface BillingPlan {
  /** Unique identifier for the plan */
  id: string;
  /** Name of the plan */
  name: string;
  /** Monthly price */
  price: number;
  /** Billing cycle */
  cycle: 'monthly' | 'annual' | 'quarterly';
  /** Features included */
  features: string[];
  /** User limits */
  limits: {
    /** Maximum users */
    users: number;
    /** Maximum storage in GB */
    storage: number;
    /** Maximum API calls per month */
    apiCalls: number;
  };
}
/**
 * Payment method
 */
export interface PaymentMethod {
  /** Unique identifier for the payment method */
  id: string;
  /** Type of payment method */
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  /** Last 4 digits (for credit cards) */
  last4?: string;
  /** Expiration date (for credit cards) */
  expiryDate?: string;
  /** Whether this is the default payment method */
  isDefault: boolean;
}