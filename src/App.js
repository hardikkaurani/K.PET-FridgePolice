import React, { useState, useId } from 'react';
import './App.css';
import FoodList from './components/FoodList';
import Modal from './components/Modal';

function App() {
  const [items, setItems] = useState([
    {
      id: 'item-1',
      name: 'Milk',
      quantity: 2,
      owner: 'Alice',
      status: 'available',
      requestedBy: null,
      approvedFor: null,
      approvedAt: null,
    },
    {
      id: 'item-2',
      name: 'Butter',
      quantity: 1,
      owner: 'Bob',
      status: 'available',
      requestedBy: null,
      approvedFor: null,
      approvedAt: null,
    },
    {
      id: 'item-3',
      name: 'Cheese',
      quantity: 10,
      owner: 'Alice',
      status: 'available',
      requestedBy: null,
      approvedFor: null,
      approvedAt: null,
    },
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    owner: '',
  });

  const [modal, setModal] = useState({
    open: false,
    type: null,
    itemId: null,
    user: '',
  });

  // Generate unique ID
  const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add new item
  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.owner) {
      alert('Please fill all fields');
      return;
    }

    const item = {
      id: generateId(),
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      owner: newItem.owner,
      status: 'available',
      requestedBy: null,
      approvedFor: null,
      approvedAt: null,
    };

    setItems([...items, item]);
    setNewItem({ name: '', quantity: '', owner: '' });
  };

  // Open modal for request or correction
  const openModal = (type, itemId) => {
    setModal({ open: true, type, itemId, user: '' });
  };

  // Close modal
  const closeModal = () => {
    setModal({ open: false, type: null, itemId: null, user: '' });
  };

  // SCENARIO 1: Prevent double request on low quantity (last 25%)
  const handleRequestPortion = () => {
    if (!modal.user.trim()) {
      alert('Enter your name');
      return;
    }

    const item = items.find((i) => i.id === modal.itemId);
    if (!item) return;

    // If already requested, don't allow double request
    if (item.status === 'requested') {
      alert('⚠️ Already requested! Only one person can get this portion. Waiting for approval.');
      return;
    }

    // If already approved, don't allow another request
    if (item.status === 'approved') {
      alert('⚠️ Already approved for someone! Wait for them to consume it.');
      return;
    }

    // Check if low quantity (last 25%)
    const isLowQuantity = item.quantity <= 2; // Simplified: less than 2 units

    setItems(
      items.map((i) =>
        i.id === modal.itemId
          ? {
              ...i,
              status: 'requested',
              requestedBy: modal.user,
            }
          : i
      )
    );

    if (isLowQuantity) {
      alert(`✅ Request placed! (Low quantity detected - limited to 1 person)`);
    } else {
      alert(`✅ Request placed by ${modal.user}`);
    }

    closeModal();
  };

  // SCENARIO 2: Approve request or mark expired
  const handleApprove = () => {
    const item = items.find((i) => i.id === modal.itemId);
    if (!item) return;

    setItems(
      items.map((i) =>
        i.id === modal.itemId
          ? {
              ...i,
              status: 'approved',
              approvedFor: modal.user,
              approvedAt: new Date().toISOString(),
            }
          : i
      )
    );

    alert(`✅ Approved for ${modal.user}!`);
    closeModal();
  };

  // Mark item as expired
  const handleExpire = (itemId) => {
    setItems(
      items.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'expired',
              requestedBy: null,
              approvedFor: null,
            }
          : i
      )
    );
    alert('⏰ Marked as expired. Item needs removal.');
  };

  // SCENARIO 4: Correct inventory manually
  const handleCorrectInventory = () => {
    if (!modal.user || isNaN(modal.user)) {
      alert('Enter a valid quantity number');
      return;
    }

    const newQty = parseInt(modal.user);

    setItems(
      items.map((i) =>
        i.id === modal.itemId
          ? {
              ...i,
              quantity: newQty,
              status: 'available',
              requestedBy: null,
              approvedFor: null,
            }
          : i
      )
    );

    alert(`✅ Inventory corrected!`);
    closeModal();
  };

  // Consume/use item
  const handleConsume = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (item.quantity > 1) {
      setItems(
        items.map((i) =>
          i.id === itemId
            ? {
                ...i,
                quantity: i.quantity - 1,
                status: 'available',
                requestedBy: null,
                approvedFor: null,
              }
            : i
        )
      );
      alert(`✅ Consumed 1 unit! ${item.quantity - 1} remaining.`);
    } else {
      setItems(items.filter((i) => i.id !== itemId));
      alert(`✅ Item removed from fridge!`);
    }
  };

  // Stats
  const totalItems = items.length;
  const lowStockItems = items.filter((i) => i.quantity <= 2 && i.status !== 'expired').length;
  const pendingRequests = items.filter((i) => i.status === 'requested').length;
  const expiredItems = items.filter((i) => i.status === 'expired').length;

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>🚔 FridgePolice</h1>
        <p>Manage shared fridge. Prevent waste. Prevent conflicts.</p>
      </div>

      <div className="app-content">
        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <div className="number">{totalItems}</div>
            <div className="label">Items in Fridge</div>
          </div>
          <div className="stat-card">
            <div className="number">{lowStockItems}</div>
            <div className="label">Low Stock</div>
          </div>
          <div className="stat-card">
            <div className="number">{pendingRequests}</div>
            <div className="label">Pending Requests</div>
          </div>
          <div className="stat-card">
            <div className="number">{expiredItems}</div>
            <div className="label">Expired</div>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="add-item-section">
          <h3>➕ Add New Item to Fridge</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              min="1"
            />
            <input
              type="text"
              placeholder="Owner name"
              value={newItem.owner}
              onChange={(e) => setNewItem({ ...newItem, owner: e.target.value })}
            />
            <button className="btn btn-primary" onClick={handleAddItem}>
              Add Item
            </button>
          </div>
        </div>

        {/* Food List */}
        {items.length > 0 ? (
          <FoodList
            items={items}
            onRequest={(itemId) => openModal('request', itemId)}
            onApprove={(itemId) => openModal('approve', itemId)}
            onExpire={handleExpire}
            onCorrect={(itemId) => openModal('correct', itemId)}
            onConsume={handleConsume}
          />
        ) : (
          <div className="empty-state">
            <h2>🌪️ Fridge is empty!</h2>
            <p>Add some items to get started.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <Modal
          type={modal.type}
          item={items.find((i) => i.id === modal.itemId)}
          user={modal.user}
          setUser={(user) => setModal({ ...modal, user })}
          onClose={closeModal}
          onRequest={handleRequestPortion}
          onApprove={handleApprove}
          onCorrect={handleCorrectInventory}
        />
      )}
    </div>
  );
}

export default App;
