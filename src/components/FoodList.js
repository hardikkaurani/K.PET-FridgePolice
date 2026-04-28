import React from 'react';

function FoodList({ items, onRequest, onApprove, onExpire, onCorrect, onConsume }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="food-list">
      {items.map((item) => (
        <div
          key={item.id}
          className={`food-item ${item.status} ${
            item.quantity <= 2 && item.status !== 'expired' ? 'low-stock' : ''
          }`}
        >
          {/* Item Info */}
          <div className="item-info">
            <h3>{item.name}</h3>
            <div className="item-details">
              <div className="detail">
                <strong>Owner:</strong> {item.owner}
              </div>
              <div className="detail">
                <strong>Added:</strong> {new Date(item.id.split('-')[1]).toLocaleDateString()}
              </div>
            </div>

            {/* Request Info */}
            {item.requestedBy && (
              <div className="detail">
                <strong>🙋 Requested by:</strong> {item.requestedBy}
              </div>
            )}

            {/* Approval Info */}
            {item.approvedFor && (
              <div className="detail">
                <strong>✅ Approved for:</strong> {item.approvedFor}
              </div>
            )}

            {/* Status Badge */}
            <span className={`status-badge status-${item.status}`}>
              {item.status === 'available' && '✓ Available'}
              {item.status === 'requested' && '⏳ Requested'}
              {item.status === 'approved' && '🔒 Approved'}
              {item.status === 'expired' && '⏰ Expired'}
            </span>
          </div>

          {/* Quantity & Owner */}
          <div className="item-meta">
            <div className="quantity">{item.quantity}</div>
            <div className="owner">
              {item.quantity <= 2 && item.status !== 'expired' && '🔴 Low Stock'}
            </div>
          </div>

          {/* Actions */}
          <div className="item-actions">
            {item.status === 'available' && (
              <>
                <div className="item-actions-row">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onRequest(item.id)}
                  >
                    🙋 Request Portion
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => onConsume(item.id)}
                  >
                    ✅ Consume
                  </button>
                </div>
                <div className="item-actions-row">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => onExpire(item.id)}
                  >
                    ⏰ Mark Expired
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onCorrect(item.id)}
                  >
                    🔧 Correct Stock
                  </button>
                </div>
              </>
            )}

            {item.status === 'requested' && (
              <div className="item-actions-row">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onApprove(item.id)}
                >
                  ✅ Approve Request
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onExpire(item.id)}
                >
                  ❌ Deny & Expire
                </button>
              </div>
            )}

            {item.status === 'approved' && (
              <div className="item-actions-row">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onConsume(item.id)}
                >
                  ✅ Mark Consumed
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => onExpire(item.id)}
                >
                  ⏰ Mark Stale
                </button>
              </div>
            )}

            {item.status === 'expired' && (
              <div className="item-actions-row">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onCorrect(item.id)}
                >
                  🔧 Restore & Fix
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FoodList;
