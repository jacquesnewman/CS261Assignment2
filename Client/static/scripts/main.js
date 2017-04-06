// CS261 Student: you'll want to modify doLogin and doCreate and replace dummyApiCalls

define(function(require) {
  // main
  return function(config) {
    // Feel free to use config to pass in variables used in your API calls

    // Include form and status module
    requirejs(["./static/scripts/form.js", "./static/scripts/status.js"], function(form, status) {
      // let the status UI know about the form UI
      status.registerForm(form);

      // Register our callback so when a form button is pressed we get the data to use in API calls
      form.onFormButton(formCallback);

      // Give us access to setLoading and setStatus
      setLoading = status.setLoading;
      setStatus  = status.setStatus;
    });

    // Called when the user clicks a form button. formData contains username and password
    var formCallback = function(formAction, formData) { 
      // When user clicks 'Create' button  
      if(formAction == "create")
        doCreate(formData);

      // When user clicks 'Login' button
      else if(formAction == 'login')
        doLogin(formData);
    }


    // Function: show status message while loading
    //    arg1: loading message string
    var setLoading;

    // Function: show status message when done
    //    arg1: status message string
    //    arg2: status visual class. You have these options: ["active", "success", "danger", "warning"]
    //       they correspond to the classes set in styles.css for the #reply-content element
    var setStatus;


    // TODO: Wrapper for login API call
    function doLogin(data) {
      // Make a call to API with a callback on success
      dummyAPICall("login_api_path", data, function(ret) {

        // Example if API call returned success
        ret.demo_status = "success";
        
        // We update status panel to show success
        setStatus(ret, 'success');
      });
    }

    // TODO: Wrapper for create API call
    function doCreate(data) {
      // Make a call to API, with a callback on success
      dummyAPICall("create_api_path", data, function(ret) {

        // Example if API call returned error
        ret.demo_status = "error";

        // We update status panel to show problem
        setStatus(ret, 'danger');
      });
    }


    // TODO: replace with actual API call function that calls $.ajax(options)
    function dummyAPICall(path, data, callback) {
      // Set status to 'loading' while we wait
      setLoading("Pretending to wait for API Call...");

      // A fake callback. This should be your jQuery ajax call instead
      setTimeout( function() {
        callback( {
          demo_data : data,
          demo_return : 'returned by demo path: ' + path
        });
      }, 2000);
    }
  };
});
