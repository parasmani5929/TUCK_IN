import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Payment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get('order_id');
  const amount = params.get('amount');
  const [countdown, setCountdown] = useState(10);
  const [showBtn, setShowBtn] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (!orderId || !amount) {
    return (
      <div className="page" style={{ textAlign: 'center' }}>
        <p>Invalid payment request.</p>
      </div>
    );
  }

  const upiId = '9470446751@ptyes';
  const payeeName = 'Tuckin';
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&mc=&tid=${orderId}&tr=${orderId}&tn=Food Order Payment&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); setShowBtn(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await API.post(`/orders/${orderId}/verify-payment`);
      toast.success('Payment confirmed! Email sent.');
      navigate(`/order-success?order_id=${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 480, textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: 36 }}>
        <h2 style={{ background: 'linear-gradient(135deg,#ff6b35,#ffd700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8 }}>
          📱 Scan & Pay via UPI
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
          <strong style={{ color: '#f0f0f5' }}>Order ID:</strong> #{orderId.slice(-8)}
        </p>
        <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 24 }}>
          ₹{amount}
        </p>

        {!showBtn && (
          <>
            <img
              src={qrUrl}
              alt="UPI QR Code"
              style={{ width: 220, height: 220, borderRadius: 16, border: '3px solid rgba(255,107,53,0.3)', marginBottom: 16 }}
            />
            <div style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 12, padding: '12px 20px', display: 'inline-block', marginBottom: 8 }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                QR disappears in <strong style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>{countdown}s</strong>
              </p>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              UPI ID: <code style={{ color: 'var(--accent)' }}>{upiId}</code>
            </p>
          </>
        )}

        {showBtn && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h3 style={{ marginBottom: 8 }}>Done paying?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Click below to confirm your payment and receive a confirmation email.
            </p>
            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={handleVerify}
              disabled={verifying}
            >
              {verifying ? 'Verifying...' : '✅ I Have Paid'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
