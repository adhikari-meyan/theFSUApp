from flask import Flask, request, jsonify, url_for, render_template, session
from models import db, User, Post, Comment, Like
from datetime import datetime, timedelta
import traceback

app = Flask(__name__)
app.secret_key = "nice"

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # Use PostgreSQL/MySQL in production
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()



events_data = {
    "2025-02-23": [
        {
            "title": "Deadline",
            "time": "12:00 AM",
            "description": "Hritik Acharya Memorial Pulchowk Pride Award"
        },
    ]
}

@app.route('/getcalendar', methods=["POST"])
def get_calendar():
    data = request.get_json()
    year = data.get('year')
    month = data.get('month')

    events = {
        day_str: events_data[day_str]
        for day in range(1, 32)
        if (day_str := f"{year}-{str(month).zfill(2)}-{str(day).zfill(2)}") in events_data
    }

    return jsonify(events)



@app.route('/add_comment', methods=["POST"])
def add_comment():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        comment_text = data.get('comment')
        user_id = session.get('userID')

        if not all([post_id, comment_text, user_id]):
            return jsonify({"error": "Post ID, comment text, and user must be provided"}), 400

        post = Post.query.get(post_id)
        user = User.query.get(user_id)

        if not post:
            return jsonify({"error": "Post not found"}), 404

        if not user:
            return jsonify({"error": "User not found"}), 404

        new_comment = Comment(post_id=post.id, user_id=user.id, text=comment_text, time=datetime.utcnow())
        db.session.add(new_comment)
        db.session.commit()

        return jsonify({
            "success": True,
            "comment_id": new_comment.id,
            "comment": {
                "id": new_comment.id,
                "user": user.name,
                "text": comment_text,
                "time": new_comment.time.strftime("%Y-%m-%d %H:%M:%S")
            }
        }), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



@app.route('/toggle_like', methods=["POST"])
def toggle_like():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        user_id = session.get('userID')

        if not post_id or not user_id:
            return jsonify({"error": "Post ID and User ID are required"}), 400

        post = Post.query.get(post_id)
        user = User.query.get(user_id)

        if not post:
            return jsonify({"error": "Post not found"}), 404

        existing_like = Like.query.filter_by(post_id=post_id, user_id=user_id).first()

        if existing_like:
            db.session.delete(existing_like)
            db.session.commit()
            liked = False
        else:
            new_like = Like(post_id=post_id, user_id=user_id)
            db.session.add(new_like)
            db.session.commit()
            liked = True

        like_count = Like.query.filter_by(post_id=post_id).count()

        return jsonify({"success": True, "liked": liked, "likes": like_count}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



@app.route("/addPost", methods=["GET","POST"])
def add_post():
    if request.method == "POST":
        try:
            data = request.form
            user_id = data.get('user')
            content = data.get('content')
            images = request.files.getlist('images')

            if not user_id or not content:
                return jsonify({"error": "User ID and content are required"}), 400

            user = User.query.get(user_id)
            if not user:
                return jsonify({"error": "User not found"}), 404

            post = Post(user_id=user.id, content=content, time=datetime.now(), images=",".join(i.filename for i in images))
            db.session.add(post)
            db.session.commit()

            return jsonify({"success": True, "post_id": post.id, "message": "Post created successfully"}), 201

        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500
    else:
        return render_template('post.html',id=len(Post.query.all())+1,users=[i for i in User.query.all()])



@app.route("/", methods=["POST","GET"])
def add_user():
    if request.method == 'POST':
        try:
            data = request.form
            name = data.get('name')
            user_id = data.get('userID')
            avatar = data.get('photo')

            if not all([name, user_id, avatar]):
                return jsonify({"error": "All fields are required"}), 400

            user = User(id=int(user_id), name=name, avatar=avatar)
            db.session.add(user)
            db.session.commit()

            return jsonify({"success": True, "user_id": user.id, "message": "User added successfully"}), 201

        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500
    else:
        return render_template('index.html',id = len(User.query.all()+1))


@app.route("/get_username", methods=["GET"])
def get_username():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "Username is required"}), 400

    session['userID'] = User.query.first().id 
    return jsonify({"username": username}), 200



@app.route("/home_feed", methods=["GET"])
def home_feed():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 5))

        if page < 1 or limit < 1:
            return jsonify({"error": "Invalid page or limit parameters"}), 400

        posts = Post.query.paginate(page=page, per_page=limit, error_out=False).items

        return jsonify({
            "message": "Welcome to the homepage feed!",
            "feed": [{
                "id": post.id,
                'user': {
                    'name': post.user.name,
                    'time': post.time.strftime("%Y-%m-%d %H:%M"),
                    'avatar': url_for('static', filename=post.user.avatar, _external=True)
                },
                'content': post.content,
                'isLiked':Like.query.filter_by(post_id = post.id,user_id =int(session.get('userID'))).count() == 1,
                "likes": Like.query.filter_by(post_id=post.id).count(),
                "comments": [{
                    "id": comment.id,
                    "user": User.query.filter_by(id = comment.user_id).first().name,
                    "text": comment.text,
                    'pfp': url_for('static', filename=User.query.filter_by(id = comment.user_id).first().avatar, _external=True)
                } for comment in post.comments],
                'images': [url_for('static',filename=i,_external = True) for i in post.images.split(',')] if post.images else []
            } for post in posts]
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
    