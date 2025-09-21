import './Popup.css';

export default function Popup({ open, children }) {
  if (!open) return null;
  return (
    <div className="popup-container">
      <div className="popup-window">
        {children}
      </div>
    </div>
  );
}
