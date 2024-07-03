import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookIdea from './BookIdea';
import '../Styles/Dashboard.css'; // Assuming the CSS file is named Dashboard.css

axios.defaults.withCredentials = true;

function Dashboard() {
  const [bookIdeas, setBookIdeas] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchBookIdeas();
  }, []);

  const fetchBookIdeas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bookideas');
      if (response.data.length !== 0) {
        setBookIdeas(response.data);
        return;
      }
    } catch (error) {
      console.error('Error fetching book ideas', error);
    }
  };

  const handleSubmit = async (event) => {
    const user_id = localStorage.getItem('userId');
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/bookideas', { title, description, user_id }, { withCredentials: true });
      if (response.data.message !== 'Book idea created successfully!') {
        alert(response.data.message);
      }
      fetchBookIdeas();
    } catch (error) {
      console.error('Error creating book idea', error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-2 mb-2">Dashboard</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="dashboard-input"
            />
          </div>
          <div className="mb-1">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="dashboard-input"
            />
          </div>
          <button type="submit" className="dashboard-button">Create Book Idea</button>
        </form>
      </div>
      <div>
        <h3 className="text-center mt-3 mb-2">Your Book Ideas</h3>
        {bookIdeas.map((idea, index) => (
          <div className="card" key={index}>
            <BookIdea title={idea.title} description={idea.description} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
