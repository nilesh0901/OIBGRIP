function addItem(event) {
    event.preventDefault();
    let text_inputed = document.getElementById("todo-input")
    db.collection("todo-items").add({
        text: text_inputed.value,
        status: "active"
    })
    text_inputed = "";
}

function getItems() {
    db.collection("todo-items").onSnapshot((snapshot) => {
        console.log(snapshot)
        let items = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id: doc.id,
                ...doc.data()
            })
        });
        generateItems(items);
    })
}


function generateItems(items) {

    let itemsHTML = "";
    items.forEach((item) => {
        console.log(item)
        itemsHTML += `
            <div class="todo-item">
                <div class="check">
                    <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked": ""}" >
                        <img style="height: 12px;" src="img/tick.png" alt="">
                    </div>
                </div>
                <div class="todo-text">
                    ${item.text}
                </div>
            </div>
        `
    })
    document.querySelector(".todo-items").innerHTML = itemsHTML;
    createEventListener();
}

function createEventListener() {
    let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
    todoCheckMarks.forEach((checkMark) => {
        checkMark.addEventListener("click", function() {
            markCompleted(checkMark.dataset.id);
        })
    })
}

function addItem(event) {
    event.preventDefault();
    let text = document.getElementById("todo-input");
    let newItem = db.collection("todo-items").add({
        text: text.value,
        status: "active"
    })
    text.value = "";
}

function markCompleted(id) {
    let item = db.collection("todo-items").doc(id);
    item.get().then(function(doc) {
        if (doc.exists) {
            if (doc.data().status == "active") {
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