View this page live at:
http://demo_front.johannesmp.com/



# An example login page for CS261 Assigment 4

To make implementing the login requirement of Assignment 4 a bit easier, you may use this boilerplate http form built with [twitter bootstrap](http://getbootstrap.com/), [jQuery](https://jquery.com/) and a [jQuery validation plugin](https://jqueryvalidation.org/).

If you plan on using it, the files from this repo should be hosted on the root of your loadBalancer instance.

You will want to configure your nginx configuration to accomplish the following:

- `user-name.cs261.net/index.html` should resolve to the `index.html` in this repo.
- `user-name.cs261.net/static/styles.css` should resolve to the `styles.css` file in the `/static/` directory in this repo. All files in `/static/` should be accessible by appending their path to your server's domain.


# To Implement

Once a username and password have been provided, the `Create` and `Login` buttons should query your API and the server's reply should be displayed in the on-screen status panel.

A user should be able to first click 'Create' with an unused username and password, then (if they wish) immediately click 'Login' to receive their session and token (assuming the information they provided was valid).

Finally, upon logging in, the user should be redirected to the game page.


## 1. AJAX API Calls

You only need to modify [`/static/scripts/main.js`](https://github.com/stebee/CS261Assignment2/blob/master/Client/static/scripts/main.js). 

`/index.html`, `/static/scripts/form.js` and `/static/scripts/status.js` don't need to be touched unless you are feeling adventurous.

In main.js:

- The functions [`doCreate(data) {...}`](https://github.com/stebee/CS261Assignment2/blob/master/Client/static/scripts/main.js#L58-L68) and [`doLogin(data){...}`](https://github.com/stebee/CS261Assignment2/blob/master/Client/static/scripts/main.js#L45-L55) are currently called when the user clicks the `Create` or `Submit` button, using the contents of the form. The form is auto-validating to be non-empty. You do not need to validate the input.
- A placeholder [`dummyAPICall`](https://github.com/stebee/CS261Assignment2/blob/master/Client/static/scripts/main.js#L72-L83) function is currently used in `doLogin` and `doCreate`. This should be replaced with a proper jQuery json API call to your server, the reply of which should be displayed in the on-screen status panel.
- See the current usage of `setLoading(msg)` and `setStatus(msg, status)` calls in `dummyAPICall`. Your implementation should exhibit similarly responsive behavior.

Example ajax call:

```javascript
var options = {
    type: 'POST',
    url: '/your/api/path/',
    data: '{"some" : "data"}', // or JSON.stringify ({some : data}),
    contentType: "application/json",
    dataType: 'json'
};

// .done and .fail chain on the ajax call, and both accept callbacks 

$.ajax(options)
// got AJAX reply from server
.done(function(reply) {
    // do something with 'reply' object
})
// AJAX ERROR (like if your url 404's, etc)
.fail(function(error) {
    // do something with 'error' object
});
```
 
 You may want to wrap this call in a helper `APICall` function that populates the options object appropriately and takes the place of the current `dummyAPICall`.
 
See http://api.jquery.com/jquery.ajax/ for documentation on jquery's ajax functionality.
 
 
## 2. Redirect to game
 
Once the user has clicked 'login' with a valid existing username/password, the server will return a session/token. With this token you can then redirect the user to the game page, which should be located at `user-name.cs261.net/Game/`
 
You can redirect the user's browser simply setting the `window.location.href` variable to the `<url>?<querystring>`. So when a user logs in they should be redirected to `https://user-name.cs261.net/Game/?_session=SESSION&_token=TOKEN&id=USERID`, allowing them to play the game.

To verify that the login query was completed successfully, delay the redirection by a few seconds so the server's reply is visible.

For example, you could use [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) to display a countdown before redirecting:

```javascript
// assume 'msg' contains the server's success reply.
// assume 'redirectToGame()' is implemented to update window.location.href appropriately.
// assume 'config.openGameOnLogin' and 'config.openGameDelay' are passed into main via index.html.

if(config.openGameOnLogin) {
  var redirectMsg = msg + "\n\nRedirecting to Game in ";

  var timer = 0;
  if(config.openGameDelay != undefined);
    timer = config.openGameDelay;

  var tickRate = 100; // update every 1/10 of a second
  var countdown = setInterval( function() {
    timer -= tickRate;
    if(timer < 0) {
      clearInterval(countdown);
      redirectToGame();
    } else {
      // setStatus arg3 = true disables buttons during countdown
      setStatus(redirectMsg + (timer/1000) + " seconds", "success", true);
    }
  }, tickRate);
}
```
 

---------

To clarify, here is a gif of the full range of behavior that your login screen should exhibit _(ignoring that this is running on localhost:8080, that the Game page is a placeholder and that the session/token are default values)_:

![](http://i.imgur.com/sE9wiM1.gif)
 
 
