const taskList = document.getElementById("taskList");
const addTaskInput = document.getElementById("addTask");
const addTaskBtn = document.getElementById("addTaskBtn");

function saveTask() {
  localStorage.setItem("data", taskList.innerHTML);
}

function loadTask() {
  taskList.innerHTML = localStorage.getItem("data");
  initializeDraggability();
}

loadTask();

function addFunctionality(image, deletebtn, listItem) {
  image.addEventListener("click", () => {
    if (image.src === "http://localhost:5174/assets/unchecked.png") {
      image.src = "http://localhost:5174/assets/checked.png";
      listItem.classList.add("line-through");
    } else {
      image.src = "http://localhost:5174/assets/unchecked.png";
      listItem.classList.remove("line-through");
    }
    saveTask();
  });

  deletebtn.addEventListener("click", () => {
    taskList.removeChild(listItem);
    saveTask();
  });
}

function initializeDraggability() {
  const draggables = document.querySelectorAll(".draggable");

  function getDragAfterElement(y) {
    const draggableElements = [
      ...document.querySelectorAll(".draggable:not(.dragging)"),
    ];

    const targetElement = draggableElements.reduce(
      (closest, li) => {
        const position = li.getBoundingClientRect();
        const midPoint = position.top - position.height / 2;
        const verticalDistance = y - position.height - midPoint;
        // console.log(verticalDistance, y , position.height , midPoint , li.querySelector('span'))
        //Y is the position where our cursor is currently
        //Midpoint is the midpoint of the list item or that container that is holding the text
        //vertical distance is the distance between the cursor and midpoint of the list item
        if (
          verticalDistance < 0 &&
          verticalDistance > closest.verticalDistance
        ) {
          return { verticalDistance: verticalDistance, element: li };
        } else {
          return closest;
        }
      },
      { verticalDistance: Number.NEGATIVE_INFINITY }
    ).element;

    const draggedElement = document.querySelector(".dragging");

    return [draggedElement, targetElement];
  }

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });

    draggable.addEventListener("dragover", (e) => {
      e.preventDefault();
      const [draggedElement, targetElement] = getDragAfterElement(e.clientY);
      taskList.insertBefore(draggedElement, targetElement);
    });
  });
}

function addTask() {
  const task = addTaskInput.value.trim();
  if (addTaskInput.value !== "") {
    const listItem = document.createElement("li");
    listItem.classList.add(
      "flex",
      "items-center",
      "gap-2",
      "p-2",
      "border-b",
      "border-grey-200",
      "draggable"
    );
    listItem.draggable = true;

    const image = document.createElement("img");
    image.src = "assets/unchecked.png";
    image.classList.add("w-5", "h-5", "cursor-pointer");

    const textContent = document.createElement("span");
    textContent.innerHTML = task;
    textContent.classList.add("p-2");

    const deletebtn = document.createElement("button");
    deletebtn.innerHTML = "X";
    deletebtn.classList.add("text-orange-500", "absolute", "p-5", "right-5");

    listItem.append(image);
    listItem.append(textContent);
    listItem.append(deletebtn);
    taskList.append(listItem);

    addFunctionality(image, deletebtn, listItem);
    initializeDraggability();

    addTaskInput.value = "";
    saveTask();
  }
}

addTaskBtn.addEventListener("click", () => {
  addTask();
});

addTaskInput.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    addTask();
  }
});

if (localStorage.getItem("data")) {
  const listItems = document.querySelectorAll("li");
  listItems.forEach((listItem) => {
    const image = listItem.querySelector("img");
    const deletebtn = listItem.querySelector("button");
    addFunctionality(image, deletebtn, listItem);
  });
}
