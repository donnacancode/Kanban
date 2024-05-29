$(document).ready(function () {
  console.log("Document is ready");
  const timeDisplay = $("#time-display");
  const formModal = new bootstrap.Modal(document.getElementById("form-modal"));
  const taskForm = $("#task-form");
  const taskNameInput = $("#task-name-input");
  const taskDueDate = $("#task-due-date");
  const taskDescription = $("#task-description");

  // Display the time
  function displayTime() {
    const thisMinute = dayjs().format("MMM DD, YYYY [at] hh:mm a");
    timeDisplay.text(thisMinute);
  }

  function saveTasksToStorage(tasks) {
    console.log("Saving tasks to storage:", tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Retrieve tasks and nextId from localStorage
  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

  console.log("Retrieved task list from storage:", taskList);
  console.log("Next task ID:", nextId);

  // Generate a unique task id
  function generateTaskId() {
    nextId += 1;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
  }

  // Create a task card
  function createTaskCard(task) {
    console.log("Creating task card for task:", task);
    const projectCard = $("<div>")
      .addClass("card task-card draggable my-3")
      .attr("data-task-id", task.id);

    const cardHeader = $("<div>").addClass("card-header h4").text(task.title);
    const cardBody = $("<div>").addClass("card-body");
    const cardDescription = $("<div>")
      .addClass("card-text")
      .text(task.description);
    const cardDueDate = $("<p>").addClass("card-text").text(task.deadline);
    const cardDeleteBtn = $("<button>")
      .addClass("btn btn-danger delete")
      .text("Delete")
      .attr("data-task-id", task.id)
      .on("click", handleDeleteTask);
    // sets card color based on deadline date
    if (task.deadline && task.progress !== "done") {
      const now = dayjs();
      const deadlineDate = dayjs(task.deadline, "DD/MM/YYYY");

      if (now.isSame(deadlineDate, "day")) {
        projectCard.addClass("bg-warning text-white");
      } else if (now.isAfter(deadlineDate)) {
        projectCard.addClass("bg-danger text-white");
        cardDeleteBtn.addClass("border-light");
      }
    }

    projectCard.append(
      cardHeader,
      cardBody.append(cardDescription, cardDueDate),
      cardDeleteBtn
    );
    return projectCard;
  }

  // Render the task list and make cards draggable
  function renderTaskList() {
    console.log("Rendering task list", taskList);
    // Clear existing tasks
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();

    // Render each task
    taskList.forEach((task) => {
      //     createTaskCard(task);
      // Append the projectCard to the correct container based on the task's progress
      if (task.progress === "to-do") {
        $("#todo-cards").append(createTaskCard(task));
      } else if (task.progress === "in-progress") {
        $("#in-progress-cards").append(createTaskCard(task));
      } else if (task.progress === "done") {
        $("#done-cards").append(createTaskCard(task));
      }
    });

    // Make cards draggable
    $(".draggable").draggable({
      opacity: 0.7,
      zIndex: 100,
      helper: function (e) {
        const original = $(e.target).hasClass("ui-draggable")
          ? $(e.target)
          : $(e.target).closest(".ui-draggable");
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
  }

  // Handle adding a new task
  function handleAddTask(event) {
    event.preventDefault();
    console.log("Adding new task");
    const newTask = {
      id: generateTaskId(),
      title: taskNameInput.val(),
      description: taskDescription.val(),
      deadline: taskDueDate.val(),
      progress: "to-do",
    };

    taskList.push(newTask);
    console.log("Updated task list:", taskList);

    saveTasksToStorage(taskList);

    createTaskCard(newTask);

    // Clear form inputs
    taskNameInput.val("");
    taskDescription.val("");
    taskDueDate.val("");
    formModal.hide();

    renderTaskList();
  }

  // Handle deleting a task
  function handleDeleteTask(event) {
    console.log("Deleting task");
    const taskId = $(event.target).attr("data-task-id");
    taskList = taskList.filter((task) => task.id !== parseInt(taskId));
    saveTasksToStorage(taskList);
    $(event.target).closest(".task-card").remove();
  }

  // Handle dropping a task into a new status lane
  function handleDrop(event, ui) {
    console.log("Dropping task");
    const taskId = ui.draggable.attr("data-task-id");
    const newProgress = $(event.target).closest(".lane").attr("id");
    const task = taskList.find((task) => task.id === parseInt(taskId));

    // Update task progress
    task.progress = newProgress;
    saveTasksToStorage(taskList);

    // Move the task card to the new container
    // ui.draggable.appendTo($(event.target).find(".card-body"));
    renderTaskList();
  }

  // Initialize Date Picker
  $("#task-due-date").datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // Make lanes droppable
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });

  // Bind the form submission event to handleAddTask
  taskForm.on("submit", handleAddTask);

  // Display the time initially and update every minute
  displayTime();
  setInterval(displayTime, 60000);

  // Render the task list initially
  renderTaskList();
});
