# socialnetwork
# jwt 

jwt is a node library for dealing with token

# bcryptjs

bcryptjs is a node library for dealing with password hasing and verification

# express

express is a node library for dealing with http requests, middleware and statis files

# mongoose

mongoose is a node library for dealing with mongodb connection and Schema generation

# cookie-parser

cookie-parser is a node library for dealing with token from cookies (note: Add Interceptor extension in chrome)

# fs

fs filesystem handling create and delete into path directory provided in code... looks like you need to dig a bit how file system are handled

# path

path system to get into connection with file system and your local server

# multer

for dealing with files like png/jpg/jpeg as of now

#

## Installation

Use the package manager package.json for versions

```
npm install bcryptjs jsonwebtoken cookie-parser mongoose multer
npm install -D nodemon --save
 for devdependency
```

## Usage

```node
require(packagename0


# returns registeredUser
api: http://localhost:3000/register

body in JSON format ( postman reference)
{
    "name":"Test1",
    "email":"test1@gmail.com",
    "password":"yourchoice",
    "location":"20 3rd cross rajaji nagar Bengaluru Karnataka"
}

# 400000 msec expiration time for login and register

# stores User with token in tokens and in cookies as well

loginApi: http://localhost:3000/login

#body
{
    "email":"test1@gmail.com",
    "password":"yourchoice"
}
# validates login user with bcrypt.compare

# logout
logoutAPi : http://localhost:3000/logout

# returns avilable near connections 
http://localhost:3000/incircle

# returns allimages
GetAllUsersApi : http://localhost:3000/incircle

# returns add friend
http://localhost:3000/addfriend

#body
{
    "target":"test1@gmail.com"
}

req.params.id for perticular userid
```
