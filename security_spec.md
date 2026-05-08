# Security Specification for KoloPay

## Data Invariants
1. A user can only read and write their own profile data.
2. A user can create a group (as admin).
3. A user can join a group if they have the join code (or just join open groups, but typically invite-based for Ajos).
4. Members of a group can read group details.
5. Only group members can read/see the payouts/contributions relating to that group.
6. walletBalance can only be updated by the system or via controlled transaction documents (using atomic increment logic in functions or strictly validated clients if no functions, though rules can check existence of related transaction).
7. Transactions are immutable once created.

## The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Identity Spoofing**: Attempt to create a user profile with a `uid` that doesn't match `request.auth.uid`.
2. **Resource Poisoning**: Attempt to set `walletBalance` to a negative number or a massive float.
3. **Ghost Fields**: Attempt to add `isAdmin: true` to a user profile when the schema doesn't allow it.
4. **Unauthorized Read**: Authenticated User A tries to read Authenticated User B's private profile.
5. **Orphaned Write**: Create a transaction without a corresponding user existing.
6. **State Shortcut**: Change a group status from `active` directly to `completed` without meeting conditions (if rules could check that).
7. **Privilege Escalation**: User A tries to edit User B's payout position in a group.
8. **Invisible Member**: A non-member trying to read the member list of a private group.
9. **Spam Notifications**: User A trying to write a notification into User B's collection.
10. **ID Poisoning**: Using a massive string as a `groupId`.
11. **Timestamp Spoofing**: Setting `createdAt` to a date in the past instead of `request.time`.
12. **Balance Hack**: Directly updating `walletBalance` without an accompanying valid transaction document.

## Test Runner (Logic Outline)
- `tests/firestore.rules.test.ts` will be implemented to verify these.
