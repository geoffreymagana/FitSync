
import { MarketingCampaign, MarketingAudience, EmailTemplate } from './types';

export const campaigns: MarketingCampaign[] = [
    {
        id: "CAMP001",
        name: "Welcome Series - New Members",
        status: "Active",
        audience: "New Signups (Last 30 Days)",
        audienceId: "AUD01",
        templateId: "TMPL01",
        sent: 124,
        openRate: "28.5%",
        clicks: 25,
        conversions: 8,
        createdAt: "2024-06-15"
    },
    {
        id: "CAMP002",
        name: "July Promotion - All Members",
        status: "Finished",
        audience: "All Active Members",
        audienceId: "AUD02",
        templateId: "TMPL02",
        sent: 850,
        openRate: "15.2%",
        clicks: 68,
        conversions: 12,
        createdAt: "2024-07-01"
    },
     {
        id: "CAMP003",
        name: "Re-engagement Campaign",
        status: "Draft",
        audience: "Inactive Members (90+ days)",
        audienceId: "AUD03",
        templateId: "TMPL04",
        sent: 0,
        openRate: "0%",
        clicks: 0,
        conversions: 0,
        createdAt: "2024-07-10"
    },
];


export const audiences: MarketingAudience[] = [
    { id: 'AUD01', name: 'New Signups (Last 30 Days)', count: 124, type: 'Email', createdAt: '2024-06-10' },
    { id: 'AUD02', name: 'All Active Members', count: 850, type: 'Email', createdAt: '2024-01-01' },
    { id: 'AUD03', name: 'Inactive Members (90+ days)', count: 215, type: 'Email', createdAt: '2024-05-20' },
    { id: 'AUD04', name: 'VIP Members', count: 75, type: 'SMS', createdAt: '2024-02-28' },
];

export const templates: EmailTemplate[] = [
    { id: 'TMPL01', name: 'New Member Welcome', category: 'Welcome Series', body: 'Hi {{name}},\n\nWelcome to FitSync! We are thrilled to have you as part of our community. Your fitness journey starts now!\n\nBest,\nThe FitSync Team', thumbnailUrl: 'https://picsum.photos/seed/template1/400/225', createdAt: '2024-01-15' },
    { id: 'TMPL02', name: 'Monthly Promotion', category: 'Promotional', body: 'Hi {{name}},\n\nThis month, get 20% off on all personal training sessions! Book yours today.\n\nCheers,\nThe FitSync Team', thumbnailUrl: 'https://picsum.photos/seed/template2/400/225', createdAt: '2024-02-01' },
    { id: 'TMPL03', name: 'Class Reminder', category: 'Transactional', body: 'Hi {{name}},\n\nThis is a reminder for your upcoming class tomorrow. We look forward to seeing you!', thumbnailUrl: 'https://picsum.photos/seed/template3/400/225', createdAt: '2024-03-10' },
    { id: 'TMPL04', name: 'Re-engagement Offer', category: 'Win-back', body: 'Hi {{name}},\n\nWe miss you! Come back and get your first month for 50% off. Let\'s get you back on track.', thumbnailUrl: 'https://picsum.photos/seed/template4/400/225', createdAt: '2024-04-05' },
];
