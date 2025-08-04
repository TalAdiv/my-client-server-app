import React from 'react';

function ModalImage({ src, onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <span className="close" onClick={onClose}>&times;</span>
      <img src={src} alt="הגדלה" className="modal-content" />
    </div>
  );
}

export default ModalImage;
