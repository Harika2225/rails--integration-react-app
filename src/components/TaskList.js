import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TaskModal from "./TaskModal";
import "./styles.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    note: "",
    completed: null,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:6001/tasks")
      .then((response) => {
        if (
          response.status === 200 &&
          response.headers["content-type"].includes("application/json")
        ) {
          if (Array.isArray(response.data)) {
            setTasks(response.data);
          } else {
            console.error("Data is not an array:", response.data);
            setTasks([]);
          }
        } else {
          console.error(
            "Invalid content type:",
            response.headers["content-type"]
          );
          setTasks([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      });
  };

  const handleChange = (eventOrDate) => {
    const name = eventOrDate.target?.name || "completed"; // Use 'completed' for DatePicker
    const value = eventOrDate.target?.value || eventOrDate; // Access value from event or date

    setCurrentTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleInputChange = (e) => handleChange(e);

  const createOrUpdateTask = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    const request = currentTask.id
      ? axios.put(
          `http://localhost:6001/tasks/${currentTask.id}`,
          currentTask,
          { headers }
        )
      : axios.post("http://localhost:6001/tasks", currentTask, { headers });

    request
      .then((response) => {
        if (response && response.data) {
          console.log("Task saved:", response.data);
          setShowModal(false);
          fetchTasks();
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.error("Error saving task:", error.response.data);
        } else {
          console.error("Error saving task:", error);
        }
      });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios
        .delete(`http://localhost:6001/tasks/${taskId}`)
        .then((response) => {
          console.log("Task deleted:", response.data);
          fetchTasks();
        })
        .catch((error) => {
          console.error("Error deleting task:", error.response.data);
        });
    } else {
      console.log("Task deletion canceled.");
    }
  };

  const handleOpenModal = (task = { title: "", note: "", completed: "" }) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Tasks</h1>
        <button className="large" onClick={() => handleOpenModal()}>
          Create New Task
        </button>
        <Link to="/report" className="btn btn-secondary">
          View Task Report
        </Link>
      </div>

      {showModal && (
        <TaskModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          task={currentTask}
          handleChange={handleInputChange}
          handleSubmit={createOrUpdateTask}
        />
      )}

      {tasks.length === 0 ? (
        <span className="text-warning">There are no tasks!</span>
      ) : (
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created at</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <strong>{task.title}</strong>
                </td>
                <td className="text-info">{task.created_at}</td>
                <td className="text-success">{task.completed}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(task)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  &nbsp;
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;
