

import { Member, Trainer, Class, Payment, Activity, Location, Plan, Staff, Notification, WalkInService, InventoryItem, TrainerSpecialization, BlockedDate, FinancialBreakdown } from './types';

export const locations: Location[] = [
  { id: 'L01', name: 'FitSync Meru', type: 'Main', address: '123 Meru-Nanyuki Rd, Meru', members: 450 },
  { id: 'L02', name: 'FitSync Nairobi', type: 'Branch', address: '456 Waiyaki Way, Nairobi', members: 320 },
  { id: 'L03', name: 'FitSync Mombasa', type: 'Branch', address: '789 Digo Rd, Mombasa', members: 210 },
];

export const trainerSpecializations: TrainerSpecialization[] = [
    { value: 'weightlifting', label: 'Weightlifting' },
    { value: 'crossfit', label: 'CrossFit' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'pilates', label: 'Pilates' },
    { value: 'zumba', label: 'Zumba' },
    { value: 'cardio', label: 'Cardio & Endurance' },
    { value: 'strength', label: 'Strength & Conditioning' },
    { value: 'nutrition', label: 'Nutrition & Diet' },
    { value: 'rehab', label: 'Rehabilitation' },
    { value: 'martial_arts', label: 'Martial Arts' },
    { value: 'dance', label: 'Dance Fitness' },
    { value: 'spin', label: 'Spin & Cycling' },
    { value: 'hiit', label: 'HIIT' },
];

export const members: Member[] = [
  // Meru
  { id: 'M001', locationId: 'L01', name: 'Wanjiku Mwangi', email: 'wanjiku.m@example.com', avatarUrl: 'https://picsum.photos/seed/member1/100/100', plan: 'Premium', status: 'Active', joinDate: '2023-01-15' },
  { id: 'M002', locationId: 'L01', name: 'Omondi Okoth', email: 'omondi.o@example.com', avatarUrl: 'https://picsum.photos/seed/member2/100/100', plan: 'Basic', status: 'Active', joinDate: '2023-02-20' },
  { id: 'M007', locationId: 'L01', name: 'Akinyi Adhiambo', email: 'akinyi.a@example.com', avatarUrl: 'https://picsum.photos/seed/member7/100/100', plan: 'VIP', status: 'Active', joinDate: '2023-03-10' },
  { id: 'M008', locationId: 'L01', name: 'Njeri Kamau', email: 'njeri.k@example.com', avatarUrl: 'https://picsum.photos/seed/member8/100/100', plan: 'Basic', status: 'Pending', joinDate: '2023-06-01' },


  // Nairobi
  { id: 'M003', locationId: 'L02', name: 'Fatuma Ali', email: 'fatuma.a@example.com', avatarUrl: 'https://picsum.photos/seed/member3/100/100', plan: 'VIP', status: 'Inactive', joinDate: '2022-11-10' },
  { id: 'M004', locationId: 'L02', name: 'Kiprono Bett', email: 'kiprono.b@example.com', avatarUrl: 'https://picsum.photos/seed/member4/100/100', plan: 'Premium', status: 'Active', joinDate: '2023-03-05' },
  
  // Mombasa
  { id: 'M005', locationId: 'L03', name: 'Naliaka Wanjala', email: 'naliaka.w@example.com', avatarUrl: 'https://picsum.photos/seed/member5/100/100', plan: 'Basic', status: 'Pending', joinDate: '2023-05-01' },
  { id: 'M006', locationId: 'L03', name: 'Mutua Kilonzo', email: 'mutua.k@example.com', avatarUrl: 'https://picsum.photos/seed/member6/100/100', plan: 'Premium', status: 'Active', joinDate: '2023-04-12' },
];

export const trainers: Trainer[] = [
  // Meru
  { id: 'T01', locationId: 'L01', name: 'Juma Kalama', avatarUrl: 'https://picsum.photos/seed/trainer1/100/100', specialization: 'CrossFit', clients: 25, status: 'On-Duty' },
  { id: 'T04', locationId: 'L01', name: 'Achieng Otieno', avatarUrl: 'https://picsum.photos/seed/trainer4/100/100', specialization: 'Zumba', clients: 30, status: 'Off-Duty' },
  
  // Nairobi
  { id: 'T02', locationId: 'L02', name: 'Wambui Kimani', avatarUrl: 'https://picsum.photos/seed/trainer2/100/100', specialization: 'Yoga', clients: 18, status: 'On-Duty' },

  // Mombasa
  { id: 'T03', locationId: 'L03', name: 'Baraka Mwangi', avatarUrl: 'https://picsum.photos/seed/trainer3/100/100', specialization: 'Weightlifting', clients: 22, status: 'Off-Duty' },
];

