import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, User } from 'lucide-react';
import { itemService } from '../services/item.service';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { rentalService } from '../services/rental.service';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { formatPrice, formatDate, getPlaceholderImage } from '../utils/helpers';
import './ItemDetails.css';

/**
 * ItemDetails page — shows full item info with rental request form.
 */
export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast, showToast } = useToast();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [renting, setRenting] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await itemService.getItem(id);
        setItem(res.data.item);
      } catch (err) {
        showToast('Item not found', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  async function handleRent(e) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setRenting(true);
    try {
      await rentalService.createRental({
        itemId: item._id,
        startDate,
        endDate,
        message,
      });
      showToast('Rental request sent!');
      setTimeout(() => navigate('/rentals'), 1500);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRenting(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!item) return null;

  const imgSrc = item.images?.length > 0 ? item.images[0] : getPlaceholderImage(item.category);
  const isOwner = user && item.owner?._id === user._id;

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="container">
        <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="item-detail" id="item-detail">
          <div className="item-detail-image">
            <img src={imgSrc} alt={item.title} />
            <span className="item-card-category">{item.category}</span>
          </div>

          <div className="item-detail-info">
            <h1 className="item-detail-title">{item.title}</h1>

            <div className="item-detail-price">
              {formatPrice(item.pricePerDay)}
              <span>/day</span>
            </div>

            <div className="item-detail-meta">
              <span className={`badge badge-${item.condition === 'new' ? 'approved' : 'active'}`}>
                {item.condition}
              </span>
              {item.location && (
                <span className="item-detail-location">
                  <MapPin size={16} /> {item.location}
                </span>
              )}
              <span className="item-detail-date">
                <Calendar size={16} /> Listed {formatDate(item.createdAt)}
              </span>
            </div>

            <div className="item-detail-desc">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>

            {item.owner && (
              <Link to={`/profile/${item.owner._id}`} className="item-detail-owner">
                <div className="owner-avatar">
                  <User size={20} />
                </div>
                <div>
                  <div className="owner-name">{item.owner.name}</div>
                  <StarRating rating={item.owner.rating} size={14} />
                </div>
              </Link>
            )}

            {!isOwner && item.isAvailable && (
              <form className="rent-form" onSubmit={handleRent} id="rent-form">
                <h3>Request to Rent</h3>
                <div className="rent-dates">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message (optional)</label>
                  <textarea
                    className="form-input"
                    placeholder="Introduce yourself and explain your need..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={renting}
                  id="rent-submit"
                  style={{ width: '100%' }}
                >
                  {renting ? 'Sending request...' : 'Send Rental Request'}
                </button>
              </form>
            )}

            {!item.isAvailable && (
              <div className="badge badge-cancelled" style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
                This item is currently unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
