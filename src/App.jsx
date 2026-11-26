
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialTasks = [
  {
    id: 1,
    title: "Wake up early",
    category: "Personal",
    priority: "High",
    date: today(),
    time: "06:00",
    completed: true,
  },
  {
    id: 2,
    title: "Morning exercise",
    category: "Health",
    priority: "Medium",
    date: today(),
    time: "07:00",
    completed: false,
  },
  {
    id: 3,
    title: "Learn React JS",
    category: "Study",
    priority: "High",
    date: today(),
    time: "10:00",
    completed: false,
  },
  {
    id: 4,
    title: "Read a book",
    category: "Personal",
    priority: "Low",
    date: today(),
    time: "20:00",
    completed: false,
  },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("professional-todo-tasks");
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [date, setDate] = useState(today());
  const [time, setTime] = useState("09:00");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "professional-todo-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((task) => {
        if (filter === "Completed") return task.completed;
        if (filter === "Pending") return !task.completed;
        if (filter === "Today") return task.date === today();
        if (filter === "Upcoming") {
          return task.date > today() && !task.completed;
        }
        return true;
      })
      .sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
      );
  }, [tasks, search, filter]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) return;

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? {
              ...task,
              title: title.trim(),
              category,
              priority,
              date,
              time,
            }
            : task
        )
      );
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        category,
        priority,
        date,
        time,
        completed: false,
      };

      setTasks((previous) => [...previous, newTask]);
    }

    resetForm();
  }

  function resetForm() {
    setTitle("");
    setCategory("Personal");
    setPriority("Medium");
    setDate(today());
    setTime("09:00");
    setEditingId(null);
  }

  function editTask(task) {
    setTitle(task.title);
    setCategory(task.category);
    setPriority(task.priority);
    setDate(task.date);
    setTime(task.time);
    setEditingId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteTask(id) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );

      if (editingId === id) resetForm();
    }
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <h2>TaskFlow</h2>
        </div>

        <p className="side-heading">MENU</p>

        {["All", "Today", "Upcoming", "Completed", "Pending"].map(
          (item) => (
            <button
              key={item}
              className={`nav-item ${filter === item ? "active" : ""}`}
              onClick={() => setFilter(item)}
            >
              <span>
                {item === "All" ? "▦" :
                  item === "Today" ? "◷" :
                    item === "Upcoming" ? "▣" :
                      item === "Completed" ? "✓" : "○"}
              </span>
              {item}
            </button>
          )
        )}

        <div className="sidebar-bottom">
          <div className="quote">
            <span>✦ Daily motivation</span>
            <p>Small steps every day lead to big results.</p>
          </div>
          <p className="copyright">TaskFlow © 2026</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>My Workspace</h1>
            <p className="date-label">{dateLabel}</p>
          </div>
          <div className="profile">
            <div className="avatar">U</div>
            <span>My Account</span>
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PERSONAL PRODUCTIVITY HUB</p>
            <h2>Make today count! 👋</h2>
            <p>Organize your day, focus on your goals and get things done.</p>
          </div>
          <div className="welcome-icon">✦</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon purple">▦</div>
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
            <span>All your activities</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <p>Completed</p>
            <h2>{completed}</h2>
            <span>Tasks finished</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>
            <p>Pending</p>
            <h2>{pending}</h2>
            <span>Tasks remaining</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">↗</div>
            <p>Progress</p>
            <h2>{progress}%</h2>
            <span>Your completion rate</span>
          </div>
        </section>

        <section className="progress-card">
          <div className="progress-heading">
            <div>
              <h3>Daily Progress</h3>
              <p>Keep moving towards your goals.</p>
            </div>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="progress-note">
            {completed} of {tasks.length} tasks completed
          </p>
        </section>

        <section className="task-form-card">
          <div className="section-heading">
            <div>
              <h3>{editingId !== null ? "Edit Task" : "Create New Task"}</h3>
              <p>Add your daily routine or an important activity.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group full">
              <label>Task Name</label>
              <input
                type="text"
                placeholder="What do you need to do?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Personal</option>
                  <option>Work</option>
                  <option>Study</option>
                  <option>Health</option>
                  <option>Shopping</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              {editingId !== null && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="add-btn">
                {editingId !== null ? "✓ Update Task" : "+ Add Task"}
              </button>
            </div>
          </form>
        </section>

        <section className="task-list-section">
          <div className="section-heading task-heading">
            <div>
              <h3>My Tasks</h3>
              <p>Manage your activities and stay productive.</p>
            </div>
            <span className="task-count">
              {filteredTasks.length} Tasks
            </span>
          </div>

          <div className="toolbar">
            <input
              type="search"
              placeholder="⌕  Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Today</option>
              <option>Upcoming</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div>📝</div>
                <h3>No tasks found</h3>
                <p>Add a task or change your search and filters.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <article
                  className={`task-item ${task.completed ? "is-completed" : ""}`}
                  key={task.id}
                >
                  <button
                    className={`check-btn ${task.completed ? "checked" : ""}`}
                    onClick={() => toggleTask(task.id)}
                    aria-label="Toggle task completion"
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-details">
                    <h4>{task.title}</h4>
                    <div className="task-meta">
                      <span>{task.category}</span>
                      <span>📅 {task.date}</span>
                      <span>◷ {task.time}</span>
                    </div>
                  </div>

                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>

                  <div className="task-actions">
                    <button
                      onClick={() => editTask(task)}
                      title="Edit task"
                      aria-label="Edit task"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      🗑
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
