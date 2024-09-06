//start fresh form validation
function validateForm(){
    event.preventDefault();
    var x = document.forms["helloForm"]["name"].value;
    var date=document.forms["helloForm"]["date"].value;
    //check if the user put correct input
    if (x == "" || date=="") {
        if(date=="")
        {
            alert("Please select if you want to use the current date.");
            return false;
        }
        if (x == "")
        {
            alert("I need to know your name so I can say Hello");
            return false;
        }
    }
    else if(date==="yes")
    {//user is using current date
        day=currentDate.getDate();
        month=currentDate.getMonth()+1;
        //calculate previous day and month
        if(day===1)
        {
            previousDay=31;
            previousMonth=month-1;
        }
        else
        {
            previousDay=day-1;
            previousMonth=month;
        }
    }
    else{
        alert("Hello there " + document.forms["helloForm"]["name"].value );
    }
    localStorage.clear();
    localStorage.setItem("username", x);
    playerName=x;
    localStorage.setItem("date",date);
    let form = document.forms["helloForm"];
    form.style.display = "none";
    gameState="Intro";
    save=true;//start saving data
    //change screen state
    if(mobile)
    {
        inputTouch();
    }
    else
    {
        inputClick();
    }
}

//if there exits data
if(typeof(Storage) !== "undefined") {
    // console.log("Local storage is supported.");
    const username = localStorage.getItem('username');
    const date=localStorage.getItem('date');
    const shot=localStorage.getItem('shots');
    if (username){
        let form = document.forms["helloForm"];
        form.style.display = "none";
        let modal = document.getElementById("modal");
        let modalContent = modal.children[0].children[2];
        modal.style.display = "block";
        //message to the screen
        if(date==="yes")
        {
            const day=localStorage.getItem('previousDay');
            const month=localStorage.getItem('previousMonth');
            modalContent.innerHTML = "Hello " + username + "<br>you remembered the night of the "+day+"/"+month+" until you had "+shot+" shots";
        }
        else 
        {
            modalContent.innerHTML = "Hello " + username + "<br>you remembered the night until you had "+shot+" shots";
        }
        
        let validateButton = document.getElementsByClassName("saved-data-accept")[0]; //continue
        let dismissButton = document.getElementsByClassName("saved-data-refusal")[0]; //start fresh
        validateButton.onclick = function(){
            modal.style.display = "none";
            canvas.style.display="block";
            restoredData();
            if(mobile)
            {
                inputTouch();
            }
            else
            {
                inputClick();
            }
            //console.log("player x: "+player.x);
        }
        dismissButton.onclick = function(){
            modal.style.display = "none";
            form.style.display = "block";
            
            localStorage.clear();
        }
    }
    else{
        console.log("no data in localStorage, loading new session")
    }
  } else {
    console.log("Local storage is not supported.");
    // The condition isn't met, meaning local storage isn't supported
  }
  
