#!/bin/bash

# Set up the project directory
mkdir book_generator
cd book_generator

# Set up the backend
mkdir backend
cd backend

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Create requirements.txt
echo "Flask
Flask-CORS
Flask-SQLAlchemy
Flask-Login" > requirements.txt

# Install the dependencies
pip install -r requirements.txt

# Create the Flask application
echo "from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

# User Model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

# Book Idea Model
class BookIdea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(username=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({\"message\": \"User registered successfully!\"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        login_user(user)
        return jsonify({\"message\": \"Login successful!\"}), 200
    return jsonify({\"message\": \"Invalid credentials\"}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({\"message\": \"Logged out successfully!\"}), 200

@app.route('/bookideas', methods=['POST'])
@login_required
def create_book_idea():
    data = request.get_json()
    new_idea = BookIdea(title=data['title'], description=data['description'], user_id=current_user.id)
    db.session.add(new_idea)
    db.session.commit()
    return jsonify({\"message\": \"Book idea created successfully!\"}), 201

@app.route('/bookideas', methods=['GET'])
@login_required
def get_book_ideas():
    ideas = BookIdea.query.filter_by(user_id=current_user.id).all()
    return jsonify([{\"title\": idea.title, \"description\": idea.description} for idea in ideas]), 200

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)" > app.py

# Create the database schema
echo "CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE book_idea (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user (id)
);" > schema.sql

# Set up the frontend
cd ..
npx create-react-app frontend
cd frontend

# Install dependencies
npm install axios react-router-dom

# Create React components
mkdir -p src/components

echo "import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path=\"/login\" component={Login} />
          <Route path=\"/register\" component={Register} />
          <Route path=\"/dashboard\" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;" > src/App.js

echo "import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      alert(response.data.message);
      history.push('/dashboard');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type=\"text\" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type=\"password\" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type=\"submit\">Login</button>
      </form>
    </div>
  );
}

export default Login;" > src/components/Login.js

echo "import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      alert(response.data.message);
      history.push('/login');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type=\"text\" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type=\"password\" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type=\"submit\">Register</button>
      </form>
    </div>
  );
}

export default Register;" > src/components/Register.js

echo "import React, { useState, useEffect } from 'react';
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
          <input type=\"text\" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type=\"submit\">Create Book Idea</button>
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

export default Dashboard;" > src/components/Dashboard.js

echo "import React from 'react';

function BookIdea({ title, description }) {
  return (
    <div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

export default BookIdea;" > src/components/BookIdea.js

# Final instructions
echo "Project setup complete. To run the application, follow these steps:

1. Backend:
cd backend
source venv/bin/activate
flask run

2. Frontend:
cd frontend
npm start

The backend will run on http://localhost:5000 and the frontend will run on http://localhost:3000."
