const dashboard = document.querySelector("#dashboard");
const todoSection = document.querySelector("#todo-list");
const plannerSection = document.querySelector("#planner-section");
const goalsSection = document.querySelector("#goals-section");
const timerSection = document.querySelector("#timer-section");
const quotesSection = document.querySelector("#quotes-section");

document.querySelector("#todo-card").addEventListener("click", () => {
    dashboard.classList.add("hidden");
    todoSection.classList.remove("hidden");
});
document.querySelector("#close-todo").addEventListener("click", () => {
    todoSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
});

document.querySelector("#planner-card").addEventListener("click", () => {
    dashboard.classList.add("hidden");
    plannerSection.classList.remove("hidden");
});
document.querySelector("#close-planner").addEventListener("click", () => {
    plannerSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
});

document.querySelector("#goals-card").addEventListener("click", () => {
    dashboard.classList.add("hidden");
    goalsSection.classList.remove("hidden");
});
document.querySelector("#close-goals").addEventListener("click", () => {
    goalsSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
});

document.querySelector("#timer-card").addEventListener("click", () => {
    dashboard.classList.add("hidden");
    timerSection.classList.remove("hidden");
});
document.querySelector("#close-timer").addEventListener("click", () => {
    timerSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
});

document.querySelector("#quotes-card").addEventListener("click", () => {
    dashboard.classList.add("hidden");
    quotesSection.classList.remove("hidden");
    fetchQuote();
});
document.querySelector("#close-quotes").addEventListener("click", () => {
    quotesSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
});

const themeToggle = document.querySelector("#theme-toggle");
let currentTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", currentTheme);

function updateThemeButton(theme) {
    if (theme === "dark") {
        themeToggle.innerHTML = `
            <svg class="text-(--bg-color) group-hover:rotate-360 transition-transform duration-1000 ease-in-out" width="22" height="22" viewBox="0 0 24 24" fill="currentcolor" stroke="currentcolor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <span class="hidden md:group-hover:block text-(--bg-color) text-lg font-bold pr-2">Dark</span>
        `;
    } else {
        themeToggle.innerHTML = `
            <svg class="text-(--bg-color) group-hover:rotate-270 transition-transform duration-[1200ms] ease-in-out" width="22" height="22" viewBox="0 0 24 24" fill="currentcolor" stroke="currentcolor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <span class="hidden md:group-hover:block text-(--bg-color) text-lg font-bold pr-2">Light</span>
        `;
    }
}

updateThemeButton(currentTheme);

themeToggle.addEventListener("click", () => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        updateThemeButton("light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        updateThemeButton("dark");
    }
});

let currentVid = "";

function setVideo() {
    let hr = new Date().getHours();
    let vid = "";

    if (hr >= 5 && hr < 12) {
        vid = "sunrise";
    } else if (hr >= 12 && hr < 17) {
        vid = "noon";
    } else if (hr >= 17 && hr < 20) {
        vid = "sunset";
    } else {
        vid = "night";
    }

    if (window.innerWidth < 768) {
        vid = vid + "-mobile";
    }

    let src = "./assets/background-videos/" + vid + ".webm";
    let video = document.querySelector("#bg-video");

    if (currentVid !== src) {
        video.src = src;
        currentVid = src;
    }
}

setVideo();
window.addEventListener("resize", setVideo);
setInterval(setVideo, 60000);

