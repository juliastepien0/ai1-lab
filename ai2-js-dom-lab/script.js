class Todo {
    constructor(listElement) {
        this.listElement = listElement;
        this.term = "";
        const saved = localStorage.getItem('todoTasks');
        this.tasks = saved ? JSON.parse(saved) : [
            { text: "Kupić buty", date: "" },
            { text: "Zrobić projekt", date: "" },
            { text: "Wyjść z psem", date: "" }
        ];
    }

    get filteredTasks() {
        if (this.term.length < 2) return this.tasks;
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
    }

    draw() {
        this.listElement.innerHTML = "";

        this.filteredTasks.forEach((task, index) => {
            const li = document.createElement("li");

            const spanText = document.createElement("span");
            spanText.className = "task-text";

            if (this.term.length >= 2) {
                const regex = new RegExp(`(${this.term})`, "gi");
                spanText.innerHTML = task.text.replace(regex, "<mark>$1</mark>");
            } else {
                spanText.textContent = task.text;
            }

            const spanDate = document.createElement("span");
            spanDate.className = "task-date";
            spanDate.textContent = task.date ? ` do: ${task.date}` : "";

            const delBtn = document.createElement("button");
            delBtn.className = "delete-btn";
            delBtn.textContent = "🗑️";
            delBtn.addEventListener("click", () => {
                this.tasks.splice(index, 1);
                this.save();
                this.draw();
            });

            spanText.addEventListener("click", () => {
                li.innerHTML = "";

                const inputText = document.createElement("input");
                inputText.type = "text";
                inputText.value = task.text;
                inputText.style.width = "60%";

                const inputDate = document.createElement("input");
                inputDate.type = "date";
                inputDate.value = task.date;
                inputDate.style.width = "30%";

                const saveBtn = document.createElement("button");
                saveBtn.textContent = "v";
                
                li.appendChild(inputText);
                li.appendChild(inputDate);
                li.appendChild(saveBtn);
                li.appendChild(delBtn);

                saveBtn.addEventListener("click", () => {
                    const now = new Date();
                    const inputDateValue = inputDate.value ? new Date(inputDate.value + "T00:00") : null;
                    
                    if (inputText.value.length < 3 || inputText.value.length > 255) {
                        alert("Zadanie musi mieć między 3 a 255 znaków");
                        inputText.focus();
                        return;
                    }

                    if (inputDateValue && inputDateValue <= now) {
                        alert("Data musi być w przyszłości");
                        inputDate.focus();
                        return;
                    }

                    task.text = inputText.value;
                    task.date = inputDate.value;

                    this.save();
                    this.draw();
                });

                inputText.focus();
            });

            li.appendChild(spanText);
            li.appendChild(spanDate);
            li.appendChild(delBtn);
            this.listElement.appendChild(li);
        });
        this.save();
    }

    addTask(text, date = "") {
        if (text.length < 3 || text.length > 255) {
            alert("Zadanie musi mieć między 3 a 255 znaków");
            return;
        }

        if (date) {
            const now = new Date();
            const inputDate = new Date(date + "T00:00");
            if (inputDate <= now) {
                alert("Data musi być w przyszłości");
                return;
            }
        }

        this.tasks.push({ text, date });
        this.save();
        this.draw();
    }
    save() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }
}

const taskList = document.getElementById("taskList");
const todo = new Todo(taskList);
todo.draw();

document.getElementById("addBtn").addEventListener("click", () => {
    const text = document.getElementById("newTask").value.trim();
    const date = document.getElementById("deadline").value;
    todo.addTask(text, date);
    document.getElementById("newTask").value = "";
    document.getElementById("deadline").value = "";
});

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", () => {
    todo.term = searchInput.value.trim();
    todo.draw();
});