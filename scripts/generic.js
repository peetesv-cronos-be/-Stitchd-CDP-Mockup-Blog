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

        updateIdentity(localStorage.userName.toLowerCase().trim());

    }
    else {
        if (typeof loginTabClicked === "function")
            loginTabClicked();
        accountNavigation.text = "Account";

        updateIdentity();

    }
   
}

async function updateIdentity(email) {

    if (idtypeList.length == 0)
        await refreshIdList();

    var returnObject = await sendIdentityUpdate(email);

    if (returnObject && returnObject.Success) {

        setCookie("__StitchdId__",returnObject.HardId);

    }


}

async function sendIdentityUpdate(email) {

    var hardid = getCookieByName("__StitchdId__");

    var updateBody = {};
    updateBody.Operation = "Update";
    if (hardid)
        updateBody.HardId = hardid;
    if (email)
        updateBody.Email = email;

    updateBody.IdList = [];

    for (let index = 0; index < idtypeList.length; index++) {
        const idtype = idtypeList[index];

        var cookieValue = getCookieByName(idtype.id_type_cookie_name);
        
        if (cookieValue) {
            updateBody.IdList.push({
                IdType: idtype.id_type_id,
                Value: cookieValue
            });
        }
        
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(updateBody);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    idtypeList = [];

   var response = await fetch("https://id_resolution_worker.sven-peeters.workers.dev/", requestOptions)
   return await response.json();

}

async function refreshIdList() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "Operation": "getidlist"
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    idtypeList = [];

   var response = await fetch("https://id_resolution_worker.sven-peeters.workers.dev/", requestOptions)
   var responseJSON =await response.json();

    if (responseJSON && responseJSON.QueryResult && responseJSON.QueryResult.length > 0)
    {
        responseJSON.QueryResult.forEach(typeId => {
            idtypeList.push(typeId);
        });
    }
}

function getCookieByName(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name,value) {
    document.cookie = name + "=" + value; 
}