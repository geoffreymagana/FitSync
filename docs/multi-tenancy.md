# FitSync Multi-Tenant & White-Label Architecture Proposal

This document outlines a strategic plan to evolve the FitSync application from a single-instance system into a scalable, multi-tenant SaaS platform. This architecture will support white-labeling for premium customers and allow for dynamic feature management using Firebase Remote Config.

---

## 1. Core Architectural Principles

-   **Scalability**: The system must handle multiple, independent fitness organizations (tenants) within a single, unified infrastructure.
-   **Data Isolation**: Each tenant's data (members, schedules, finances, etc.) must be strictly segregated and inaccessible to other tenants.
-   **Customization (White-Labeling)**: Premium tenants must be able to apply their own branding, including logos, color schemes, and potentially custom domains.
-   **Dynamic Feature Management**: Features should be enabled or disabled on a per-tenant or per-user-role basis using a feature flagging system like Firebase Remote Config.

---

## 2. Proposed Technical Architecture

### 2.1. Tenant Identification

The application will identify the current tenant based on the hostname of the request.

-   **Standard Subdomains**: `[tenant-slug].fitsync.com`
-   **Custom Domains**: Premium tenants can map their own domain (e.g., `app.mycoolgym.com`) to their FitSync instance.

A central `tenants` collection in Firestore will map a `slug` or `customDomain` to a unique `tenantId`.

**Middleware (`middleware.ts`) Logic:**
1.  Extract hostname from the incoming request.
2.  Look up the `tenantId` from the `tenants` collection in Firestore based on the hostname.
3.  If no tenant is found, redirect to a generic sign-up or error page.
4.  If a tenant is found, pass the `tenantId` to the application, for instance, by rewriting the URL to include it (`/` becomes `/[tenantId]/`).

### 2.2. Data Modeling for Multi-Tenancy (Firestore)

To ensure data isolation, all tenant-specific data will be nested under a document corresponding to their `tenantId`.

**New Firestore Structure:**

```
/tenants/{tenantId}/
  ├─ members/{memberId}
  ├─ classes/{classId}
  ├─ trainers/{trainerId}
  ├─ payments/{paymentId}
  ├─ locations/{locationId}
  ├─ config/{configDoc}  (e.g., branding, settings)
  └─ ... (other tenant-specific collections)
```

**Security Rules (`firestore.rules`):**
Security rules will be the primary mechanism for enforcing data isolation. All paths will be updated to require that the request is for data within the user's own `tenantId`.

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to get the tenantId from the user's custom claims
    function getTenantId() {
      return request.auth.token.tenantId;
    }

    // Secure all tenant-specific data
    match /tenants/{tenantId}/{document=**} {
      // Ensure the user belongs to the tenant they are trying to access
      allow read, write: if getTenantId() == tenantId;
    }
  }
}
```
*Note: This requires adding a `tenantId` custom claim to each user's authentication token upon login or sign-up.*

### 2.3. Feature Flagging with Firebase Remote Config

Firebase Remote Config will be used to manage feature availability and UI customization for each tenant.

**Remote Config Parameters (JSON structure):**

```json
{
  "default_config": {
    "branding": {
      "primaryColor": "#E50914",
      "logoUrl": "/default-logo.png"
    },
    "features": {
      "enable_pos_module": true,
      "enable_analytics_dashboard": false,
      "enable_custom_meal_plans": false
    },
    "user_roles": ["admin", "reception", "member"]
  },
  "tenant_premium_gym_123": { // Overrides for a specific tenantId
    "branding": {
      "primaryColor": "#34D399",
      "logoUrl": "https://cdn.mycoolgym.com/logo.png"
    },
    "features": {
      "enable_analytics_dashboard": true,
      "enable_custom_meal_plans": true
    },
    "user_roles": ["admin", "reception", "member", "instructor"]
  }
}
```

**Implementation:**
-   On application load (specifically in a root layout or provider), fetch the Remote Config values.
-   The application will first load the `default_config`.
-   If the user belongs to a specific tenant (e.g., `tenant_premium_gym_123`), the application will merge the tenant-specific config over the default.
-   The UI will dynamically render components, navigation links, and branding based on these config values. For example, the "Analytics" nav item would only appear if `features.enable_analytics_dashboard` is `true`.

---

## 3. Phased Implementation Roadmap

### Phase 1: Foundational Changes (Proof of Concept)
1.  **Update Data Model:** Introduce the `/tenants/{tenantId}` structure in Firestore. Create a script to migrate existing data into a default tenant document.
2.  **User Authentication Update:** Modify the sign-up and login logic to assign a `tenantId` custom claim to users.
3.  **Middleware for Tenant Resolution:** Implement the basic middleware to identify `tenantId` from the URL or subdomain.
4.  **Refactor Core Data Queries:** Update all Firestore queries in the application to be tenant-aware (i.e., prefix all paths with `/tenants/{tenantId}`).

### Phase 2: White-Labeling Implementation
1.  **Integrate Firebase Remote Config:** Add the SDK and set up the parameter structure.
2.  **Dynamic Branding:** Refactor the UI to consume branding info (colors, logos) from the fetched config instead of hardcoded CSS values. The CSS `globals.css` will use CSS variables that are updated dynamically.
3.  **Custom Domain Support:** Configure the hosting provider (e.g., Vercel, Firebase App Hosting) to handle custom domains pointing to the application.

### Phase 3: Dynamic Feature Management
1.  **Component-Level Feature Flags:** Wrap feature-specific components and navigation links in conditional logic based on the `features` object from Remote Config.
2.  **Role-Based Access Control (RBAC):** Refine the `user_roles` config to dynamically build sidebars and control access to different dashboards based on the roles defined for the current tenant.
3.  **Admin UI for Tenant Management:** Build a "super admin" interface where the FitSync team can manage tenants, configure their plans, and toggle feature flags.

This phased approach allows for incremental delivery of value while managing the complexity of migrating to a full-fledged multi-tenant architecture.
