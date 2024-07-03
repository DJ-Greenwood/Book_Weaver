import React from 'react';
import '../Styles/BookIdea.css'; // Assuming the CSS file is named BookIdea.css

function BookIdea({ title, description }) {
  return (
    <div className="card">
      <h4 className="card-title">{title}</h4>
      <p className="card-description">{description}</p>
    </div>
  );
}

export default BookIdea;
