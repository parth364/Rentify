import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/item.service';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { ArrowLeft } from 'lucide-react';
import './CreateItem.css';

const CATEGORIES = [
  'textbooks', 'electronics', 'bikes', 'cameras',
  'furniture', 'clothing', 'sports', 'instruments', 'other',
];

const CONDITIONS = ['new', 'like-new', 'good', 'fair', 'poor'];

/**
 * CreateItem page — form to list a new item for rent.
 */
export default function CreateItem() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'other',
    pricePerDay: '',
    condition: 'good',
    location: '',
    images: [],
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'pricePerDay' ? (value === '' ? '' : Number(value)) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await itemService.createItem({
        ...form,
        pricePerDay: Number(form.pricePerDay),
      });
      showToast('Item listed successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="container">
        <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="create-item-container">
          <h1 className="create-item-title">List a New Item</h1>
          <p className="create-item-subtitle">Fill in the details to list your item for rent</p>

          <form className="create-item-form" onSubmit={handleSubmit} id="create-item-form">
            <div className="form-group">
              <label className="form-label" htmlFor="item-title">Title</label>
              <input
                type="text"
                id="item-title"
                name="title"
                className="form-input"
                placeholder="e.g. Canon EOS R6 Camera"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="item-description">Description</label>
              <textarea
                id="item-description"
                name="description"
                className="form-input"
                placeholder="Describe your item, its features, and any rules for renting..."
                value={form.description}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="item-category">Category</label>
                <select
                  id="item-category"
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="item-condition">Condition</label>
                <select
                  id="item-condition"
                  name="condition"
                  className="form-select"
                  value={form.condition}
                  onChange={handleChange}
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond.charAt(0).toUpperCase() + cond.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="item-price">Price per Day (₹)</label>
                <input
                  type="number"
                  id="item-price"
                  name="pricePerDay"
                  className="form-input"
                  placeholder="100"
                  value={form.pricePerDay}
                  onChange={handleChange}
                  required
                  min={1}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="item-location">Location</label>
                <input
                  type="text"
                  id="item-location"
                  name="location"
                  className="form-input"
                  placeholder="e.g. Hostel Block A"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              id="create-submit"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? 'Listing...' : 'List Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
