
<div align="center">
  <br />
    <img src="public/icons/icon-192x192.png.png" alt="FitSync Logo" width="100" />
  <h1 align="center">FitSync - Gym Management System</h1>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Shadcn_UI-latest-black?style=for-the-badge&logo=shadcn-ui&logoColor=white" alt="Shadcn UI" />
  <img src="https://img.shields.io/badge/Firebase-11.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</p>

FitSync is a comprehensive, all-in-one management solution designed for modern fitness centers. It provides a suite of tools for administrators, receptionists, instructors, and members to streamline operations, enhance member engagement, and manage all aspects of a gym's day-to-day activities.

The application is built as a multi-dashboard system, providing tailored experiences for different user roles.

---

## Recent Updates (v1.1.0)

-   **feat(analytics):** Added "Revenue Breakdown" and "Expense Breakdown" charts to the admin analytics dashboard for deeper financial insights.
-   **feat(dashboard):** Integrated a "Recent Transactions" table on the main admin dashboard, showing a unified view of both membership payments and walk-in sales.
-   **feat(pos):** Implemented a search bar in the reception Point-of-Sale (POS) system for faster product and service lookup.
-   **feat(check-in):** Added check-in history tracking for members on their profile and check-in pages. A status badge now indicates if a member is currently checked-in.
-   **feat(inventory):** Enabled inline editing and deletion of items directly from the inventory details page.
-   **fix(routing):** Corrected a routing bug where reception staff were incorrectly redirected to an admin page. They now have a dedicated read-only view.
-   **style(ui):** Implemented a custom, thin, branded scrollbar across the admin dashboard for a more polished and cohesive look.

## Key Features

-   **Multi-Role Dashboards**: Separate, feature-rich dashboards for Admins, Members, Receptionists, and Instructors.
-   **Member Management**: Track member details, status, and plans. Approve new sign-ups.
-   **Class Scheduling**: A smart, interactive calendar to schedule, manage, and block off classes, including support for recurring events.
-   **Financial Tracking**: Monitor payments, view transaction histories, and see revenue analytics.
-   **Walk-in & POS System**: A point-of-sale interface for receptionists to handle walk-in services and payments.
-   **Member Self-Service**: Members can book classes, log workouts and meals, view their QR code for check-in, and manage their billing.
-   **Real-time Analytics**: Visual charts for tracking membership growth, income, class occupancy, and peak gym hours.
-   **Inventory & Service Management**: Admins can manage gym inventory and walk-in services offered.

---

## User Roles & Dashboards

### 1. Admin Dashboard

The central hub for managing the entire gym operation.

-   **Dashboard**: At-a-glance overview of total members, active members, trainers on duty, and monthly revenue.
-   **Members**: View, add, edit, and manage all gym members across different locations.
-   **Trainers & Staff**: Manage trainer and staff profiles and roles.
-   **Schedule**: A comprehensive calendar to create, view, update, and delete classes. Includes features for recurring classes and blocking dates.
-   **Payments & Plans**: Track all member payments and manage membership plan structures.
-   **Services & Inventory**: Manage walk-in services for the POS system and track gym inventory.
-   **Accounts**: Approve or reject pending member sign-ups.
-   **Analytics**: In-depth analytics with charts for growth, income, and occupancy.
-   **Locations**: Manage different gym branches.

### 2. Member Dashboard

A mobile-first experience for gym members to engage with the gym.

-   **Home**: A personalized dashboard showing upcoming classes and weekly goals.
-   **Classes**: Browse and book available classes.
-   **Check-in**: Display a personal QR code for easy check-in at the reception.
-   **Profile**: View personal stats, manage billing, and access settings.
-   **Logging**: Log daily workouts and meals to track progress.
-   **Billing**: View payment history, manage payment methods (including M-Pesa), and see plan details.

### 3. Reception Dashboard

Designed for front-desk staff to manage daily check-ins and walk-in customers.

-   **Check-In**: Search for members by name/ID or use a QR code scanner to check them in.
-   **Walk-in (POS)**: A point-of-sale interface to process payments for non-members and walk-in services like day passes or product purchases.
-   **Transactions**: View a history of all walk-in transactions processed at the reception.

### 4. Instructor Dashboard

A dedicated space for trainers to manage their responsibilities.

-   **Dashboard**: A welcome page with an overview of instructor-specific information.
-   **My Schedule**: View a personal calendar showing only the classes assigned to the instructor.
-   **My Clients**: See a list of members assigned to the instructor for personal training.
-   **Settings**: Manage profile and application settings.

---

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State Management**: React Context & `useState`
-   **Linting & Formatting**: ESLint

---

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd fitsync-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

### Running the Development Server

To run the application in development mode, execute the following command:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

---

## Deployment & Setup Strategies

This section provides guidance for deploying FitSync in different environments.

### Strategy 1: On-Premise Setup (Local Network Access)

This setup is ideal for gyms that want to host the staff-facing dashboards (Reception, Instructor) on a local server, accessible only from within the gym's Wi-Fi network.

