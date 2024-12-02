
interface PaymentMethod {
    id: number;
    paymentStatus: boolean;
    orderId: string;
    orderCreatedAt: string;
    currency: string;
    errorOccured: boolean;
    dataMessage: string;
    cardType: string;
    txnResponseCode: string;
    PaymentMerchent: string;
    amountCents: string;
}

interface Payment {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    description: string;
    paymentMethod?: PaymentMethod; // This might not always be present
}


interface Plan {
    id: number;
    documentId: string;
    planTitle: string;
    isPopular: boolean;
    price: number;
    priceType: string;
    planDescription: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;

    
}


interface Subscription {
    id: number;
    subscriptionStatus: string;
    startDate: string;
    endDate: string;
    renewalDate: string;
    cancellationReason: string | null; // Can be null
    subscribedUpdateAt: string;
    subscribedAt: string;
    trialEndDate: string;
    gracePeriodEndDate: string;
    autoRenew: unknown | null; // autoRenew can be various types or null
    payment: Payment;
}

interface LastDeviceUsed {
    id: number;
    manufactorer: string;
    model: string;
    product: string;
    serialNumber: string;
    lastLoginAt: string;
}


interface BillingAddress {
    id: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    email: string;
    firstName: string;
    lastName: string;
    buildingNumber: string;
    apartment: string;
    phoneNumber: string;
    floor: string;
}

interface User {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    plan: Plan;
    payments: Payment[];
    subscription: Subscription;
    lastDeviceUsed: LastDeviceUsed;
    billingAddress: BillingAddress;
}
