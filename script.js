/* =========================
   POMODORO TIMER
========================= */

let timerMinutes = 25;
let timerSeconds = 0;
let timerInterval = null;
let timerRunning = false;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const timerStatus = document.getElementById("timerStatus");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");


function updateTimerDisplay() {
    minutesDisplay.textContent = String(timerMinutes).padStart(2, "0");
    secondsDisplay.textContent = String(timerSeconds).padStart(2, "0");
}


function startTimer() {

    if (timerRunning) {
        return;
    }

    timerRunning = true;

    timerStatus.textContent = "Focusing";

    timerInterval = setInterval(() => {

        if (timerSeconds === 0) {

            if (timerMinutes === 0) {

                clearInterval(timerInterval);

                timerRunning = false;

                timerStatus.textContent = "Complete";

                alert("Focus session complete. Take a short break.");

                return;
            }

            timerMinutes--;
            timerSeconds = 59;

        } else {

            timerSeconds--;

        }

        updateTimerDisplay();

    }, 1000);
}


function pauseTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    timerStatus.textContent = "Paused";
}


function resetTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    timerMinutes = 25;
    timerSeconds = 0;

    timerStatus.textContent = "Ready";

    updateTimerDisplay();
}


startButton.addEventListener("click", startTimer);

pauseButton.addEventListener("click", pauseTimer);

resetButton.addEventListener("click", resetTimer);

updateTimerDisplay();


/* =========================
   TASK LIST
========================= */

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

let tasks = [];


function updateTaskCount() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    if (total === 0) {
        taskCount.textContent = "0 tasks";
    } else {
        taskCount.textContent =
            `${completed}/${total} completed`;
    }
}


function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const taskElement = document.createElement("div");

        taskElement.className = "task";

        if (task.completed) {
            taskElement.classList.add("completed");
        }


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;


        checkbox.addEventListener("change", () => {

            tasks[index].completed = checkbox.checked;

            saveTasks();

            renderTasks();

            updateProgress();

        });


        const text = document.createElement("span");

        text.className = "task-text";

        text.textContent = task.text;


        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-task";

        deleteButton.textContent = "×";

        deleteButton.title = "Delete task";


        deleteButton.addEventListener("click", () => {

            tasks.splice(index, 1);

            saveTasks();

            renderTasks();

            updateProgress();

        });


        taskElement.appendChild(checkbox);

        taskElement.appendChild(text);

        taskElement.appendChild(deleteButton);

        taskList.appendChild(taskElement);

    });


    updateTaskCount();
}


function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();

    renderTasks();

    updateProgress();
}


addTaskButton.addEventListener("click", addTask);


taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTask();
    }

});


function saveTasks() {

    localStorage.setItem(
        "studyspaceTasks",
        JSON.stringify(tasks)
    );

}


function loadTasks() {

    const savedTasks =
        localStorage.getItem("studyspaceTasks");

    if (savedTasks) {

        tasks = JSON.parse(savedTasks);

    }

    renderTasks();

}


loadTasks();


/* =========================
   PROGRESS
========================= */

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");

const progressMessage =
    document.getElementById("progressMessage");


function updateProgress() {

    if (tasks.length === 0) {

        progressText.textContent = "0%";

        progressFill.style.width = "0%";

        progressMessage.textContent =
            "Add some study tasks to start tracking your progress.";

        return;
    }


    const completedTasks =
        tasks.filter(task => task.completed).length;


    const percentage =
        Math.round(
            (completedTasks / tasks.length) * 100
        );


    progressText.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;


    if (percentage === 0) {

        progressMessage.textContent =
            "Your study session is just getting started.";

    } else if (percentage < 50) {

        progressMessage.textContent =
            "Good start. Keep going.";

    } else if (percentage < 100) {

        progressMessage.textContent =
            "You're making great progress.";

    } else {

        progressMessage.textContent =
            "All tasks complete. Great work.";

    }

}


updateProgress();


