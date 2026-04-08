import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentalService } from '../services/rental.service';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { formatPrice, formatDate } from '../utils/helpers';
import { Check, X, Eye } from 'lucide-react';
import './RentalRequests.css';

/**
 * RentalRequests page — shows outgoing and incoming rental requests with status management.
 */
export default function RentalRequests() {
  const [tab, setTab] = useState('mine');
  const [myRentals, setMyRentals] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetchRentals();
  }, []);

  async function fetchRentals() {
    setLoading(true);
    try {
      const [mineRes, receivedRes] = await Promise.all([
        rentalService.getMyRentals(),
        rentalService.getReceivedRequests(),
      ]);
      setMyRentals(mineRes.data.rentals || []);
      setReceived(receivedRes.data.rentals || []);
    } catch (err) {
      showToast('Failed to load rentals', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(rentalId, status) {
    try {
      await rentalService.updateStatus(rentalId, status);
      showToast(`Rental ${status} successfully`);
      fetchRentals();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  const rentals = tab === 'mine' ? myRentals : received;

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="container">
        <h1 className="page-title">Rental Requests</h1>

        <div className="tabs" id="rental-tabs">
          <button
            className={`tab ${tab === 'mine' ? 'active' : ''}`}
            onClick={() => setTab('mine')}
          >
            My Requests ({myRentals.length})
          </button>
          <button
            className={`tab ${tab === 'received' ? 'active' : ''}`}
            onClick={() => setTab('received')}
          >
            Received ({received.length})
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : rentals.length === 0 ? (
          <div className="empty-state">
            <h3>No {tab === 'mine' ? 'outgoing' : 'incoming'} requests</h3>
            <p>
              {tab === 'mine'
                ? 'Browse items and send rental requests to get started.'
                : 'When someone requests to rent your items, they\'ll appear here.'}
            </p>
          </div>
        ) : (
          <div className="rental-list">
            {rentals.map((rental) => (
              <div key={rental._id} className="rental-card card" id={`rental-${rental._id}`}>
                <div className="rental-card-inner">
                  <div className="rental-item-info">
                    {rental.item && (
                      <Link to={`/items/${rental.item._id}`} className="rental-item-title">
                        {rental.item.title}
                      </Link>
                    )}
                    <div className="rental-dates">
                      {formatDate(rental.startDate)} — {formatDate(rental.endDate)}
                    </div>
                    <div className="rental-person">
                      {tab === 'mine'
                        ? `Owner: ${rental.owner?.name || 'Unknown'}`
                        : `Renter: ${rental.renter?.name || 'Unknown'}`}
                    </div>
                    {rental.message && (
                      <div className="rental-message">"{rental.message}"</div>
                    )}
                  </div>

                  <div className="rental-right">
                    <div className="rental-price">{formatPrice(rental.totalPrice)}</div>
                    <span className={`badge badge-${rental.status}`}>{rental.status}</span>

                    {tab === 'received' && rental.status === 'pending' && (
                      <div className="rental-actions">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleStatusUpdate(rental._id, 'approved')}
                          title="Approve"
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleStatusUpdate(rental._id, 'rejected')}
                          title="Reject"
                        >
                          <X size={16} /> Reject
                        </button>
                      </div>
                    )}

                    {rental.status === 'approved' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStatusUpdate(rental._id, 'active')}
                      >
                        Mark Active
                      </button>
                    )}

                    {rental.status === 'active' && tab === 'received' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStatusUpdate(rental._id, 'completed')}
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
