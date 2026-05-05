# KoloPay Frontend Documentation - Payaza Sprint Hackathon 🚀

This document serves as the official frontend engineering overview for **KoloPay**, built for the Payaza Sprint Hackathon. It covers the architecture, UI/UX methodologies, the problems we solved during the build phase, and our integration strategy for the Payaza API suite.

## 📱 Project Overview

**KoloPay** is a digital "Ajo" (group savings) and contribution platform. It digitizes the traditional group savings model, offering users secure contributions, automated payouts, trust scoring, and transparent group management.

**Team Objective:** To build a fully functional prototype integrating Payaza for seamless payment collection, identity verification, and payouts within a 5-day sprint window.

## 🛠 Tech Stack

- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS (v4)
- **Animations:** Framer Motion (`motion/react`) for fluid, native-feeling transitions.
- **Icons:** Lucide React
- **State Management:** React Context API (Custom `NavigationContext` for rapid view switching without router overhead).

## 📂 Architecture & Key Components

The app uses a modular, component-based design broken down by feature domains under `src/components/`:

1. **`auth/` (AuthFlow):** 
   - Multi-step onboarding (Intro -> Welcome -> Sign Up/In -> BVN -> Success).
   - Contains dynamic animations and layout transitions to maintain user engagement.
2. **`groups/` (Group Management):**
   - **Create Group Flow:** 3-step wizard (Name -> Rules -> Payout Strategy).
   - **Join Group:** Numpad UI for entering a 6-digit Ajo code based on the Payaza transaction reference mapping.
   - **Group Details & Tabs:** Tabbed interface for members (showing Trust Score & verification), timelines, and payment grids (Wk 1 to Wk 10 tracking).
3. **`payment/` (Wallet & Transactions):**
   - **AddMoneyModal:** Bottom sheet/modal simulation for topping up the wallet via Payaza (Card, Transfer).
   - **PaymentDrawer:** Checkout experience for group contributions.
4. **`home/` (Dashboard):**
   - Live balance toggle with blur effects (`blur-md`).
   - Group action summaries and skeleton loading states.

## 🔌 Payaza API Integration Strategy

To meet the core hackathon requirement, our frontend is designed to wire into the following Payaza APIs:

1. **Identity & BVN (AuthFlow.tsx):** 
   - The "Verify BVN" step in our Auth Flow maps directly to Payaza's Identity API. We created the UI to capture BVN and simulate the verification loading state.
2. **Collections & Top-ups (AddMoneyModal.tsx):**
   - The "Bank Transfer" option maps to Payaza's Dynamic Virtual Accounts API. Once configured on the backend, a unique bank account is displayed here for instant top-ups.
   - The "Card" option will trigger the Payaza Checkout Web SDK.
3. **Payouts & Distributions:**
   - The "Group Payout Strategy" (Random, First Come First Serve) will use Payaza's Transfer API to automatically disburse funds to the user's verified bank account when it is their turn in the Ajo cycle.

## 🐛 Challenges Solved & UI Fixes

During the fast-paced build phase, we encountered and fixed several frontend UX issues:

1. **Absolute Positioning Overflow in Auth Screens:**
   - **Problem:** On smaller screens (like iPhone SE), the `absolute inset-0` on the "Create Account" forms caused the "Continue" button to overlap with the Terms & Conditions text or get partially clipped at the bottom of the screen.
   - **Fix:** Refactored the container to use `flex-1 flex-col overflow-y-auto` instead of `absolute` pinning. We applied `mt-auto` to the submit buttons and action areas to keep them consistently pushed to the bottom of the scrollable area without overlapping form fields.
   
2. **Ugly Default Scrollbars breaking Immersion:**
   - **Problem:** Native desktop and mobile browsers injected thick scrollbars on our horizontal payment tables and vertical auth flows, ruining the native app feel.
   - **Fix:** Created a custom utility class `.hide-scrollbar` in `index.css` leveraging `-ms-overflow-style: none` and `scrollbar-width: none`, ensuring cross-browser invisible scrolling.

3. **Complex State Management across Group Tabs:**
   - **Problem:** Managing the active state for the Group interface (Overview, Members, Payments, Activity) was getting bloated.
   - **Fix:** Isolated the tab contents into sub-components (`/tabs/MembersTab.tsx`, etc.) and used a simple local state to swap them out instantly.

4. **"AjoSmart" to "KoloPay" Rebranding:**
   - **Action Taken:** Executed a sweeping update replacing all instances of the old codename "AjoSmart" with "KoloPay" across components (Auth, Layout, Drawers, Profile).

## 🚀 Execution against Judging Criteria

- **User Experience & Design (15%):** Applied Spring-physics animations (via Framer Motion), glassmorphism (`backdrop-blur-xl`), and micro-interactions (blurring balances, copy-to-clipboard feedback) for a premium feel.
- **Technical Execution (25%):** Clean React code, responsive Tailwind classes, reusable contexts, and structured directories.
- **Innovation (20%):** Digitizing a traditional social financial system ("Ajo"/"Esusu") into a modern, trustless, and reliable app format.

---
*Built for the Payaza Sprint Hackathon Phase 4 (Build Phase). Ready for backend wiring.*
