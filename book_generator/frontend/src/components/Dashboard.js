import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookIdea from './BookIdea';
import '../Styles/Dashboard.css';

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
    <div className='dashboard-contianer'>
      <div callName='dashboard-h2'>
        <h2>Dashboard</h2>
          <div className='dashboard-form'>
            <form onSubmit={handleSubmit}>
              <div className='dashboard-label'>
                <label>Title:  </label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='dashboard-input' />
              </div>
              <div className='dashboard-label'>
                <label>Description: </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='dashboard-input' />
              </div>
              <button type="submit" className='dashboard-button'>Create Book Idea</button>
            </form>
            <div>
              <h3>Your Book Ideas</h3>
              {bookIdeas.map((idea, index) => (
                <BookIdea key={index} title={idea.title} description={idea.description} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
