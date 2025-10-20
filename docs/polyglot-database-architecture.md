# FitSync Polyglot Database Architecture

This document proposes a polyglot persistence strategy for the FitSync platform. As the application grows, relying on a single database technology becomes inefficient. A polyglot approach involves using different database solutions for different use cases, allowing us to choose the best tool for each specific job, thereby optimizing for performance, scalability, and cost.

---

## 1. Guiding Principles

-   **Purpose-Driven Storage**: Select the database technology that best matches the data's structure, access patterns, and consistency requirements.
-   **Scalability & Performance**: Ensure each service can scale independently based on its specific load. For example, logging and analytics workloads should not impact core transactional performance.
-   **Data Integrity**: Use databases with strong transactional guarantees (ACID compliance) for financial and critical user data.
-   **Developer Experience**: Choose databases with robust SDKs and good integration with our existing Google Cloud and Firebase ecosystem.

---

## 2. Proposed Database Services & Use Cases

We will leverage a combination of NoSQL, SQL, and specialized databases to handle the diverse data needs of FitSync.

### 2.1. Firestore (NoSQL Document Store)

Firestore will remain the primary database for core application data that benefits from its flexible schema, real-time capabilities, and ease of use for client-side applications.

-   **Use Cases**:
    -   **Member & User Data**: Storing user profiles, preferences, and authentication details (`/users/{userId}`). Its schema flexibility is ideal for evolving user attributes.
    -   **Schedules & Classes**: Managing class schedules, instructor assignments, and bookings (`/tenants/{tenantId}/classes/{classId}`). Real-time listeners are perfect for updating calendars instantly.
    -   **Tenant Configuration**: Storing tenant-specific settings, branding, and feature flags.
    -   **Messaging**: Storing chat messages between instructors and clients. Firestore's real-time features provide a seamless chat experience.

-   **Why Firestore?**:
    -   Excellent for rapid development and prototyping.
    -   Seamless integration with Firebase Authentication and client-side SDKs.
    -   Real-time data synchronization is built-in.
    -   Automatic scaling for handling large numbers of users and documents.

### 2.2. Cloud SQL for PostgreSQL (Relational/SQL)

For data that is highly relational and requires strong transactional consistency (ACID), a managed SQL database is the superior choice.

-   **Use Cases**:
    -   **Payments & Billing**: Managing all financial transactions, including membership subscription payments, POS sales, and refunds. SQL's ACID guarantees are non-negotiable for financial data.
    -   **Subscriptions Management**: Tracking the lifecycle of a subscription (e.g., active, paused, churned), renewal dates, and plan history.
    -   **Inventory Management**: Handling inventory stock levels where race conditions could occur (e.g., two receptionists selling the last item simultaneously).
    -   **Discounts & Invoices**: Storing structured financial entities that have complex relationships.

-   **Why Cloud SQL?**:
    -   Guarantees data integrity and consistency through ACID transactions.
    -   Powerful querying capabilities for complex joins and aggregations needed for financial reporting.
    -   Fully managed service by Google Cloud, handling backups, replication, and patches.

### 2.3. Cloud Bigtable or a Time-Series Database (e.g., InfluxDB)

This is a specialized database designed for handling massive volumes of time-stamped data, perfect for analytics, logs, and monitoring.

-   **Use Cases**:
    -   **Audit Logs**: Storing an immutable log of all critical actions taken within the system (e.g., admin changes, member check-ins, payment attempts).
    -   **Analytics Events**: Ingesting high-throughput event data, such as user clicks, page views, and feature usage, to be processed by the Analytics Service.
    -   **Performance Monitoring**: Storing metrics from our microservices to monitor system health (API latency, error rates, etc.).

-   **Why a Specialized Database?**:
    -   Optimized for high-volume writes and time-range queries.
    -   Handles massive datasets far more cost-effectively than Firestore or Cloud SQL.
    -   Designed for aggregation and analysis over time, which is essential for business intelligence.

---

## 3. Data Flow & Integration

The microservices architecture will mediate access to these databases.

-   The **Payments Service** would exclusively communicate with **Cloud SQL**.
-   The **Membership and Scheduling Services** would primarily use **Firestore**.
-   All services would push logs and metrics to a data pipeline (e.g., Pub/Sub) that feeds into our **Time-Series Database**.
-   A **Data Warehouse** (like BigQuery) would pull data from all these sources periodically for complex, platform-wide business intelligence and reporting, powering the Super Admin dashboard.

By adopting this polyglot strategy, FitSync can build a more robust, scalable, and maintainable platform prepared for future growth.