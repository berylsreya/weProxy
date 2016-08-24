WeProxy - Get Set Post 
===================
> **Note:**  This is a simple Forward proxy application which in which you can create multiple subdomains for you ease which will target the respective sites you want to target. 

### Building weProxy

1. Git clone the Project.
2. Create database "**node_proxy_server**" and change MySQL credentials in "**development.json**" config file.
3. Import the  "**database.sql**" file in MySQL.
4. Then inside the source folder run the following: ``` npm install```
5. Finally run command: ```node app.js```