**Use Case:** A receptionist at the front desk or an instructor on the gym floor accesses their dashboard from a tablet or computer connected to the gym's private network.

#### On-Premise Setup Steps:

1.  **Prepare a Server:**
    -   Designate a reliable computer or a small server (e.g., an Intel NUC or similar) that will run 24/7 on the gym's local network.
    -   Install **Node.js (v18 or later)** on this machine.
    -   Ensure this server has a **static IP address** on the local network (e.g., `192.168.1.100`) so its address doesn't change.

2.  **Build the Application for Production:**
    -   On the server machine, navigate to the project directory.
    -   Run the build command:
        ```bash
        npm run build
        ```
        This creates an optimized production version of the application.

3.  **Run the Production Server:**
    -   Start the application using the following command, specifying the port you want it to run on (e.g., port 3000).
        ```bash
        npm start -- -p 3000
        ```

4.  **Accessing the Dashboards:**
    -   Staff members can now access the application by opening a web browser on any device connected to the gym's Wi-Fi and navigating to the server's local IP address and port.
    -   **Example URLs:**
        -   **Reception:** `http://192.168.1.100:3000/login/reception`
        -   **Instructor:** `http://192.168.1.100:3000/login/instructor`
    -   For easy access, you can create shortcuts or browser bookmarks on staff devices.

5.  **Geofencing Note:**
    -   This setup achieves a basic form of "geofencing" because the application is only accessible to devices connected to the gym's internal network. No one outside the gym's Wi-Fi can reach it.

### Strategy 2: Multi-Domain Deployment for Security

This advanced strategy provides maximum security and separation of concerns by deploying each user-facing application to its own unique subdomain.

**Use Case:** A large fitness chain wants to ensure that member data, admin functions, and staff tools are completely isolated from each other.

**Example Domain Structure:**
-   **Member Dashboard:** `app.fitsync.com`
-   **Admin Dashboard:** `admin.fitsync.com`
-   **Reception & Instructor Dashboards:** `staff.fitsync.com`

This architecture requires a hosting provider that supports custom domains and environment variables (like Vercel, Netlify, or AWS Amplify). The core idea is to use **Next.js Rewrites** and middleware to route traffic based on the hostname.

#### Multi-Domain Setup Steps (Example with Vercel):

1.  **Configure Custom Domains:**
    -   In your hosting provider (e.g., Vercel), add your custom domains/subdomains to the project.
        -   `app.fitsync.com`
        -   `admin.fitsync.com`
        -   `staff.fitsync.com`
        -   `fitsync.com` (for the main landing page)

2.  **Update Next.js Config for Routing:**
    -   Modify your `next.config.ts` to implement rewrite rules based on the hostname. This tells Next.js which part of your application to serve for each domain.

    ```ts
    // next.config.ts

    import type { NextConfig } from 'next';

    const nextConfig: NextConfig = {
      // ... other configs
      async rewrites() {
        return [
          // Main Landing Page
          {
            source: '/:path*',
            destination: '/:path*',
            has: [{ type: 'host', value: 'www.fitsync.com|fitsync.com' }],
          },
          // Member App
          {
            source: '/:path*',
            destination: '/member/:path*',
            has: [{ type: 'host', value: 'app.fitsync.com' }],
          },
          // Admin App
          {
            source: '/:path*',
            destination: '/admin/:path*',
            has: [{ type: 'host', value: 'admin.fitsync.com' }],
          },
           // Staff App (Reception & Instructor)
          {
            source: '/reception/:path*',
            destination: '/reception/:path*',
            has: [{ type: 'host', value: 'staff.fitsync.com' }],
          },
          {
            source: '/instructor/:path*',
            destination: '/instructor/:path*',
            has: [{ type: 'host', value: 'staff.fitsync.com' }],
          },
           // Route the login pages for staff
          {
            source: '/:path*',
            destination: '/login/:path*',
            has: [{ type: 'host', value: 'staff.fitsync.com' }],
          },
        ];
      },
    };

    export default nextConfig;
    ```

3.  **Deployment:**
    -   Deploy your application. The hosting provider, combined with the Next.js config, will now handle the routing automatically.
    -   When a user visits `admin.fitsync.com`, Next.js will serve the content from the `/src/app/admin` directory, effectively isolating it from the other dashboards.

---

## Project Structure

The project follows the standard Next.js App Router structure.

-   **/src/app/**: Contains all the routes and pages for the application.
    -   **/admin/**: Admin dashboard routes.
    -   **/member/**: Member dashboard routes.
    -   **/reception/**: Reception dashboard routes.
    -   **/instructor/**: Instructor dashboard routes.
    -   **/login/**: All authentication-related pages.
-   **/src/components/**: Shared React components.
    -   **/ui/**: Core UI components from Shadcn UI.
    -   **/analytics/**: Chart components for the analytics page.
-   **/src/lib/**: Contains utility functions, data types, and mock data.
-   **/src/context/**: React context providers for shared state.
-   **/public/**: Static assets.
-   **tailwind.config.ts**: Configuration for Tailwind CSS.
-   **next.config.ts**: Configuration for Next.js.