/* =========================
   QUICK NOTES
========================= */

const notesInput =
    document.getElementById("notesInput");

const saveNotesButton =
    document.getElementById("saveNotesButton");

const savedText =
    document.getElementById("savedText");


function loadNotes() {

    const savedNotes =
        localStorage.getItem("studyspaceNotes");

    if (savedNotes) {

        notesInput.value = savedNotes;

        savedText.textContent = "Saved";

    }

}


saveNotesButton.addEventListener("click", () => {

    localStorage.setItem(
        "studyspaceNotes",
        notesInput.value
    );

    savedText.textContent = "Saved";

});


notesInput.addEventListener("input", () => {

    savedText.textContent = "Unsaved";

});


loadNotes();


/* =========================
   STUDY STREAK
========================= */

const streakNumber =
    document.getElementById("streakNumber");


function updateStreak() {

    const today =
        new Date().toISOString().split("T")[0];

    const lastStudyDate =
        localStorage.getItem("studyspaceLastStudy");

    let streak =
        Number(
            localStorage.getItem("studyspaceStreak")
        ) || 0;


    if (!lastStudyDate) {

        streak = 1;

        localStorage.setItem(
            "studyspaceStreak",
            streak
        );

        localStorage.setItem(
            "studyspaceLastStudy",
            today
        );

    } else if (lastStudyDate !== today) {

        const lastDate =
            new Date(lastStudyDate);

        const currentDate =
            new Date(today);

        const difference =
            Math.floor(
                (currentDate - lastDate) /
                (1000 * 60 * 60 * 24)
            );


        if (difference === 1) {

            streak++;

        } else if (difference > 1) {

            streak = 1;

        }


        localStorage.setItem(
            "studyspaceStreak",
            streak
        );

        localStorage.setItem(
            "studyspaceLastStudy",
            today
        );

    }


    streakNumber.textContent = streak;

}


updateStreak();
// Subjects

const addSubjectButton = document.getElementById("addSubjectButton");
const subjectForm = document.getElementById("subjectForm");
const subjectInput = document.getElementById("subjectInput");
const saveSubjectButton = document.getElementById("saveSubjectButton");
const cancelSubjectButton = document.getElementById("cancelSubjectButton");
const subjectsList = document.getElementById("subjectsList");

let subjects = JSON.parse(localStorage.getItem("studyspaceSubjects")) || [];

function saveSubjects() {
    localStorage.setItem("studyspaceSubjects", JSON.stringify(subjects));
}

function renderSubjects() {
    subjectsList.innerHTML = "";

    if (subjects.length === 0) {
        subjectsList.innerHTML = `
            <div class="subject-card">
                <h3>No subjects yet</h3>
                <p>Add your first subject to get started.</p>
            </div>
        `;
        return;
    }

    subjects.forEach((subject, index) => {
        const card = document.createElement("div");
        card.className = "subject-card";

        card.innerHTML = `
            <h3>${subject}</h3>
            <p>Ready to study</p>

            <div class="subject-actions">
                <button class="delete-subject" data-index="${index}">
                    Delete
                </button>
            </div>
        `;

        subjectsList.appendChild(card);
    });

    document.querySelectorAll(".delete-subject").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);

            subjects.splice(index, 1);
            saveSubjects();
            renderSubjects();
        });
    });
}

addSubjectButton.addEventListener("click", () => {
    subjectForm.classList.remove("hidden");
    subjectInput.focus();
});

cancelSubjectButton.addEventListener("click", () => {
    subjectInput.value = "";
    subjectForm.classList.add("hidden");
});

saveSubjectButton.addEventListener("click", () => {
    const subject = subjectInput.value.trim();

    if (subject === "") {
        alert("Please enter a subject name.");
        return;
    }

    subjects.push(subject);

    saveSubjects();
    renderSubjects();

    subjectInput.value = "";
    subjectForm.classList.add("hidden");
});

subjectInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        saveSubjectButton.click();
    }
});

renderSubjects