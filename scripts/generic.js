function refreshAccountInfoLabel() {
    
    var accountNavigation = document.getElementById("nav-account");

    if (!accountNavigation)
        return;

    if (localStorage.userLoggedIn == "true") {
        if (typeof logoutTabClicked === "function")
            logoutTabClicked();
        accountNavigation.text = "Account (" + localStorage.userName + ")";
        
        exponea.identify(
            {
              'registered':localStorage.userName.toLowerCase().trim()
            },
            {
              'email':localStorage.userName.toLowerCase().trim(),
            },
            function(){
              //successCallback
            },
            function(){
              //errorrCallback
            },
            true
          );

    }
    else {
        if (typeof loginTabClicked === "function")
            loginTabClicked();
        accountNavigation.text = "Account";
    }
   
}