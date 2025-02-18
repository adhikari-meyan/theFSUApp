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
    user.name = "Free Students' Union - Pulchowk Campus, 2079"
    user.avatar = "fsu logo.png"

    post = Post()
    post.id = 1
    post.user = user 
    post.time = "2025-02-10 12:42:05.898786"
    post.content = "Hritik Acharya Memorial Pulhcowk Pride Award 2081"
    post.likes = []

    # cmt1 = Comment()
    # cmt1.user = user
    # cmt1.text = "Yes! I also think that. Oh wait! I am You."
    # cmt1.time= "2025-02-10 12:42:05.898786"

    

    # post.comments = [cmt1]
    post.images = ["post.jpg"]

    # post2 = Post()
    # post2.id = 2
    # post2.content="There is an event happening in pulchowk campus i request all of you guys to join that event as it is very fruitful especially for the first semester students."
    # post2.user = user
    # post2.time = "2025-02-10 12:42:05.898786"
    # post2.images = ["avatar.png"]
    # post2.comments = []
    # post2.likes = []



    # Saving to JSON file
    with open("database.db", "wb") as file:
        pickle.dump([[user],[post]],file)
        # json.dump([[user.json()],[post.json()]], file, indent=4)  # Convert to JSON and write

    print("Data saved to posts.json successfully!")
