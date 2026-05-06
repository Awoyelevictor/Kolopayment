# Kolopayment API Integration Tasks

## Phase 1: Django Backend Setup
- [x] Create `backend` directory and initialize Django project (`kolopay_api`).
- [x] Setup virtual environment and install dependencies (`django`, `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`, `requests`).
- [x] Configure `settings.py` (CORS, REST_FRAMEWORK settings, database, Payaza config).

## Phase 2: Django Apps & Models
- [x] Create `accounts` app (Custom User model, BVN fields).
- [x] Create `groups` app (SavingsGroup, GroupMembership).
- [x] Create `payments` app (Contribution, Payout).
- [x] Run migrations.

## Phase 3: API Endpoints (DRF)
- [x] `accounts` API (Register, Login/JWT, BVN verify).
- [x] `groups` API (List, Create, Join, Detail).
- [x] `payments` API (Process payment, fetch history, Payaza integration).

## Phase 4: React Frontend Integration
- [x] Install dependencies in `Kolopayment` frontend.
- [x] Fix TypeScript errors in `AuthFlow.tsx` and other components.
- [x] Create `src/services/api.ts` (Axios/Fetch wrapper with JWT handling and Silent Refresh).
- [x] Connect `AuthFlow.tsx` (Signup, Login, BVN).
- [x] Connect `HomeDashboard.tsx` (Profile, Balance, Next Payment).
- [x] Connect `GroupsList.tsx` and `GroupDetails.tsx`.
- [x] Connect `CreateGroupFlow.tsx` and `JoinGroupModal.tsx`.
- [x] Connect `PaymentFlow.tsx` and `PaymentsList.tsx`.

## Phase 5: Design & Polish
- [x] Implement Glassmorphism theme globally.
- [x] Ensure brand color consistency (Blue #0052FF).
- [x] Fix image blending issues on Welcome screen.

## Phase 6: Verification
- [x] Test full user flow locally.
- [x] Verify Payaza server-to-server communication.
- [x] Verify Silent JWT Refresh mechanism.
