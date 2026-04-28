import React from 'react';

function Modal({ type, item, user, setUser, onClose, onRequest, onApprove, onCorrect }) {
  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {type === 'request' && (
          <>
            <h2>🙋 Request Portion of {item.name}</h2>
            <div className="modal-form">
              <label>Your name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoFocus
              />
              <p style={{ fontSize: '0.9em', color: '#666', margin: '10px 0' }}>
                Quantity available: <strong>{item.quantity}</strong>
              </p>
              {item.quantity <= 2 && (
                <p style={{ fontSize: '0.9em', color: '#f44336', margin: '10px 0' }}>
                  ⚠️ Low stock detected! Only one person can request this.
                </p>
              )}
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={onRequest}>
                  Request
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {type === 'approve' && (
          <>
            <h2>✅ Approve Request</h2>
            <div className="modal-form">
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Approve <strong>{item.requestedBy}</strong>'s request for{' '}
                <strong>{item.name}</strong>?
              </p>
              <label>Approve for:</label>
              <input
                type="text"
                placeholder={item.requestedBy || 'User name'}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button className="btn btn-success" onClick={onApprove}>
                  Approve
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {type === 'correct' && (
          <>
            <h2>🔧 Correct Inventory</h2>
            <div className="modal-form">
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Current quantity: <strong>{item.quantity}</strong>
              </p>
              <label>Set new quantity:</label>
              <input
                type="number"
                placeholder="New quantity"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoFocus
                min="0"
              />
              <p style={{ fontSize: '0.85em', color: '#999', margin: '10px 0' }}>
                (Enter 0 to remove item)
              </p>
              <div className="modal-actions">
                <button className="btn btn-warning" onClick={onCorrect}>
                  Correct
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Modal;
