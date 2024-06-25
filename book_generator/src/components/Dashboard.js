import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookIdea from './BookIdea';

function Dashboard() {
  const [bookIdeas, setBookIdeas] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchBookIdeas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bookideas');
        setBookIdeas(response.data);
      } catch (error) {
        console.error('Error fetching book ideas', error);
      }
    };
    fetchBookIdeas();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/bookideas', { title, description });
      alert(response.data.message);
      setBookIdeas([...bookIdeas, { title, description }]);
    } catch (error) {
      console.error('Error creating book idea', error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Create Book Idea</button>
      </form>
      <div>
        <h3>Your Book Ideas</h3>
        {bookIdeas.map((idea, index) => (
          <BookIdea key={index} title={idea.title} description={idea.description} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
