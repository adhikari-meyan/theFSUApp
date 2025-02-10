import json,pickle

class Comment:
    def __init__(self):
        self.user = None
        self.text = None
        self.time = None

class User:
    def __init__(self):
    
        self.id = None
        self.name = None
        self.avatar = None

    def json(self):
        return {"id": self.id, "name": self.name, "avatar": self.avatar}


class Manager():
    def load(self):
        
        with open('database.db','rb') as file1:
            self.users,self.posts = pickle.load(file1)
            print(self.users,self.posts,self.posts[0].images)
    
    def save(self):
        with open('database.db','wb') as file1:
            pickle.dump([self.users,self.posts],file1)
    
    def register(self,user):
        self.workingUser = user
            
     
            

class Post:
    def __init__(self):
        self.id = None
        self.user = None
        self.time = None
        self.content = None
        self.likes = []
        self.comments = []
        self.images = []

    def json(self):
        return {
            "id": self.id,
            "user": self.user.json(),  # Ensure user is serialized
            "time": self.time,
            "content": self.content,
            "likes": self.likes,
            "comments": self.comments,
            "images": self.images,
        }



# Creating user and post objects
if __name__ == "__main__":
    user = User()
    user.id = 1
    user.name = "Meyan"
    user.avatar = "image.png"

    post = Post()
    post.id = 1
    post.user = user 
    post.time = "2025-02-10 12:42:05.898786"
    post.content = "SOME RANDOM SHIT"
    post.likes = []

    cmt1 = Comment()
    cmt1.user = user
    cmt1.text = "NICE GOD"
    cmt1.time= "2025-02-10 12:42:05.898786"

    cmt2 = Comment()
    cmt2.user = user
    cmt2.text = "BLOW GOOD"
    cmt2.time = "BLOW GOOD"

    post.comments = [cmt1,cmt2]
    post.images = ["avatar.png"]

    post2 = Post()
    post2.id = 2
    post2.content="RNADOM"
    post2.user = user
    post2.time = "2025-02-10 12:42:05.898786"
    post2.images = ["avatar.png"]
    post2.comments = []
    post2.lieks = []



    # Saving to JSON file
    with open("database.db", "wb") as file:
        pickle.dump([[user],[post,post2]],file)
        # json.dump([[user.json()],[post.json()]], file, indent=4)  # Convert to JSON and write

    print("Data saved to posts.json successfully!")
