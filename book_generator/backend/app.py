from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_hashing import Hashing

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
hashing = Hashing(app)

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

@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = hashing.hash_value(data['password'], salt='abc123')  # You can use a more secure salt here
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and hashing.check_value(user.password, data['password'], salt='abc123'):  # Use the same salt as above
        login_user(user)
        return jsonify({"message": "Login successful!", "user_id": user.id}), 200
    return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully!"}), 200

@app.route('/bookideas', methods=['POST'])
@login_required
def create_book_idea():
    data = request.get_json()
    new_idea = BookIdea(title=data['title'], description=data['description'], user_id=current_user.id)
    db.session.add(new_idea)
    db.session.commit()
    return jsonify({"message": "Book idea created successfully!"}), 201

@app.route('/bookideas', methods=['GET'])
@login_required
def get_book_ideas():
    ideas = BookIdea.query.filter_by(user_id=current_user.id).all()
    return jsonify([{"id": idea.id, "title": idea.title, "description": idea.description, "user_id": idea.user_id} for idea in ideas]), 200

@app.route('/bookideas/<int:id>', methods=['DELETE'])
@login_required
def delete_book_idea(id):
    idea = BookIdea.query.get_or_404(id)
    if idea.user_id != current_user.id:
        return jsonify({"message": "You do not have permission to delete this book idea!"}), 403
    db.session.delete(idea)
    db.session.commit()
    return jsonify({"message": "Book idea deleted successfully!"}), 200

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
