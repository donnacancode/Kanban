// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  if (!nextId) {
    nextId = 1;
  }
  return nextId++;
}
function saveNextIdsToStorage(nextId) {
  localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  let element = document.getElementById("project-form");
  let newCard = `<div class="card text-white bg-success mb-3" style="max-width: 18rem;">
     <div class="card-header">Header</div>
     <div class="card-body">
     <h5 class="card-title">${task.taskName}</h5>
     <h6 class="card-subtitle mb-2 text-muted">${task.taskDueDate}</h6>
     <p class="card-text">${task.description}</p>
     </div>`;
  element.innerHTML += newCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  let taskList = JSON.parse(localStorage.getItem("tasks"));

  if (Array.isArray(taskList)) {
    taskList.forEach((task) => {
      `<div class="card text-white bg-success mb-3" style="max-width: 18rem;">
     <div class="card-header">Header</div>
     <div class="card-body">
     <h5 class="card-title">${task.taskName}</h5>
     <h6 class="card-subtitle mb-2 text-muted">${task.taskDueDate}</h6>
     <p class="card-text">${task.description}</p>
     </div>`;
    });

    $(".card").draggable({
      revert: true, // Card will revert back to its original position if not dropped in a droppable area
      zIndex: 100, // Ensure the card appears on top when dragged
      containment: ".container", // Limit dragging within the container
      start: function (event, ui) {
        // Code to execute when dragging starts
      },
      stop: function (event, ui) {
        // Code to execute when dragging stops
      },
    });
  }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  // Retrieve input values from form fields
  let taskName = document.getElementById("task-name-input").value;
  let taskDueDate = document.getElementById("taskDueDate").value;
  let description = document.getElementById("description").value;

  // Generate a unique task ID
  let taskId = generateTaskId();

  // Create a new task object
  let newTask = {
    id: taskId,
    taskName: taskName,
    taskDueDate: taskDueDate,
    description: description,
    status: "todo", // Assuming new tasks are added to the "todo" lane by default
  };

  // Retrieve existing task list from localStorage or initialize an empty array
  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

  // Add the new task to the task list
  taskList.push(newTask);

  // Save the updated task list to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Optionally, clear the form fields or reset the form
  document.getElementById("project-form").reset();

  // Optionally, update the displayed task list
  renderTaskList();
}
// Add event listener to form submission
document
  .getElementById("project-form")
  .addEventListener("submit", handleAddTask);

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  event.preventDefault(); // Prevent default form submission behavior if applicable

  // Extract task ID from the event object
  let taskId = event.target.dataset.taskId;

  // Retrieve existing task list from localStorage
  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

  // Find index of the task with the given ID
  let taskIndex = taskList.findIndex((task) => task.id === taskId);

  // Check if the task exists in the list
  if (taskIndex !== -1) {
    // Remove the task from the task list
    taskList.splice(taskIndex, 1);

    // Update the task list in localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Optionally, update the displayed task list
    renderTaskList();
  } else {
    console.error("Task not found with ID:", taskId);
  }
  y;
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {});