export const staff: Staff[] = [
  { id: 'S01', name: 'Admin User', email: 'admin@fitsync.com', avatarUrl: 'https://picsum.photos/seed/staff1/100/100', role: 'Admin', status: 'Active' },
  { id: 'S02', name: 'Juma Kalama', email: 'juma.k@fitsync.com', avatarUrl: 'https://picsum.photos/seed/trainer1/100/100', role: 'Trainer', status: 'Active' },
  { id: 'S03', name: 'Reception User', email: 'reception@fitsync.com', avatarUrl: 'https://picsum.photos/seed/staff2/100/100', role: 'Reception', status: 'Active' },
  { id: 'S04', name: 'Chebet Koech', email: 'chebet.k@fitsync.com', avatarUrl: 'https://picsum.photos/seed/staff3/100/100', role: 'Trainer', status: 'Inactive' },
];

export const upcomingClasses: Omit<Class, 'date' | 'duration' | 'locationId'>[] = [
    { id: 'C101', name: 'Morning Yoga', trainer: 'Wambui Kimani', time: '8:00 AM', spots: 20, booked: 15 },
    { id: 'C102', name: 'HIIT Blast', trainer: 'Juma Kalama', time: '9:00 AM', spots: 25, booked: 25 },
    { id: 'C103', name: 'Powerlifting 101', trainer: 'Baraka Mwangi', time: '10:30 AM', spots: 15, booked: 10 },
    { id: 'C104', name: 'Evening Pilates', trainer: 'Wambui Kimani', time: '6:00 PM', spots: 20, booked: 18 },
];

export const classes: Class[] = [
  // Meru
  { id: 'C102', locationId: 'L01', name: 'HIIT Blast', trainer: 'Juma Kalama', date: '2023-05-25', time: '9:00 AM', duration: 45, spots: 25, booked: 25 },
  { id: 'C201', locationId: 'L01', name: 'Zumba Party', trainer: 'Achieng Otieno', date: '2023-05-26', time: '5:00 PM', duration: 50, spots: 30, booked: 28 },

  // Nairobi
  { id: 'C101', locationId: 'L02', name: 'Morning Yoga', trainer: 'Wambui Kimani', date: '2023-05-25', time: '8:00 AM', duration: 60, spots: 20, booked: 15 },
  { id: 'C104', locationId: 'L02', name: 'Evening Pilates', trainer: 'Wambui Kimani', date: '2023-05-25', time: '6:00 PM', duration: 60, spots: 20, booked: 18 },

  // Mombasa
  { id: 'C103', locationId: 'L03', name: 'Powerlifting 101', trainer: 'Baraka Mwangi', date: '2023-05-25', time: '10:30 AM', duration: 90, spots: 15, booked: 10 },
  { id: 'C202', locationId: 'L03', name: 'Spin Cycle', trainer: 'Abdi Yusuf', date: '2023-05-26', time: '6:00 PM', duration: 45, spots: 20, booked: 12 },
];

export const blockedDates: BlockedDate[] = [
  { date: '2024-07-20', reason: 'Public Holiday' },
  { date: '2024-08-15', reason: 'Staff Training Day' },
];


export const recentActivities: Activity[] = [
    { id: 'A01', description: 'Checked in successfully.', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), member: { id: 'M004', name: 'Kiprono Bett', avatarUrl: 'https://picsum.photos/seed/member4/100/100' } },
    { id: 'A02', description: 'Booked a spot in Morning Yoga.', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), member: { id: 'M001', name: 'Wanjiku Mwangi', avatarUrl: 'https://picsum.photos/seed/member1/100/100' } },
    { id: 'A03', description: 'Membership renewed (Premium).', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), member: { id: 'M002', name: 'Omondi Okoth', avatarUrl: 'https://picsum.photos/seed/member2/100/100' } },
];

