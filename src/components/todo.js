import React, { useState, useEffect, useContext } from "react";
import { collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import "./Todo.css";
import { db, logOut } from "../firebase-config";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [tododata, setTodoData] = useState("");
  const [todo, setTodo] = useState([]);
  const [redirect, setredirect] = useState(null);
  const navigate = useNavigate();


  const user = useContext(AuthContext);


  useEffect(() => {
    console.log(user);
    if (user === null) {
      setredirect("/");
    } else if (user) {
      getData();
    }
    if (user === null && redirect) {
      navigate("/", { replace: true });
    }
  }, [user, redirect]);



  const getData = async () => {
    const userCollectionRef = collection(db, "todolist", user.uid, "todos");
    const data = await getDocs(userCollectionRef);
    setTodo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const createTodo = async () => {
    const userCollectionRef = collection(db, "todolist", user.uid, "todos");
    await addDoc(userCollectionRef, { entry: tododata });
    const data = await getDocs(userCollectionRef);

    setTodo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setTodoData("");
  };

  const DeleteTodo = async (id) => {
    const userCollectionRef = collection(db, "todolist", user.uid, "todos");
    const userdoc = doc(db, "todolist", user.uid, "todos", id);
    await deleteDoc(userdoc);
    const data = await getDocs(userCollectionRef);

    setTodo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  return (
    <React.Fragment>
      <button onClick={() => { logOut(); navigate("/"); }}>LogOut</button>
      <input
        className="user-inp"
        type="text"
        placeholder="eg goal.."
        value={tododata}
        onChange={(event) => {
          setTodoData(event.target.value);
        }}
      />

      <button className="btn-addUser" onClick={createTodo}>
        AddTodo
      </button>

      {todo.map((item) => {
        return (
          <div key={item.id} className="list">
            <h1>{item.entry}</h1>
            <button
              onClick={() => {
                DeleteTodo(item.id);
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </React.Fragment>
  );
}

export default Todo;
