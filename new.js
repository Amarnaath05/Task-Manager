// Task Module
const TaskModule = (() => {
    class Task {
      constructor(taskName, dueDate, priority, completed = false) {
        this.taskName = taskName;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
      }
  
      getTaskDetail() {
        return `${this.taskName} (Due: ${this.dueDate}, Priority: ${this.priority}, Completed: ${this.completed})`;
      }
  
      toggleCompletion() {
        this.completed = !this.completed;
      }
    }
  
    let taskList = [];
  
    const addTask = (...tasks) => {
      taskList.push(...tasks);
      updateTaskCounter();
    };
  
    const deleteLastTask = () => {
      taskList.pop();
      updateTaskCounter();
    };
  
    const addTaskToFront = (...tasks) => {
      taskList.unshift(...tasks);
      updateTaskCounter();
    };
  
    const deleteFirstTask = () => {
      taskList.shift();
      updateTaskCounter();
    };
  
    const getTasks = () => taskList;
  
    const saveTasks = async () => {
      localStorage.setItem("taskList", JSON.stringify(taskList));
      alert("Tasks saved!");
    };
  
    const loadTasks = async () => {
      const tasks = JSON.parse(localStorage.getItem("taskList")) || [];
      taskList = tasks.map(
        (t) => new Task(t.taskName, t.dueDate, t.priority, t.completed)
      );
      updateTaskCounter();
      renderTasks();
    };
  
    const updateTaskCounter = (() => {
      let taskCounter = 0;
      return () => {
        taskCounter = taskList.length;
        console.log(`Total Tasks: ${taskCounter}`);
      };
    })();
  
    return {
      Task,
      addTask,
      deleteLastTask,
      addTaskToFront,
      deleteFirstTask,
      getTasks,
      saveTasks,
      loadTasks,
    };
  })();
  
  // DOM Operations
  const renderTasks = () => {
    const taskListElement = document.getElementById("taskList");
    taskListElement.innerHTML = "";
  
    const tasks = TaskModule.getTasks();
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${task.getTaskDetail()}
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      taskListElement.appendChild(li);
    });
  
    // Attach delete event listeners
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        deleteTask(index);
      });
    });
  };
  
  const addTaskUI = () => {
    const taskName = document.getElementById("taskName").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;
  
    if (!taskName || !dueDate || !priority) {
      alert("Please fill in all fields.");
      return;
    }
  
    const newTask = new TaskModule.Task(taskName, dueDate, priority);
    TaskModule.addTask(newTask);
  
    renderTasks();
  };
  
  const deleteTask = (index) => {
    const tasks = TaskModule.getTasks();
    tasks.splice(index, 1);
    renderTasks();
  };
  
  // Initialize UI
  document.getElementById("addTaskButton").addEventListener("click", addTaskUI);
  document.addEventListener("DOMContentLoaded", TaskModule.loadTasks);
  