# FitSync - Gym Management System

FitSync is a comprehensive, all-in-one management solution designed for modern fitness centers. It provides a suite of tools for administrators, receptionists, instructors, and members to streamline operations, enhance member engagement, and manage all aspects of a gym's day-to-day activities.

The application is built as a multi-dashboard system, providing tailored experiences for different user roles.

## Key Features

- **Multi-Role Dashboards**: Separate, feature-rich dashboards for Admins, Members, Receptionists, and Instructors.
- **Member Management**: Track member details, status, and plans. Approve new sign-ups.
- **Class Scheduling**: A smart, interactive calendar to schedule, manage, and block off classes, including support for recurring events.
- **Financial Tracking**: Monitor payments, view transaction histories, and see revenue analytics.
- **Walk-in & POS System**: A point-of-sale interface for receptionists to handle walk-in services and payments.
- **Member Self-Service**: Members can book classes, log workouts and meals, view their QR code for check-in, and manage their billing.
- **Real-time Analytics**: Visual charts for tracking membership growth, income, class occupancy, and peak gym hours.
- **Inventory & Service Management**: Admins can manage gym inventory and walk-in services offered.

---

## User Roles & Dashboards

### 1. Admin Dashboard

The central hub for managing the entire gym operation.

- **Dashboard**: At-a-glance overview of total members, active members, trainers on duty, and monthly revenue.
- **Members**: View, add, edit, and manage all gym members across different locations.
- **Trainers & Staff**: Manage trainer and staff profiles and roles.
- **Schedule**: A comprehensive calendar to create, view, update, and delete classes. Includes features for recurring classes and blocking dates.
- **Payments & Plans**: Track all member payments and manage membership plan structures.
- **Services & Inventory**: Manage walk-in services for the POS system and track gym inventory.
- **Accounts**: Approve or reject pending member sign-ups.
- **Analytics**: In-depth analytics with charts for growth, income, and occupancy.
- **Locations**: Manage different gym branches.

### 2. Member Dashboard

A mobile-first experience for gym members to engage with the gym.

- **Home**: A personalized dashboard showing upcoming classes and weekly goals.
- **Classes**: Browse and book available classes.
- **Check-in**: Display a personal QR code for easy check-in at the reception.
- **Profile**: View personal stats, manage billing, and access settings.
- **Logging**: Log daily workouts and meals to track progress.
- **Billing**: View payment history, manage payment methods (including M-Pesa), and see plan details.

### 3. Reception Dashboard

Designed for front-desk staff to manage daily check-ins and walk-in customers.

- **Check-In**: Search for members by name/ID or use a QR code scanner to check them in.
- **Walk-in (POS)**: A point-of-sale interface to process payments for non-members and walk-in services like day passes or product purchases.
- **Transactions**: View a history of all walk-in transactions processed at the reception.

### 4. Instructor Dashboard

A dedicated space for trainers to manage their responsibilities.

- **Dashboard**: A welcome page with an overview of instructor-specific information.
- **My Schedule**: View a personal calendar showing only the classes assigned to the instructor.
- **My Clients**: See a list of members assigned to the instructor for personal training.
- **Settings**: Manage profile and application settings.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context & `useState`
- **Linting & Formatting**: ESLint

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

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

### Project Structure

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
