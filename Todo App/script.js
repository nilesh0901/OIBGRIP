
function getItems(){
    db.collection("todo-items").onSnapshot((snapshot) => {
        let items = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id: doc.id, 
                ...doc.data()
            })
        })
        generateItems(items);
    })
}

function generateItems(items){
    let todoItems = []
    items.forEach((item) => {
        let todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");
        todoItem.setAttribute('data-id',item.id);
        let xx = todoItem.getAttribute('data-id');
        // console.log(xx)
        let checkContainer = document.createElement("div");
        checkContainer.classList.add("check");
        let checkMark = document.createElement("div");
        checkMark.classList.add("check-mark");
        checkMark.innerHTML = '<img src="assets/icon-check.svg">';
        let checkDelete = document.createElement("div");
        checkDelete.classList.add("delete-data");
        checkDelete.innerHTML = '<img width="20" height="20" src="assets/delete.png">';
        checkMark.addEventListener("click", function(){
          markCompleted(item.id);  
        })
        checkContainer.appendChild(checkMark);
        
        checkDelete.addEventListener("click", (e) => {
            // console.log(e.target)
            e.stopPropagation()
            let id1 = e.target.parentElement.parentElement.getAttribute('data-id');
            // console.log(id1);
            db.collection('todo-items').doc(id1).delete();
            console.log("Data Deleted Successfully")
            
        })
        
        let todoText = document.createElement("div");
        todoText.classList.add("todo-text");
        todoText.innerText = item.text;

        x = document.querySelector(".items-left");
        len = items.length
        if (!len){
            x.innerHTML = "0 items left"
        }
        else {
            x.innerHTML = len.toString() +" items left"
        }
        

        if(item.status == "completed"){
            checkMark.classList.add("checked");
            todoText.classList.add("checked");
        }
        todoItem.appendChild(checkContainer);
        todoItem.appendChild(todoText);
        todoItem.appendChild(checkDelete);
        todoItems.push(todoItem)
    })
    document.querySelector(".todo-items").replaceChildren(...todoItems);
}
 

function addItem(event){
    event.preventDefault();
    let text = document.getElementById("todo-input");
    if (text.value != ""){
        let newItem = db.collection("todo-items").add({
        text: text.value,
        status: "active"
        
    })
    }
    else{
        alert("Please Add a task");
    }
    
    text.value = "";
}

function markCompleted(id){
    let item = db.collection("todo-items").doc(id);
    item.get().then(function(doc) {
        if (doc.exists) {
            if(doc.data().status == "active"){
                item.update({
                    status: "completed"
                })
            } else {
                item.update({
                    status: "active"
                })
            }
        }
    })
}

getItems();