export const payments: Payment[] = [
  // Meru
  { id: 'P001', locationId: 'L01', memberId: 'M001', memberName: 'Wanjiku Mwangi', memberAvatarUrl: 'https://picsum.photos/seed/member1/100/100', amount: 5000, date: '2023-05-01', status: 'Paid' },
  { id: 'P006', locationId: 'L01', memberId: 'M002', memberName: 'Omondi Okoth', memberAvatarUrl: 'https://picsum.photos/seed/member2/100/100', amount: 3000, date: '2023-05-10', status: 'Paid' },

  // Nairobi
  { id: 'P002', locationId: 'L02', memberId: 'M004', memberName: 'Kiprono Bett', memberAvatarUrl: 'https://picsum.photos/seed/member4/100/100', amount: 5000, date: '2023-05-02', status: 'Paid' },
  { id: 'P003', locationId: 'L02', memberId: 'M003', memberName: 'Fatuma Ali', memberAvatarUrl: 'https://picsum.photos/seed/member3/100/100', amount: 8000, date: '2023-05-03', status: 'Failed' },

  // Mombasa
  { id: 'P004', locationId: 'L03', memberId: 'M006', memberName: 'Mutua Kilonzo', memberAvatarUrl: 'https://picsum.photos/seed/member6/100/100', amount: 5000, date: '2023-05-04', status: 'Paid' },
  { id: 'P005', locationId: 'L03', memberId: 'M005', memberName: 'Naliaka Wanjala', memberAvatarUrl: 'https://picsum.photos/seed/member5/100/100', amount: 3000, date: '2023-05-05', status: 'Pending' },
];

export const monthlyIncomeData: Record<string, { month: string, income: number }[]> = {
  'L01': [ // Meru
    { month: 'Jan', income: 900000 },
    { month: 'Feb', income: 950000 },
    { month: 'Mar', income: 1100000 },
    { month: 'Apr', income: 1000000 },
    { month: 'May', income: 1200000 },
    { month: 'Jun', income: 1350000 },
  ],
  'L02': [ // Nairobi
    { month: 'Jan', income: 840000 },
    { month: 'Feb', income: 920000 },
    { month: 'Mar', income: 1130000 },
    { month: 'Apr', income: 1050000 },
    { month: 'May', income: 1245000 },
    { month: 'Jun', income: 1300000 },
  ],
  'L03': [ // Mombasa
    { month: 'Jan', income: 540000 },
    { month: 'Feb', income: 620000 },
    { month: 'Mar', income: 730000 },
    { month: 'Apr', income: 650000 },
    { month: 'May', income: 845000 },
    { month: 'Jun', income: 900000 },
  ],
};

export const membershipGrowthData: Record<string, { month: string, new: number, total: number }[]> = {
  'L01': [ // Meru
    { month: 'Jan', new: 30, total: 1150 },
    { month: 'Feb', new: 35, total: 1185 },
    { month: 'Mar', new: 50, total: 1235 },
    { month: 'Apr', new: 45, total: 1280 },
    { month: 'May', new: 60, total: 1340 },
    { month: 'Jun', new: 65, total: 1405 },
  ],
  'L02': [ // Nairobi
    { month: 'Jan', new: 25, total: 1050 },
    { month: 'Feb', new: 30, total: 1080 },
    { month: 'Mar', new: 45, total: 1125 },
    { month: 'Apr', new: 40, total: 1165 },
    { month: 'May', new: 55, total: 1220 },
    { month: 'Jun', new: 60, total: 1280 },
  ],
  'L03': [ // Mombasa
    { month: 'Jan', new: 15, total: 850 },
    { month: 'Feb', new: 20, total: 870 },
    { month: 'Mar', new: 25, total: 895 },
    { month: 'Apr', new: 30, total: 925 },
    { month: 'May', new: 35, total: 960 },
    { month: 'Jun', new: 40, total: 1000 },
  ],
};

export const classOccupancyData: Record<string, { name: string, booked: number, spots: number }[]> = {
  'L01': [
    { name: 'HIIT', booked: 25, spots: 25 },
    { name: 'Zumba', booked: 28, spots: 30 },
    { name: 'CrossFit', booked: 20, spots: 25 },
    { name: 'Strength', booked: 18, spots: 20 },
  ],
  'L02': [
    { name: 'Yoga', booked: 15, spots: 20 },
    { name: 'Pilates', booked: 18, spots: 20 },
    { name: 'Cycling', booked: 22, spots: 25 },
    { name: 'Dance', booked: 28, spots: 30 },
  ],
  'L03': [
    { name: 'Powerlifting', booked: 10, spots: 15 },
    { name: 'Spin', booked: 12, spots: 20 },
    { name: 'Bootcamp', booked: 18, spots: 20 },
    { name: 'Aqua Aerobics', booked: 15, spots: 20 },
  ],
};

