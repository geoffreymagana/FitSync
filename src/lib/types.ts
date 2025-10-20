

export type Integration = {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  status: 'Connected' | 'Not Connected';
};

export type Member = {
  id: string;
  locationId: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  planType?: 'subscription' | 'pay-per-use';
  remainingCheckIns?: number;
};

export type Trainer = {
  id: string;
  locationId: string;
  name: string;
  avatarUrl: string;
  specialization: string;
  clients: number;
  status: 'On-Duty' | 'Off-Duty';
};

export type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  avatarUrl: string;
  role: 'Admin' | 'Reception' | 'Trainer';
  status: 'Active' | 'Inactive';
  locationId: string;
  salary?: number;
};

export type Class = {
  id: string;
  locationId: string;
  name:string;
  trainer: string;
  time: string;
  date: string;
  duration: number; // in minutes
  spots: number;
  booked: number;
  color?: string;
  isOnline?: boolean;
  meetingUrl?: string;
  price?: number;
  paymentType?: 'free' | 'paid';
  status?: 'Approved' | 'Pending' | 'Rejected';
  createdBy?: string;
  notes?: string;
};

export type Payment = {
  id: string;
  locationId: string;
  memberId: string;
  memberName: string;
  memberAvatarUrl: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed';
};

export type Activity = {
  id: string;
  description: string;
  timestamp: string; // ISO 8601 date string
  member: {
    id: string;
    name: string;
    avatarUrl: string;
  }
};

export type Location = {
  id: string;
  name: string;
  address: string;
  members: number;
  type: 'Main' | 'Branch';
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
  type: 'subscription' | 'pay-per-use';
  checkIns?: number; // Only for pay-per-use
  status: 'Active' | 'Inactive';
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

export type WalkInService = {
  id: string;
  name: string;
  price: number;
  color: string;
  icon: string;
  category: string;
};

export type OrderItem = WalkInService & { quantity: number };

export type Transaction = {
    id: string;
    items: OrderItem[];
    total: number;
    discount?: {
      name: string;
      amount: number;
    };
    paymentMethod: 'M-Pesa' | 'Cash';
    customer: {
        phone: string;
        email?: string;
    };
    timestamp: string;
};

export type InventoryItem = {
    id: string;
    name: string;
    category: string;
    subCategory: string;
    quantity: number;
    price: number;
    showInPOS?: boolean;
};

export type TrainerSpecialization = {
    value: string;
    label: string;
};

export type BlockedDate = {
  date: string;
  reason: string;
};

export type FinancialBreakdown = {
    name: string;
    value: number;
    fill?: string;
};

export type CheckInHistory = {
  date: string;
  checkIns: number;
}

export type Discount = {
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    appliesTo: 'all' | 'service';
    serviceId?: string; // Only if appliesTo is 'service'
    description: string;
    status: 'Active' | 'Inactive';
    startDate?: string;
    endDate?: string;
    locationId: string;
};

export type Subscription = {
    id: string;
    member: Member;
    planName: string;
    status: 'active' | 'churned' | 'delinquent' | 'paused';
    lastOrderAmount: number;
    lastPaymentDate: string;
    autoPayStatus: boolean;
    cardOnFile: boolean;
    trialStartDate: string;
    trialConversionDate: string;
    trialEndDate: string;
    trialConversionStatus: string;
    purchasedDate: string;
    firstScheduleAttended: string;
    lastScheduleAttended: string;
    timeRemaining: string;
};
