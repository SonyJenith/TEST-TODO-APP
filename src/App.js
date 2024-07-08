import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/login";
import Home from "./pages/Home";
import EditTask from "./pages/EditTask";
import Navbar from "./components/Navbar";


const { Pool } = require("pg");
require("dotenv").config();

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:5432/${process.env.PGDATABASE}`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Example query
pool.query("SELECT * FROM users", (error, results) => {
  if (error) {
    throw error;
  }
  console.log(results.rows);
});


// app.js
const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();
function App() {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
      setTasks(tasks);
    }
  }, []);

  const addTask = (task) => {
    setTasks([...tasks, task]);
    localStorage.setItem("tasks", JSON.stringify([...tasks, task]));
  };

  const deleteTask = (title) => {
    setTasks(tasks.filter((task) => task.title !== title));
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks.filter((task) => task.title !== title))
    );
  };

  const updateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.title === updatedTask.title ? updatedTask : task
      )
    );
    localStorage.setItem(
      "tasks",
      JSON.stringify(
        tasks.map((task) =>
          task.title === updatedTask.title ? updatedTask : task
        )
      )
    );
  };

  const handleLogin = (event) => {
    event.preventDefault();
    // Call API or authentication logic here
    // For demonstration purposes, we'll just check if the credentials are correct
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Router>
      {isLoggedIn ? (
        <>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  editTask={updateTask}
                  addTask={addTask}
                  deleteTask={deleteTask}
                  tasks={tasks}
                />
              }
            />
            <Route
              path="/edit/:title"
              element={<EditTask updateTask={updateTask} tasks={tasks} />}
            />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </>
      ) : (
        <Login
          username={username}
          password={password}
          error={error}
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      )}
    </Router>
  );
}

export default App;