import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookIdea from './BookIdea';
import '../Styles/Dashboard.css'; // Assuming the CSS file is named Dashboard.css

axios.defaults.withCredentials = true;

function Dashboard() {
  const [bookIdeas, setBookIdeas] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookIdeas();
  }, []);

  const fetchBookIdeas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bookideas');
      if (response.data.length !== 0) {
        setBookIdeas(response.data);
      }
    } catch (error) {
      console.error('Error fetching book ideas', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/bookideas', { title, description }, { withCredentials: true });
      if (response.data.message === 'Book idea created successfully!') {
        fetchBookIdeas();
        setTitle('');
        setDescription('');
      } else {
        fetchBookIdeas();
        alert(response.data.message);
      }
    } catch (error) {
      fetchBookIdeas();
      console.error('Error creating book idea', error);
    }
    fetchBookIdeas();
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:5000/bookideas/${id}`);
      if (response.data.message === 'Book idea deleted successfully!') {
        fetchBookIdeas();
        setLoading(true);
      } else {
        fetchBookIdeas();
        alert(response.data.message);
      }
    } catch (error) {
      fetchBookIdeas();
      console.error('Error deleting book idea.', error);
    } finally {
      fetchBookIdeas();
      setLoading(false);
    }
    fetchBookIdeas();
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
        {bookIdeas.map((idea) => (
          <div className="card" key={idea.id}>
            <BookIdea title={idea.title} description={idea.description} />
            <button 
              className="dashboard-button" 
              onClick={() => handleDelete(idea.id)} 
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