export const peakHoursData: Record<string, { hour: string, members: number }[]> = {
  'L01': [
    { hour: '6AM', members: 30 },
    { hour: '8AM', members: 50 },
    { hour: '10AM', members: 40 },
    { hour: '12PM', members: 25 },
    { hour: '2PM', members: 20 },
    { hour: '4PM', members: 45 },
    { hour: '6PM', members: 70 },
    { hour: '8PM', members: 60 },
  ],
  'L02': [
    { hour: '6AM', members: 40 },
    { hour: '8AM', members: 60 },
    { hour: '10AM', members: 50 },
    { hour: '12PM', members: 35 },
    { hour: '2PM', members: 30 },
    { hour: '4PM', members: 55 },
    { hour: '6PM', members: 80 },
    { hour: '8PM', members: 70 },
  ],
  'L03': [
    { hour: '6AM', members: 20 },
    { hour: '8AM', members: 40 },
    { hour: '10AM', members: 30 },
    { hour: '12PM', members: 15 },
    { hour: '2PM', members: 10 },
    { hour: '4PM', members: 35 },
    { hour: '6PM', members: 60 },
    { hour: '8PM', members: 50 },
  ],
};

export const revenueBreakdownData: Record<string, FinancialBreakdown[]> = {
  'L01': [
    { name: 'Membership Fees', value: 850000 },
    { name: 'Personal Training', value: 250000 },
    { name: 'Walk-in Services', value: 150000 },
    { name: 'Product Sales', value: 100000 },
  ],
  'L02': [
    { name: 'Membership Fees', value: 950000 },
    { name: 'Personal Training', value: 350000 },
    { name: 'Walk-in Services', value: 180000 },
    { name: 'Product Sales', value: 120000 },
  ],
  'L03': [
    { name: 'Membership Fees', value: 650000 },
    { name: 'Personal Training', value: 150000 },
    { name: 'Walk-in Services', value: 100000 },
    { name: 'Product Sales', value: 50000 },
  ],
};

export const expenseBreakdownData: Record<string, FinancialBreakdown[]> = {
  'L01': [
    { name: 'Salaries', value: 400000 },
    { name: 'Rent', value: 300000 },
    { name: 'Utilities', value: 100000 },
    { name: 'Equipment', value: 150000 },
    { name: 'Marketing', value: 50000 },
  ],
  'L02': [
    { name: 'Salaries', value: 500000 },
    { name: 'Rent', value: 400000 },
    { name: 'Utilities', value: 120000 },
    { name: 'Equipment', value: 200000 },
    { name: 'Marketing', value: 80000 },
  ],
  'L03': [
    { name: 'Salaries', value: 300000 },
    { name: 'Rent', value: 250000 },
    { name: 'Utilities', value: 80000 },
    { name: 'Equipment', value: 100000 },
    { name: 'Marketing', value: 40000 },
  ],
};


export const plans: Plan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    price: 3000,
    features: ['Access to gym floor', 'Standard locker room access', '1 free guest pass per month'],
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    price: 5000,
    features: [
      'All Basic features',
      'Access to all group classes',
      'Access to sauna and steam room',
      '5 free guest passes per month',
    ],
  },
  {
    id: 'plan-vip',
    name: 'VIP',
    price: 8000,
    features: [
      'All Premium features',
      'Unlimited personal training sessions',
      'Towel service',
      'Dedicated VIP locker room',
      'Unlimited guest passes',
    ],
  },
];

