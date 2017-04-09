# CS261 Example project

_See http://demo_front.johannesmp.com/ for a demo of the code in this repo running._


This repo demonstrates what your CS261 Project might look like.

- The `Client` directory is intended to be hosted statically on your nginx load balancer
- The `Server` directory is intended to be run on your node instance

You are welcome to emulate this structure in your own repo, or create two separate repositories.

For assignment 4 you will need to make changes to both the Client and the Server.


--------------------------

The provided [cs261_nginx_example.conf](https://github.com/stebee/CS261Assignment2/blob/master/cs261_nginx_example.conf) file is correctly configured to meet all the required requests.

For clarification, here is how the repo and app requests are structured, and how requests are expected to be handled.

## File Structure

- **`/Client/`** - All static files that need to be hosted on your loadbalancer
- `/Client/`**`index.html`** - the login dialog
   - See [`/Client/README.md`](https://github.com/stebee/CS261Assignment2/blob/master/Client/README.md) for what you are required to implement
- `/Client/`**`Game/index.html`** - the game view
   - It loads scripts from `/Client/Game/scripts`
   
- **`/Server/`** - All node files that should be hosted on your node app
   - See [`/Server/README.md`](https://github.com/stebee/CS261Assignment2/blob/master/Client/README.md) for more info



## Request Structure

- `<Domain>`**`/`** and `<Domain>`**`/index.html`** - The server root. Should statically host the login dialog directory (`/Client/`), hosted on your nginx machine. The `index.html` is implied when accessing with only `<Domain>/`.
   - Use the nginx `root` directive to redirect requests on a given location to a given folder on your drive, in this case the Client folder of your repo.

- `<Domain>`**`/Game/`** and `<Domain>`**`/Game/`** - Should statically host the game.

- `<Domain>`**`/api/v1/...`** - The api route. Should be redirected by nginx to your App server. 
   - For example if your appserver is running on port 7000, `<Domain>/api/v1/users/create` should be redirected to `YOUR.APP.SERVER.IP:7000/users/create`.
   - Use the nginx 'rewrite' directive. [see example here](https://github.com/stebee/CS261Assignment2/blob/master/cs261_nginx_example.conf#L45).

- `<Domain>`**`:9009/net/v1/`** - The websocket route. All data for the live multiplayer game is sent over this.
   - Port 9009 is used to prevent websocket from going over HTTPS (port 443) which can cause problems
   - For example if your appserver is running on port 7000 `<Domain>:9009/net/v1/` should be redirected to `YOUR.APP.SERVER.IP:7000/` and should be handled by [`gameserver.js`](https://github.com/stebee/CS261Assignment2/blob/master/Server/routes/gameserver.js)
   - Use the nginx 'rewrite' directive. [see example here](https://github.com/stebee/CS261Assignment2/blob/master/cs261_nginx_example.conf#L88).
