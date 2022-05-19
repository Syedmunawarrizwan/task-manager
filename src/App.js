import React from "react";
import "./App.css";
import { AuthProvider } from "./AuthProvider";
import { Route, Routes } from "react-router-dom";
import { Switch } from "react-router-dom";
import Todo from "./components/todo";
import { useId } from "react";
import Login from "./Login";

function App() {
  const id = useId();
  return (
    <div className="App">
      <h2>TOdolist</h2>
      <AuthProvider >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" exact element={<Todo />} />
        </Routes>
        {/* <Routes>
        </Routes> */}
      </AuthProvider>
    </div>
  );
}

export default App;
