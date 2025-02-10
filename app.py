from flask import Flask, request, jsonify,url_for,render_template,session
from models import User,Post,Comment
import models
from datetime import datetime


app = Flask(__name__)
app.secret_key = "FUCK"

model_manger  = models.Manager()
model_manger.load()


events_data = {
    "2025-02-14": [
        {
            "title": "Valentine's Day Celebration",
            "time": "6:00 PM",
            "description": "Celebrate love and friendship at the annual Valentine's Day event."
        },
    ],
    "2025-02-21": [
        {
            "title": "Tech Conference",
            "time": "9:00 AM",
            "description": "Join the most awaited tech conference of the year!"
        },
    ],
    "2025-03-10": [
        {
            "title": "Team Building Activity",
            "time": "10:00 AM",
            "description": "A fun-filled team-building exercise."
        },
    ],
    "2025-02-10": [
        {
            "title": "Tefuckingtivity",
            "time": "10:00 AM",
            "description": "A fun-filled team-building exercise."
        },
    ],
    "2025-02-11": [
        {
            "title": "Telsdfs;Activity",
            "time": "10:00 AM",
            "description": "A fun-filled team-building exercise."
        },
    ]
}

@app.route('/getcalendar',methods=["POST"])
def get_calender():
    data = request.get_json()
    year = data.get('year')
    month = data.get('month')

    events = {}


    for day in range(1, 32):
        day_str = f"{year}-{str(month).zfill(2)}-{str(day).zfill(2)}"
        if day_str in events_data:
            events[day_str] = events_data[day_str]

    return jsonify(events)

@app.route('/add_comment',methods=["POST"])
def toggle_comment():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        comment_text = data.get('comment')
        username = data.get('username')
        
        if not all([post_id, comment_text, username]):
            return jsonify({"error": "Post ID, comment text, and username are required"}), 400
            
    
        post = next((post for post in model_manger.posts if post.id == post_id), None)
        
        if not post:
            return jsonify({"error": "Post not found"}), 404
            
    
        user =  next((user for user in model_manger.users if user.id == session['userID']), None)

        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        new_comment = Comment()
        new_comment.user = user
        new_comment.text = comment_text
        new_comment.time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        post.comments.append(new_comment)
        
        model_manger.save()
        
        return jsonify({
            "success": True,
            "comment_id": len(post.comments) - 1,  
            "comment": {
                "id": len(post.comments) - 1,
                "user": username,
                "text": comment_text,
                "time": new_comment.time
            }
        }), 200
        
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route('/toggle_like',methods=["POST"])
def toggle_like():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        
        if not post_id:
            return jsonify({"error": "Post ID is required"}), 400
            
        post = next((post for post in model_manger.posts if post.id == post_id), None)
        
        if not post:
            return jsonify({"error": "Post not found"}), 404

        if model_manger.workingUser not in post.likes:
            post.likes.append(model_manger.workingUser)
        else:
            post.likes.remove(model_manger.workingUser)
        
        model_manger.save()
        
        return jsonify({
            "success": True,
            "likes": len(post.likes)
        }), 200
        
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route("/addPost",methods=["GET","POST"])
def add_post():
    if request.method == "GET":
        return render_template('post.html',id=len(model_manger.posts)+1,users=model_manger.users)
    else:
        temp = Post()
        temp.id= request.form['postId']
        temp.user = [us for us in model_manger.users if us.id == int(request.form['user'])][0]
        print(temp.user.id)
        temp.time=request.form['time']
        temp.content = request.form['content']
        temp.likes = request.form['likes']
        temp.comments = []
        temp2 = request.files.getlist('images') 
        for t in temp2:
            temp.images.append(t.filename)
        print(temp.images)

        model_manger.posts.append(temp)
        print(model_manger.posts)
        model_manger.save()
        return  render_template('post.html',id=len(model_manger.posts)+1,users=model_manger.users)
    
@app.route("/",methods=["GET","POST"])
def add_user():
    if request.method == "GET":
        return render_template('index.html',id=len(model_manger.users)+1)
    else:
        temp = User()
        temp.name = request.form['name']
        temp.id =int( request.form['userID'])
        temp.avatar = request.form["photo"]
        model_manger.users.append(temp)
        print(model_manger.users)
        model_manger.save()
        return  render_template('index.html',id=len(model_manger.users)+1)

@app.route("/get_username", methods=["GET"])
def get_username():
    username = request.args.get("username")
    
    if not username:
        return jsonify({"error": "Username is required"}), 400
    session['userID'] = model_manger.users[0].id  
    model_manger.register(model_manger.users[0])
    return jsonify({"username": "Meyan"}), 200

@app.route("/home_feed", methods=["GET"])
def home_feed():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 5))
        print("HE ASKED")
        if page < 1 or limit < 1:
            return jsonify({"error": "Invalid page or limit parameters"}), 400
        
        all_posts = model_manger.posts
        
        start = (page - 1) * limit
        end = start + limit
        
        paginated_posts = all_posts[start:end]
        
        return jsonify({
            "message": "Welcome to the homepage feed!",
            "feed": [{
                "id": post.id,
                'user': {
                    'name': post.user.name,
                    'time': post.time,
                    'avatar': url_for('static', filename="avatar.png", _external=True)
                },
                'content': post.content,
                'isLiked': (True if model_manger.workingUser in post.likes else False),
                "likes": len(post.likes),
                "comments": [
                    {"id": i, "user": j.user.name, "text": j.text,'pfp':url_for('static',filename=j.user.avatar,_external=True)} 
                    for i, j in enumerate(post.comments)
                ],
                'images': [
                    url_for('static', filename=i, _external=True) 
                    for i in post.images
                ]
            } for post in paginated_posts]
        }), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")
