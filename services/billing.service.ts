import { tenantDb } from './apiKeyAuth';
import { getOrCreateAggregate } from './rateLimiter';
import { TIER_PRICING, TIER_LIMITS, BillingEvent } from './tenant.types';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface ItemizedInvoice {
  invoiceId: string;
  tenantId: string;
  tenantName: string;
  month: string;
  baseCharge: number;
  overageCharge: number;
  totalDue: number;
  lineItems: InvoiceItem[];
  status: 'PAID' | 'UNPAID' | 'FAILED';
  createdAt: number;
}

// Memory database of billing events and simulated invoices
const billingEvents: BillingEvent[] = [];
const invoicesStore: Map<string, ItemizedInvoice[]> = new Map();

export class BillingService {
  /**
   * Generates a monthly statement calculate base cost + overages
   */
  public generateMonthlyInvoice(tenantId: string, month: string): ItemizedInvoice {
    const tenant = tenantDb.tenants.get(tenantId);
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found.`);
    }

    const tier = tenant.tier;
    const pricing = TIER_PRICING[tier];
    const limits = TIER_LIMITS[tier];
    const usage = getOrCreateAggregate(tenantId, month);

    const baseCharge = pricing.monthlyBase;
    const overageCount = Math.max(0, usage.callCount - limits.monthlyQuota);
    const overageCharge = overageCount * pricing.overageUnitCost;
    const totalDue = baseCharge + overageCharge;

    const lineItems: InvoiceItem[] = [
      {
        description: `Line Breaker™ Enterprise Subcription - ${tier} Tier Base Plan`,
        quantity: 1,
        unitCost: baseCharge,
        total: baseCharge
      }
    ];

    if (overageCount > 0) {
      lineItems.push({
        description: `API Overages (${overageCount.toLocaleString()} requests excess of ${limits.monthlyQuota.toLocaleString()} quota)`,
        quantity: overageCount,
        unitCost: pricing.overageUnitCost,
        total: overageCharge
      });
    }

    const invoiceId = `inv_${month.replace('-', '')}_${tenantId.substring(0, 4)}`;
    const invoice: ItemizedInvoice = {
      invoiceId,
      tenantId,
      tenantName: tenant.name,
      month,
      baseCharge,
      overageCharge,
      totalDue,
      lineItems,
      status: totalDue === 0 ? 'PAID' : 'UNPAID',
      createdAt: Date.now()
    };

    // Store invoice
    const currentInvoices = invoicesStore.get(tenantId) || [];
    if (!currentInvoices.some(inv => inv.invoiceId === invoiceId)) {
      currentInvoices.push(invoice);
      invoicesStore.set(tenantId, currentInvoices);
    }

    return invoice;
  }

  /**
   * Returns invoice statements for a specific tenant
   */
  public getInvoices(tenantId: string): ItemizedInvoice[] {
    const invoices = invoicesStore.get(tenantId) || [];
    
    // Auto-generate current month first if none exist
    if (invoices.length === 0) {
      const currentMonth = new Date().toISOString().substring(0, 7);
      const invoice = this.generateMonthlyInvoice(tenantId, currentMonth);
      return [invoice];
    }

    return invoices;
  }

  /**
   * Process a Stripe webhook simulation
   */
  public processStripeWebhook(payload: { type: string; object: any }) {
    console.log(`[Stripe Webhook] Received webhook event: ${payload.type}`);
    
    const { type, object } = payload;
    const tenantId = object.metadata?.tenantId;
    
    if (!tenantId) {
      return { status: 'IGNORED', message: 'No tenantId in metadata.' };
    }

    const tenant = tenantDb.tenants.get(tenantId);
    if (!tenant) {
      return { status: 'FAILED', message: 'Tenant not found.' };
    }

    const eventId = `evt_${Date.now().toString(16)}`;

    switch (type) {
      case 'invoice.payment_succeeded':
        tenant.status = 'ACTIVE';
        billingEvents.push({
          id: eventId,
          tenantId,
          type: 'PAYMENT_SUCCESS',
          amount: parseFloat(object.amount_paid || '0'),
          description: `Stripe charge successful: ${object.id}`,
          timestamp: Date.now()
        });
        
        // Update associated invoice to PAID
        const userInvoices = invoicesStore.get(tenantId) || [];
        userInvoices.forEach(inv => {
          if (inv.totalDue > 0) inv.status = 'PAID';
        });
        break;

      case 'invoice.payment_failed':
        // Suspend Sandbox, warn or restrict Enterprise bounds
        tenant.status = 'SUSPENDED';
        billingEvents.push({
          id: eventId,
          tenantId,
          type: 'PAYMENT_FAIL',
          amount: parseFloat(object.amount_due || '0'),
          description: `Stripe renewal checkout rejected. Access suspended: ${object.id}`,
          timestamp: Date.now()
        });
        
        const tenantInvoices = invoicesStore.get(tenantId) || [];
        tenantInvoices.forEach(inv => {
          if (inv.totalDue > 0) inv.status = 'FAILED';
        });
        break;

      case 'customer.subscription.updated':
        const previousTier = tenant.tier;
        tenant.tier = object.plan_tier || tenant.tier;
        console.log(`[Stripe Webhook] Tenant ${tenant.name} upgraded from ${previousTier} to ${tenant.tier}.`);
        break;
    }

    return { status: 'SUCCEEDED', eventId };
  }

  /**
   * Lists historical logs of financial adjustments
   */
  public getBillingEvents(tenantId: string): BillingEvent[] {
    return billingEvents.filter(e => e.tenantId === tenantId);
  }
}

export const billingService = new BillingService();
