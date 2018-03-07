

var menuId = chrome.contextMenus.create(
    { 
        "title": "Search in GII-GRIN-SCIE (2017)", 
        "contexts": ["selection"],
        "onclick": search
    });


function showResult(conferenceData){
    
    var conferenceTitle = conferenceData.title;
    var conferenceAcronym = conferenceData.acronym;
    
    var conferenceClass = conferenceData.ggs_class;

    var conferenceRating = conferenceData.ggs_rating;
    var conferenceCollectedClasses = conferenceData.collected_classes;

    console.log("conferenceClass: "+conferenceClass);
    chrome.tabs.executeScript(null, {
            code: 'alert("'
                    +"- Conference: "+ conferenceTitle+' ('+conferenceAcronym+')\\n'
                    +"- Class: "+ conferenceClass+'\\n'
                    +"- Rating: "+ conferenceRating+' ('+conferenceCollectedClasses+')\\n'
                    +'");'
    });
}

    
function search(info, tab) {

  var selection = info.selectionText;

  //console.log("info: " + JSON.stringify(info));
  //console.log("tab: " + JSON.stringify(tab));
  console.log("Selected text: '"+selection+"'");
  if(selection){

    var searchUrl ="https://getbridgeapp.co/api/giigrinscie/conferences?title="+selection.toUpperCase();
    //chrome.tabs.create({ url: searchUrl });
        
    var xhr = new XMLHttpRequest();
    
    xhr.open("GET", searchUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log("Title search result: "+xhr.responseText);
            var resp = JSON.parse(xhr.responseText);
            if (resp){
                console.log("Title search result number: "+resp.length);
                if(resp.length > 0){
                  showResult(resp[0]);
                } else {

                    var searchUrl2 ="https://getbridgeapp.co/api/giigrinscie/conferences?acronym="+selection.toUpperCase();
                    var xhr2 = new XMLHttpRequest();
                    
                
                    xhr2.open("GET", searchUrl2, true);
                    
                    xhr2.onreadystatechange = function() {
                        
                        if (xhr2.readyState == 4) {
                            
                            console.log("Acronym search result: "+xhr2.responseText);

                            var resp2 = JSON.parse(xhr2.responseText);
                            if (resp2){
                                console.log("Acronym search result number: "+resp2.length);
                                console.log(resp2);
                                if(resp2.length > 0){
                                    showResult(resp2[0]);
                                } else {
                                    chrome.tabs.executeScript(null, {
                                        code: 'alert("'
                                                    + 'Conference '
                                                    + "\'" + selection + "\'" 
                                                    + ' not found in index");'
                                    });
                                }
                            }
                        }
                    }
                    xhr2.send(); 
                }

            } else {
                    chrome.tabs.executeScript(null, {
                         code: 'alert("Index not avalailable at the moment");'
                    });
            }
        }
    }
    xhr.send(); 
  }

}


console.log("Extension ready");