function updateTime() {
    let now = new Date();

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const dateStr = `${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;
    document.querySelector("#current-date").textContent = dateStr;

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let ampm = hours >= 12 ? "PM" : "AM";

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    const minsStr = String(minutes).padStart(2, "0");
    const secsStr = String(seconds).padStart(2, "0");

    document.querySelector("#current-time").innerHTML =
        `${days[now.getDay()]},<br/>${hours}:${minsStr}:${secsStr} ${ampm}`;
}

setInterval(updateTime, 1000);
updateTime();

const apiKey = "347c1757e128ff7f3d023d627b9c20f6";

async function fetchWeather() {
    const loc = document.querySelector("#location-name");
    const tempCond = document.querySelector("#weather-temp-cond");
    const humidityEl = document.querySelector("#weather-humidity");
    const windEl = document.querySelector("#weather-wind");
    const heatEl = document.querySelector("#weather-heat");

    loc.textContent = "Loading...";
    tempCond.innerHTML = "Loading...";
    humidityEl.textContent = "";
    windEl.textContent = "";
    heatEl.textContent = "";

    if (!navigator.geolocation) {
        loc.textContent = "Geolocation not supported";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
                );
                const data = await response.json();
                if (!response.ok) throw new Error(data.message);

                loc.textContent = data.name;
                tempCond.innerHTML = `${Math.round(data.main.temp)}°C<br/>${data.weather[0].description}`;
                humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
                windEl.textContent = `Wind: ${data.wind.speed}km/h`;
                heatEl.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
            } catch (error) {
                loc.textContent = "Weather unavailable";
                tempCond.innerHTML = "";
            }
        },
        (error) => {
            loc.textContent = "Location access denied";
            tempCond.innerHTML = "";
        },
    );
}

fetchWeather();

async function fetchQuote() {
    const quoteText = document.querySelector("#quote-text");
    const quoteAuthor = document.querySelector("#quote-author");

    quoteText.textContent = "Loading quote...";
    quoteAuthor.textContent = "";

    try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        quoteText.textContent = `"${data.quote}"`;
        quoteAuthor.textContent = `- ${data.author}`;
    } catch (error) {
        quoteText.textContent = "Failed to load quote.";
    }
}

document.querySelector("#new-quote-btn").addEventListener("click", fetchQuote);

let timerInterval;
let timeLeft = 25 * 60;
let isTimerRunning = false;
const timerDisplay = document.querySelector("#timer-display");

function updateTimerDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    timerDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

document.querySelector("#timer-start").addEventListener("click", () => {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                alert("Time is up!");
            }
        }, 1000);
    }
});

document.querySelector("#timer-pause").addEventListener("click", () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
});

document.querySelector("#timer-reset").addEventListener("click", () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

let goals = JSON.parse(localStorage.getItem("goals")) || [];
const goalsContainer = document.querySelector("#goals-container");
const goalProgress = document.querySelector("#goal-progress");

function renderGoals() {
    goalsContainer.innerHTML = "";
    let completedCount = 0;

    goals.forEach((goal, idx) => {
        if (goal.done) completedCount++;
        let textStyle = goal.done
            ? "text-decoration: line-through; color: gray;"
            : "";
        let checkedAttr = goal.done ? "checked" : "";

        goalsContainer.innerHTML += `
            <div class='bg-(--bg-secondary-color) rounded-xl border border-(--border-color) p-4 flex gap-3 items-center'>
                <input type='checkbox' class='w-5 h-5 cursor-pointer goal-check-btn' data-index="${idx}" ${checkedAttr} />
                <span class='text-xl flex-1 font-semibold break-all' style='${textStyle}'>${goal.text}</span>
                <button class='bg-red-500 text-white w-8 h-8 rounded-lg cursor-pointer goal-del-btn' data-index="${idx}">X</button>
            </div>
        `;
    });

    goalProgress.textContent = `${completedCount}/${goals.length}`;
}

goalsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("goal-check-btn")) {
        let idx = e.target.dataset.index;
        goals[idx].done = !goals[idx].done;
        localStorage.setItem("goals", JSON.stringify(goals));
        renderGoals();
    }
    if (e.target.classList.contains("goal-del-btn")) {
        let idx = e.target.dataset.index;
        goals.splice(idx, 1);
        localStorage.setItem("goals", JSON.stringify(goals));
        renderGoals();
    }
});

document.querySelector("#add-goal-btn").addEventListener("click", () => {
    const goalInput = document.querySelector("#goal-input");
    if (goalInput.value.trim() !== "") {
        goals.push({ text: goalInput.value, done: false });
        localStorage.setItem("goals", JSON.stringify(goals));
        goalInput.value = "";
        renderGoals();
    }
});

renderGoals();

let plannerSlots = JSON.parse(localStorage.getItem("planner")) || [];
if (plannerSlots.length === 0) {
    for (let i = 6; i <= 22; i++) {
        let h = i > 12 ? i - 12 : i;
        if (h === 0) h = 12;
        let ampm = i >= 12 ? "PM" : "AM";
        plannerSlots.push({ time: `${h}:00 ${ampm}`, text: "" });
    }
}

const plannerContainer = document.querySelector("#planner-container");

function renderPlanner() {
    plannerContainer.innerHTML = "";
    plannerSlots.forEach((slot, idx) => {
        plannerContainer.innerHTML += `
            <div class='flex gap-4 items-center bg-(--bg-secondary-color) rounded-xl border border-(--border-color) p-4'>
                <div class='w-24 font-bold text-lg'>${slot.time}</div>
                <input type='text' data-index="${idx}" class='planner-input flex-1 bg-(--bg-color) border border-(--border-color) rounded-lg p-3 text-(--text-color)' value='${slot.text}' placeholder='Plan something...' />
            </div>
        `;
    });
}

plannerContainer.addEventListener("change", (e) => {
    if (e.target.classList.contains("planner-input")) {
        let idx = e.target.dataset.index;
        plannerSlots[idx].text = e.target.value;
        localStorage.setItem("planner", JSON.stringify(plannerSlots));
    }
});

renderPlanner();

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
let editIndex = -1;
const taskContainer = document.querySelector("#task-cards-container");

function renderTodos() {
    taskContainer.innerHTML = "";

    let completed = 0;
    const filterBtns = {
        all: document.querySelector("#filter-all"),
        pending: document.querySelector("#filter-pending"),
        completed: document.querySelector("#filter-completed"),
        important: document.querySelector("#filter-important"),
    };

    const defaultClass =
        "bg-(--bg-secondary-color) hover:bg-(--hover-bg-color) text-(--text-muted) hover:text-(--text-color) px-4 py-1.5 font-semibold rounded-full cursor-pointer transition-all duration-300 ease whitespace-nowrap";
    const activeClass =
        "bg-(--text-color) text-(--bg-color) hover:text-(--bg-secondary-color) px-4 py-1.5 font-semibold rounded-full cursor-pointer transition-all duration-300 ease whitespace-nowrap";

    for (let key in filterBtns) {
        filterBtns[key].className =
            key === currentFilter ? activeClass : defaultClass;
    }

    todos.forEach((t, i) => {
        if (t.done) completed++;

        if (currentFilter === "pending" && t.done) return;
        if (currentFilter === "completed" && !t.done) return;
        if (currentFilter === "important" && !t.important) return;

        let textStyle = t.done
            ? "text-decoration: line-through; color: gray; font-style: italic;"
            : "";
        let checkedAttr = t.done ? "checked" : "";
        let titleHtml = t.title;
        if (t.important) {
            titleHtml +=
                " <span class='text-[10px] bg-red-500 text-white px-2 py-0.5 rounded ml-2 align-middle font-bold tracking-wider'>IMP</span>";
        }
        let descHtml =
            t.desc !== ""
                ? `<p class='text-(--text-muted) font-medium mt-1 break-all' style='${textStyle}'>${t.desc}</p>`
                : "";

        taskContainer.innerHTML += `
            <div class='w-full shrink-0 bg-(--bg-secondary-color) rounded-2xl border border-(--border-color) px-4 flex gap-3 group'>
                <div class='w-6 flex justify-center items-start py-4 mt-1'>
                    <input type='checkbox' class='w-5 h-5 cursor-pointer todo-check-btn' data-index="${i}" ${checkedAttr} />
                </div>
                <div class='w-full h-full py-4'>
                    <h3 class='text-(--text-color) font-bold text-xl break-all' style='${textStyle}'>${titleHtml}</h3>
                    ${descHtml}
                </div>
                <div class='flex flex-col gap-2 pt-3'>
                    <button class='md:opacity-0 group-hover:opacity-100 transition-all duration-300 ease flex w-7 h-7 rounded-lg hover:bg-[#2563eb] text-[#2563eb] hover:text-[#dbeafe] justify-center items-center font-bold cursor-pointer todo-edit-btn' data-index="${i}"><i class="ri-edit-2-line"></i></button>
                    <button class='md:opacity-0 group-hover:opacity-100 transition-all duration-300 ease flex w-7 h-7 rounded-lg hover:bg-red-500 text-red-500 hover:text-[#fee2e2] justify-center items-center font-bold cursor-pointer todo-del-btn' data-index="${i}"><i class="ri-delete-bin-line"></i></button>
                </div>
            </div>
        `;
    });

    document.querySelector("#total-count").textContent = todos.length;
    document.querySelector("#completed-count").textContent = completed;
    document.querySelector("#pending-count").textContent =
        todos.length - completed;
}

taskContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("todo-check-btn")) {
        let idx = e.target.dataset.index;
        todos[idx].done = !todos[idx].done;
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }
    if (e.target.classList.contains("todo-edit-btn")) {
        editIndex = e.target.dataset.index;
        document.querySelector("#todo-title").value = todos[editIndex].title;
        document.querySelector("#todo-desc").value = todos[editIndex].desc;
        document.querySelector("#todo-important").checked =
            todos[editIndex].important;
        document.querySelector("#add-todo-btn").textContent = "Update Task";
        document.querySelector("#todo-list h3").textContent = "Update Task";
    }
    if (e.target.classList.contains("todo-del-btn")) {
        let idx = e.target.dataset.index;
        todos.splice(idx, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }
});

document.querySelector("#add-todo-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const titleInp = document.querySelector("#todo-title");
    const descInp = document.querySelector("#todo-desc");
    const impInp = document.querySelector("#todo-important");

    if (titleInp.value.trim() !== "") {
        if (editIndex === -1) {
            todos.push({
                title: titleInp.value,
                desc: descInp.value,
                important: impInp.checked,
                done: false,
            });
        } else {
            todos[editIndex].title = titleInp.value;
            todos[editIndex].desc = descInp.value;
            todos[editIndex].important = impInp.checked;
            editIndex = -1;
            document.querySelector("#add-todo-btn").textContent = "Add Task";
            document.querySelector("#todo-list h3").textContent = "Add tasks";
        }
        localStorage.setItem("todos", JSON.stringify(todos));
        titleInp.value = "";
        descInp.value = "";
        impInp.checked = false;
        renderTodos();
    }
});

document.querySelector("#clearall-btn").addEventListener("click", () => {
    todos = [];
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
});

document.querySelector("#filter-all").addEventListener("click", () => {
    currentFilter = "all";
    renderTodos();
});
document.querySelector("#filter-pending").addEventListener("click", () => {
    currentFilter = "pending";
    renderTodos();
});
document.querySelector("#filter-completed").addEventListener("click", () => {
    currentFilter = "completed";
    renderTodos();
});
document.querySelector("#filter-important").addEventListener("click", () => {
    currentFilter = "important";
    renderTodos();
});

renderTodos();