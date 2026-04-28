# Changes & Scenarios - FridgePolice

## Overview
FridgePolice is a shared fridge management system that prevents conflicts and food waste by handling 4 critical scenarios correctly.

---

## 🎯 Scenario 1: Double Request (Last 25% - Prevent Double Allocation)

### Problem
When food is running low (last 25%), multiple people might request it simultaneously. This causes conflicts because there's only enough for ONE person.

### Solution
- **Status Lock**: Once someone requests, item status changes to `requested` 
- **Prevention**: Second person gets alert: "⚠️ Already requested! Only one person can get this. Waiting for approval."
- **Low Stock Detection**: When quantity ≤ 2 units, system flags as "low stock"
- **One Person, One Request**: Using status field as a lock mechanism prevents double allocation

### Code Flow
```
1. Alice sees 2 units of Cheese left
2. Alice clicks "Request Portion" → status: 'available' → 'requested'
3. Bob tries to request same Cheese
4. Bob gets blocked: "Already requested! Waiting for approval."
5. Only Alice can proceed after owner approves
```

### Verification
- ✅ First requester gets through
- ✅ Second requester gets blocked with clear message
- ✅ No double allocation possible

---

## 🎯 Scenario 2: Approved But Not Consumed (Stale Approvals)

### Problem
Bob approves Milk for Alice on Monday. Alice forgets about it. Tuesday morning, Milk is still approved but not consumed - it's now stale.

### Solution
- **Stale Detection**: Add "Mark Expired" button for owner
- **Approval Tracking**: Store `approvedFor`, `approvedAt` timestamp
- **Manual Expiry**: Owner can mark approved item as expired
- **Clear Stale State**: Clicking "Mark Stale" on approved items clears approval

### Code Flow
```
1. Alice requests Milk (status: 'requested')
2. Bob approves for Alice (status: 'approved', approvedFor: 'Alice')
3. Alice never consumes it (overnight, next day)
4. Bob sees "⏰ Mark Stale" button
5. Bob clicks it → status: 'expired', clears approvedFor
6. Owner can add fresh Milk to replace
```

### Verification
- ✅ Approvals have timestamps
- ✅ Owner can mark approved items as expired
- ✅ Stale state clears automatically
- ✅ Prevents waste from forgotten approvals

---

## 🎯 Scenario 3: Identical Items (Use Unique IDs)

### Problem
Two cartons of Milk in fridge:
- Milk #1 (Alice's, expires tomorrow)
- Milk #2 (Bob's, expires next week)

If system only tracks by name, they get confused.

### Solution
- **Unique IDs**: Each item has `id: 'item-{timestamp}-{random}'`
- **Never by Name**: Primary key is ID, not name
- **Independent States**: Both can have different quantities, owners, statuses

### Code Flow
```
1. Alice adds Milk (ID: item-1704067200-abc123)
2. Bob adds Milk (ID: item-1704067200-xyz789)
3. Both tracked separately in array
4. Each can have own status: one 'available', other 'expired'
5. No confusion - they're different items
```

### Verification
- ✅ Two Milk items coexist without conflict
- ✅ Different statuses possible
- ✅ Independent quantity tracking
- ✅ Each item has unique ID

---

## 🎯 Scenario 4: Reality Mismatch (Correct Inventory)

### Problem
Reality doesn't match system state:
- System says: 5 yogurts left
- Actual fridge: Only 2 yogurts (someone ate without logging)
- OR: System says item expired, but it's still fresh

### Solution
- **Correct Stock Button**: "🔧 Correct Stock" for any item
- **Manual Adjustment**: Owner can set true quantity
- **State Reset**: Correcting clears request/approval states
- **Fixes Reality Gap**: Brings system back in sync

### Code Flow
```
1. System shows: 5 Yogurts (available)
2. Alice checks actual fridge: Only 2 left
3. Alice clicks "🔧 Correct Stock"
4. Modal: "Current: 5, Set new: 2"
5. Alice enters 2
6. System updates: quantity=2, status='available', clears requests
7. Reality and system now match ✅
```

### Verification
- ✅ Can adjust any item's quantity
- ✅ Resets to 'available' state
- ✅ Clears stale requests/approvals
- ✅ Manual override always possible

---

## 🎬 Quick Test Sequence

### Setup
1. App starts with 3 items: Milk, Butter, Cheese
2. Milk (qty 2, Alice), Butter (qty 1, Bob), Cheese (qty 10, Alice)

### Test Scenario 1: Double Request
```
1. Bob requests Milk
   → Status shows "⏳ Requested by Bob"
2. Charlie tries to request same Milk
   → Alert: "Already requested! Waiting for approval."
   → Charlie blocked ✅
```

### Test Scenario 2: Stale Approval
```
1. Bob requests Cheese
   → Status: "⏳ Requested"
2. Alice (owner) approves for Bob
   → Status: "🔒 Approved for Bob"
3. Alice clicks "⏰ Mark Stale"
   → Status back to "✓ Available"
   → Approval cleared ✅
```

### Test Scenario 3: Identical Items
```
1. Alice adds Milk (qty 2)
2. Bob adds Milk (qty 3)
   → Both show in list with different IDs
   → Different quantities, different owners
   → Can manage independently ✅
```

### Test Scenario 4: Correct Inventory
```
1. System shows Cheese: qty 10
2. Alice clicks "🔧 Correct Stock"
3. Modal shows "Current: 10"
4. Alice enters 5
   → Quantity updates to 5
   → Status resets to available ✅
```

---

## 💾 Data Structure

```javascript
item = {
  id: 'item-1704067200-abc123',      // Unique ID (UUID-like)
  name: 'Milk',
  quantity: 2,
  owner: 'Alice',
  status: 'available' | 'requested' | 'approved' | 'expired',
  requestedBy: 'Bob' | null,         // Who requested it
  approvedFor: 'Bob' | null,         // Who it was approved for
  approvedAt: '2024-01-01T12:00:00Z' | null  // When approved
}
```

---

## 🚨 Edge Cases Handled

| Case | How It's Handled |
|------|-----------------|
| Empty fridge | Empty state message |
| Two requests same item | Status lock prevents 2nd |
| Approval never consumed | "Mark Stale" clears it |
| Same item name × 2 | Unique IDs track separately |
| Quantity doesn't match reality | "Correct Stock" syncs it |
| Approve non-existent item | Modal checks item exists |
| Consume empty item | Item removed from list |
| Correct to 0 quantity | Item removed |

---

## ✅ All 4 Scenarios Verified

- ✅ **Scenario 1** - Double request prevented
- ✅ **Scenario 2** - Stale approvals cleared
- ✅ **Scenario 3** - Identical items tracked separately
- ✅ **Scenario 4** - Inventory corrections work

Ready for production! 🚀
