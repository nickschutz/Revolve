document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginform");
    const errorMessage = document.getElementById("error-message");

    // Hardcoded credentials for example
    const validUsername = "user"; // Change to your preferred username
    const validPassword = "password"; // Change to your preferred password

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission by default

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // Validate credentials
            if (username === validUsername && password === validPassword) {
                localStorage.setItem("loggedIn", "true"); // Save login state
                window.location.href = "dashboard.html"; // Redirect to dashboard
            } else {
                errorMessage.textContent = "Invalid username or password";
            }
        });
    }
    const warningElement = document.getElementById('storage-warning');
    
    // Function to show the storage warning
    function showStorageWarning() {
        warningElement.style.display = 'block'; // Show the warning
    }
    
    // Show the warning when the page loads
    showStorageWarning(); // Automatically show when the page loads


    const helpButton = document.getElementById("help-button");
    const helpModal = document.getElementById("help-modal");
    const closeModal = document.getElementById("close-modal");

    // Show the modal when help button is clicked
    if (helpButton) {
        helpButton.addEventListener("click", function () {
            helpModal.classList.remove("hidden"); // Remove the 'hidden' class to show the modal
        });
    }

    // Close the modal when the close button is clicked
    if (closeModal) {
        closeModal.addEventListener("click", function () {
            helpModal.classList.add("hidden"); // Add the 'hidden' class to hide the modal
        });
    }

    // Optional: Close modal if user clicks outside the modal content
    if (helpModal) {
        window.addEventListener("click", function (event) {
            if (event.target === helpModal) {
                helpModal.classList.add("hidden"); // Hide the modal if clicked outside
            }
        });
    }

    // Dashboard & Board Management
    const createBoardButton = document.getElementById("create-board-button");
    const boardsContainer = document.getElementById("boards-container");
    const settingsContainer = document.getElementById("settings-container");
    const fullBoardView = document.querySelector(".full-board-view");
    const backButton = document.getElementById("back-button");
    const boardTitleElement = document.getElementById("board-title");
    const boardContainer = document.getElementById("board-container");

    // Load boards from localStorage
    function loadBoards() {
        boardsContainer.innerHTML = ""; // Clear any existing boards
        const savedBoards = JSON.parse(localStorage.getItem("boardsData")) || [];
        savedBoards.forEach(boardData => {
            displayBoardSummary(boardData);
        });
    }

    // Display each board with a delete button
    function displayBoardSummary(boardData) {
        const newBoard = document.createElement("div");
        newBoard.className = "board";
        newBoard.innerText = boardData.title;
        newBoard.dataset.boardInfo = JSON.stringify(boardData);

        // Add delete button to each board
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-board-button");
        deleteButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent opening the board on delete click
            deleteBoard(newBoard);
        });

        newBoard.appendChild(deleteButton);
        boardsContainer.appendChild(newBoard);

        // Show settings panel for customization when a new board is created
        newBoard.addEventListener("click", function () {
            showSettingsPanel(newBoard);
        });
    }

    // Show settings panel for board customization
    function showSettingsPanel(board) {
        settingsContainer.classList.remove("hidden");
        settingsContainer.innerHTML = "";

        const boardData = JSON.parse(board.dataset.boardInfo);

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Enter board name";
        nameInput.value = boardData.title;

        nameInput.addEventListener("input", function () {
            board.innerText = nameInput.value;
            boardData.title = nameInput.value;
            board.dataset.boardInfo = JSON.stringify(boardData);
            saveBoardsToLocalStorage();
        });

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = boardData.color;

        colorInput.addEventListener("input", function () {
            board.style.backgroundColor = colorInput.value;
            boardData.color = colorInput.value;
            board.dataset.boardInfo = JSON.stringify(boardData);
            saveBoardsToLocalStorage();
        });

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Board";
        saveButton.addEventListener("click", function () {
            hideSettingsPanel();
        });

        settingsContainer.appendChild(nameInput);
        settingsContainer.appendChild(colorInput);
        settingsContainer.appendChild(saveButton);
    }

    // Hide settings panel
    function hideSettingsPanel() {
        settingsContainer.classList.add("hidden");
    }

    // Create a new board
    function createBoard() {
        const newBoard = document.createElement("div");
        newBoard.className = "board";
        newBoard.innerText = "New Board";

        const boardData = {
            title: newBoard.innerText,
            color: "#ffffff",
            lists: [
                { title: "To Do", tasks: [] },
                { title: "In Progress", tasks: [] },
                { title: "Done", tasks: [] }
            ]
        };

        newBoard.dataset.boardInfo = JSON.stringify(boardData);

        // Create and add the delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-board-button");
        deleteButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent board selection on delete click
            deleteBoard(newBoard);
        });

        newBoard.appendChild(deleteButton);
        boardsContainer.appendChild(newBoard);

        // Show the settings panel for customization of the new board
        showSettingsPanel(newBoard);
        saveBoardsToLocalStorage();
    }

    // Delete a board from UI and localStorage
    function deleteBoard(board) {
        const confirmDel = confirm("Are you sure you would like to delete this board?");
        if (confirmDel) {
            board.remove(); // Remove from UI
            saveBoardsToLocalStorage(); // Update localStorage
        }
    }

    // Save all boards to localStorage
    function saveBoardsToLocalStorage() {
        const allBoards = [];
        document.querySelectorAll(".board").forEach(board => {
            allBoards.push(JSON.parse(board.dataset.boardInfo));
        });
        localStorage.setItem("boardsData", JSON.stringify(allBoards));
    }

    if (createBoardButton) {
        createBoardButton.addEventListener("click", createBoard);
    }

    // Show the board in full view when clicked
    if (boardsContainer) {
        boardsContainer.addEventListener("click", function (event) {
            if (event.target.classList.contains("board")) {
                const boardData = JSON.parse(event.target.dataset.boardInfo);
                fullBoardView.classList.remove("hidden");
                boardTitleElement.innerText = boardData.title;
                fullBoardView.style.backgroundColor = boardData.color;

                document.querySelector(".dashboard-container").classList.add("hidden");
                displayBoard(boardData, event.target);
            }
        });
    }

    function displayBoard(boardData, boardElement) {
        boardContainer.innerHTML = "";
        boardData.lists.forEach((list) => {
            createList(boardData, list, boardElement);
        });
    }

    function createList(boardData, list, boardElement) {
        const listContainer = document.createElement("div");
        listContainer.className = "list-container";

        const listTitle = document.createElement("h3");
        listTitle.innerText = list.title;
        listContainer.appendChild(listTitle);

        const addTaskButton = document.createElement("button");
        addTaskButton.textContent = "Add Task";
        addTaskButton.classList.add("add-task-button");
        addTaskButton.addEventListener("click", function () {
            addTask(listContainer, boardData, list, boardElement);
        });

        listContainer.appendChild(addTaskButton);

        list.tasks.forEach(task => {
            addTask(listContainer, boardData, list, boardElement, task);
        });

        boardContainer.appendChild(listContainer);
    }

    function addTask(listContainer, boardData, list, boardElement, existingTask = "") {
        const taskContainer = document.createElement("div");
        taskContainer.className = "task-container";

        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.placeholder = "Task Description";
        taskInput.value = existingTask;

        taskInput.addEventListener("blur", function () {
            const taskIndex = list.tasks.indexOf(existingTask);
            if (taskIndex !== -1) {
                list.tasks[taskIndex] = taskInput.value;
            } else if (taskInput.value.trim() !== "") {
                list.tasks.push(taskInput.value);
            }
            boardElement.dataset.boardInfo = JSON.stringify(boardData);
            saveBoardsToLocalStorage();
        });

        taskContainer.appendChild(taskInput);
        listContainer.appendChild(taskContainer);
    }

    let draggedTask = null;
    let originList = null;

    function addTask(listContainer, boardData, list, boardElement, existingTask = "") {
        const taskContainer = document.createElement("div");
        taskContainer.className = "task-container";
        taskContainer.draggable = true; // Make task draggable

        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.placeholder = "Task Description";
        taskInput.value = existingTask;

        // Add drag event listeners to the task container
        taskContainer.addEventListener("dragstart", function(event) {
            handleDragStart(event, list);
        });
        taskContainer.addEventListener("dragend", handleDragEnd);

        taskInput.addEventListener("blur", function () {
            const taskIndex = list.tasks.indexOf(existingTask);
            if (taskIndex !== -1) {
                list.tasks[taskIndex] = taskInput.value;
            } else if (taskInput.value.trim() !== "") {
                list.tasks.push(taskInput.value);
            }
            boardElement.dataset.boardInfo = JSON.stringify(boardData);
            saveBoardsToLocalStorage();
        });

        taskContainer.appendChild(taskInput);
        listContainer.appendChild(taskContainer);
    }

    function handleDragStart(event, list) {
        draggedTask = event.target;
        originList = list; // Keep track of the list the task is being dragged from
        event.target.classList.add("dragging");
    }

    function handleDragEnd(event) {
        event.target.classList.remove("dragging");
        draggedTask = null;
        originList = null;
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event, targetList) {
        event.preventDefault();
        if (draggedTask && originList !== targetList) { // Ensure we're moving to a new list
            const taskText = draggedTask.querySelector("input").value;

            // Remove task from the origin list
            const taskIndex = originList.tasks.indexOf(taskText);
            if (taskIndex > -1) {
                originList.tasks.splice(taskIndex, 1);
            }

            // Add task to the target list
            targetList.tasks.push(taskText);

            // Update local storage
            saveBoardsToLocalStorage();

            // Append the dragged task to the new list in the DOM
            event.target.appendChild(draggedTask);
        }
    }

    // Modify createList to set up the event listeners for drag-and-drop
    function createList(boardData, list, boardElement) {
        const listContainer = document.createElement("div");
        listContainer.className = "list-container";

        const listTitle = document.createElement("h3");
        listTitle.innerText = list.title;
        listContainer.appendChild(listTitle);

        const addTaskButton = document.createElement("button");
        addTaskButton.textContent = "Add Task";
        addTaskButton.classList.add("add-task-button");
        addTaskButton.addEventListener("click", function () {
            addTask(listContainer, boardData, list, boardElement);
        });

        listContainer.appendChild(addTaskButton);

        list.tasks.forEach(task => {
            addTask(listContainer, boardData, list, boardElement, task);
        });

        listContainer.addEventListener("dragover", handleDragOver);
        listContainer.addEventListener("drop", (event) => handleDrop(event, list));

        boardContainer.appendChild(listContainer);
    }
    if (backButton) {
        backButton.addEventListener("click", function () {
            saveBoardsToLocalStorage();
            fullBoardView.classList.add("hidden");
            document.querySelector(".dashboard-container").classList.remove("hidden");
            loadBoards(); // Reload boards to ensure delete buttons appear
        });
    }

    loadBoards(); // Load existing boards on page load
});
