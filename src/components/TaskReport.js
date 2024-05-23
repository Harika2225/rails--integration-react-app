import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TaskReport = () => {
  const [tasks, setTasks] = useState([]);

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

  const taskTitles = tasks.map((task) => task.title);
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const completedPercentage = ((completedCount / tasks.length) * 100).toFixed(
    2
  );
  const pendingPercentage = ((pendingCount / tasks.length) * 100).toFixed(2);

  const data = {
    labels: taskTitles,
    datasets: [
      {
        label: "",
        data: tasks.map((task) => (task.completed ? 1 : 0)),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 50,
      },
    ],
  };
  const completionData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Task Count",
        data: [completedCount, pendingCount],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
        barThickness: 50,
      },
    ],
  };
  const dataPie = {
    labels: ["Completed Tasks", "Pending Tasks"],
    datasets: [
      {
        label: "",
        data: [completedCount, pendingCount],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: false, // when hovered on the bargraph to display content
      },
      //   tooltip: {
      //     callbacks: {
      //       label: function (context) {
      //         var label = context.dataset.label || '';
      //         if (label) {
      //           label += ': ';
      //         }
      //         if (context.parsed.y === 1) {
      //           label += 'Completed';
      //         } else {
      //           label += 'Pending';
      //         }
      //         return label;
      //       },
      //     },
      //   },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  const completionOptions = {
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  const pieOptions = {
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="task-report-container">
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <h2>Task Completion Report</h2>
        <Link to="/" style={{ marginLeft: "auto", padding: 10 }}>
          <FaHome />
        </Link>
      </div>
      <div className="chart-container">
        <Bar data={data} options={options} />
        <div className="task-counts">
          <p>Completed Tasks: {completedCount}</p>
          <p>Pending Tasks: {pendingCount}</p>
        </div>
      </div>
      <div className="chart-container">
        <Bar data={completionData} options={completionOptions} />
      </div>
      <div className="pie-chart">
        <Pie data={dataPie} options={pieOptions} />
        <div className="task-percentages">
          <p>Completed Tasks: {completedPercentage}%</p>
          <p>Pending Tasks: {pendingPercentage}%</p>
        </div>
      </div>
    </div>
  );
};

export default TaskReport;