export const notifications: Record<string, Notification[]> = {
    admin: [
        { id: 'N01', title: 'New Member Sign-up', description: 'Njeri Kamau has signed up for the Basic plan at FitSync Meru.', timestamp: '5 minutes ago', read: false },
        { id: 'N02', title: 'Payment Failed', description: 'Fatuma Ali\'s VIP membership payment of KES 8,000 failed.', timestamp: '1 hour ago', read: false },
        { id: 'N03', title: 'Class Almost Full', description: 'Zumba Party at FitSync Meru is almost full (28/30).', timestamp: '3 hours ago', read: true },
        { id: 'N04', title: 'New Member Sign-up', description: 'Naliaka Wanjala has signed up for the Basic plan at FitSync Mombasa.', timestamp: 'Yesterday', read: true },
    ],
    instructor: [
        { id: 'NI01', title: 'New Client Assigned', description: 'Wanjiku Mwangi has been assigned to you.', timestamp: '2 hours ago', read: false },
        { id: 'NI02', title: 'Class Canceled', description: 'Your "HIIT Blast" class at 9:00 AM has been canceled by an admin.', timestamp: '1 day ago', read: true },
    ],
    member: [
        { id: 'NM01', title: 'Booking Confirmed', description: 'Your spot in "Morning Yoga" is confirmed for tomorrow.', timestamp: '10 minutes ago', read: false },
        { id: 'NM02', title: 'Payment Successful', description: 'Your monthly membership fee has been paid.', timestamp: '2 days ago', read: true },
    ],
    reception: [
        { id: 'NR01', title: 'Peak Hours Alert', description: 'The gym is currently experiencing high traffic.', timestamp: 'Just now', read: false },
        { id: 'NR02', title: 'System Update', description: 'The POS system will undergo maintenance tonight at 11 PM.', timestamp: '4 hours ago', read: true },
    ],
};


export const walkInServices: WalkInService[] = [
  { id: 'walkin-day-pass', name: 'Day Pass', price: 500, color: 'rgba(59, 130, 246, 0.8)', icon: 'Ticket', category: 'Passes & Access' },
  { id: 'walkin-pool', name: 'Pool Access', price: 750, color: 'rgba(6, 182, 212, 0.8)', icon: 'Waves', category: 'Passes & Access' },
  { id: 'walkin-pt-session', name: 'PT Session', price: 1500, color: 'rgba(244, 63, 94, 0.8)', icon: 'Dumbbell', category: 'Passes & Access' },
  
  { id: 'walkin-protein', name: 'Protein Powder (Scoop)', price: 250, color: 'rgba(139, 92, 246, 0.8)', icon: 'Package', category: 'Supplements' },
  { id: 'walkin-preworkout', name: 'Pre-workout (Serving)', price: 200, color: 'rgba(236, 72, 153, 0.8)', icon: 'Zap', category: 'Supplements' },
  { id: 'walkin-energy-drink', name: 'Energy Drink', price: 300, color: 'rgba(245, 158, 11, 0.8)', icon: 'CupSoda', category: 'Supplements' },

  { id: 'walkin-tshirt', name: 'FitSync T-shirt', price: 1200, color: 'rgba(16, 185, 129, 0.8)', icon: 'Shirt', category: 'Apparel' },
  { id: 'walkin-towel', name: 'Gym Towel', price: 800, color: 'rgba(107, 114, 128, 0.8)', icon: 'Wind', category: 'Apparel' },
  { id: 'walkin-bottle', name: 'Water Bottle', price: 600, color: 'rgba(14, 165, 233, 0.8)', icon: 'GlassWater', category: 'Apparel' },

  { id: 'walkin-smoothie', name: 'Smoothie', price: 400, color: 'rgba(34, 197, 94, 0.8)', icon: 'Droplet', category: 'Products & Rentals' },
];

export const inventory: InventoryItem[] = [
    { id: 'INV001', name: '5kg Dumbbell Pair', category: 'Equipment', subCategory: 'Weights', quantity: 20, price: 2500, showInPOS: false },
    { id: 'INV002', name: 'Yoga Mat', category: 'Equipment', subCategory: 'Accessories', quantity: 50, price: 1500, showInPOS: true },
    { id: 'INV003', name: 'Treadmill', category: 'Equipment', subCategory: 'Cardio Machines', quantity: 5, price: 150000, showInPOS: false },
    { id: 'INV004', name: 'Protein Powder (1kg)', category: 'Supplements', subCategory: 'Protein', quantity: 30, price: 4000, showInPOS: true },
    { id: 'INV005', name: 'Gym Towel', category: 'Apparel', subCategory: 'Accessories', quantity: 100, price: 500, showInPOS: true },
    { id: 'INV006', name: 'Resistance Bands Set', category: 'Equipment', subCategory: 'Accessories', quantity: 40, price: 2000, showInPOS: false },
];

    
