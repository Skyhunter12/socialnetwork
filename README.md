# socialnetwork
# jwt 

jwt is a node library for dealing with token

# bcryptjs

bcryptjs is a node library for dealing with password hasing and verification

# express

express is a node library for dealing with http requests

# mongoose

mongoose is a node library for dealing with mongodb connection and Schema generation

# cookie-parser

cookie-parser is a node library for dealing with token from cookies (note: Add Interceptor extension in chrome)

# multer

multer is node package for dealing with media files.
supported filetypes : .png, .jpg/jpeg, .gif, .mp4, .ogg, .wmv, .x-flv, .avi, .webm, .mkv, .avchd, .mov

# cors

cors to deal with cross origin requests
 
#dotnev
to setup your private data and bind it with secretkeys of your own

#node-geocoder

to config addresses to environment of your specification  

#validator
for validating user email

#express-calidator 

for validating req.body data 

## Installation

Use the package manager package.json for versions

```
npm install bcryptjs jsonwebtoken cookie-parser mongoose node-geocoder multer validator express-validator validator

npm install -D nodemon --save
 for devdependency

```

## Usage

```node
require(packagename)


# register an User
api: http://localhost:3000/register

body in JSON format ( postman reference)
{
    "name":"Test1",
    "email":"test1@gmail.com",
    "password":"your choice",
    "address":"Thomas-Mann-Straße 38, 53111 Bonn"
}
#400000 msec expiration time for login and register

#stores User with token in tokens and in cookies as well

loginApi: http://localhost:3000/login

#validates login user with bcrypt.compare

body in JSON format ( postman reference)
{
    "email":"test11@gmail.com",
    "password":"test1234"
}

#getgeolocated friends
http://localhost:3000/incircle

#follow a friend
http://localhost:3000/follow

body json data (postman reference)
{
	"target":"target@gmail.com"
}

#logout 
logoutAPi : http://localhost:3000/logout

#addmedia
form-data ( postman reference)
{
    "mediaUrl": add file,
    "mediaTitle":"name of image"
}

#getallmedia
GetAllmediasApi : http://localhost:3000/allmedia

#allmediaforuser
GetAllmediasApi for user: http://localhost:3000/allmedia/user

#likemedia
http://localhost:3000/media/like/:id

req.params.id for perticular userid

#unlikemedia
http://localhost:3000/media/unlike/:id

#commentonpost
http://localhost:3000/media/comment/:id
bodyjsonformat (postman reference)
{
 "text":"comment goes here"
}

#deletecomment
http://localhost:3000/media/comment/:id/:comment_id

```
