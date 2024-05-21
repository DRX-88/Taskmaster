// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let nextId = JSON.parse(localStorage.getItem("nextId"));

    if (!nextId) {
        nextId = 1;
    } else {
        nextId++;
    }
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskCard = $("<div>").addClass("card draggable").attr("id", task.id);
    let cardBody = $("<div>").addClass("card-body");
    let cardTitle = $("<h5>").addClass("card-title").text(task.title);
    let cardText = $("<p>").addClass("card-text").text(task.description);
    let dueDate = $("<p>").text("Spoils on: " + task.dueDate);
    let deleteButton = $("<button>").addClass("btn btn-danger delete").text("Delete");
    let status = task.status;

    deleteButton.on("click", handleDeleteTask);

    const now = dayjs();
    const doneDate = dayjs(task.dueDate);
    const warningDate = dayjs(task.dueDate).subtract(3, "day");

    if (now.isAfter(warningDate) && status != 'done') {
        taskCard.addClass('bg-warning text-white');
    }

    if (now.isAfter(doneDate) && status != 'done') {
        taskCard.addClass('bg-danger text-white ');
        deleteButton.addClass('border-light');
    }

    cardBody.append(cardTitle, cardText, dueDate, deleteButton);
    taskCard.append(cardBody);

    return taskCard;
}

console.log(taskList);


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let todo = $("#todo-cards");
    let inProgress = $("#in-progress-cards");
    let done = $("#done-cards");

    todo.empty();
    inProgress.empty();
    done.empty();

    for (let i = 0; i < taskList.length; i++) {

        if (taskList[i].status === "to-do") {
            todo.append(createTaskCard(taskList[i]));
        } else if (taskList[i].status === "in-progress") {
            inProgress.append(createTaskCard(taskList[i]));
        } else if (taskList[i].status === "done") {
            done.append(createTaskCard(taskList[i]));
        }
    };



    $('.card').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            return $(this).clone().appendTo('body').show();
        }
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    let task = {
        id: generateTaskId(),
        title: $("#title").val(),
        description: $("#taskDescription").val(),
        dueDate: $("#taskDueDate").val(),
        status: "to-do"
    };

    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(task.id));

    renderTaskList();
    $("#taskForm")[0].reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask() {
    let taskId = $(this).closest(".card").attr("id");
    taskList = taskList.filter((task) => task.id != taskId);

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}
// Todo: create a function to handle dropping a task into a new status lane
    function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("id");
    const newStatus = event.target.id;

    for (let task of taskList) {
        if (task.id == taskId) {
            task.status = newStatus;
        }
    }

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    }
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $("#taskForm").on("submit", handleAddTask);

    $(".lane").droppable({
        accept: ".draggable",
        drop: handleDrop
    });

    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
      });
});


