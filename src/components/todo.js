import React, { useState, useEffect, useContext } from "react";
import { collection, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import "./Todo.css";
import { db, logOut } from "../firebase-config";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import { async } from "@firebase/util";

function Todo() {
  const [tododata, setTodoData] = useState("");
  const [todo, setTodo] = useState([]);
  const [redirect, setredirect] = useState(null);
  const [loader, setLoader] = useState(false)
  const [showInputId, setShowInputId] = useState("")
  const [editData, setEditData] = useState("")
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
    setLoader(true);
    const userCollectionRef = collection(db, "todolist", user.uid, "todos");
    const data = await getDocs(userCollectionRef);
    setTodo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoader(false)
  };

  const createTodo = async () => {
    setLoader(true)
    const userCollectionRef = collection(db, "todolist", user.uid, "todos");
    await addDoc(userCollectionRef, { entry: tododata });
    const data = await getDocs(userCollectionRef);

    setTodo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setTodoData("");
    setLoader(false)
  };

  const DeleteTodo = async (id) => {
    setLoader(true)
    const userCollectionRef = collection(db, "todolist", user.uid, "todos");
    const userdoc = doc(db, "todolist", user.uid, "todos", id);
    await deleteDoc(userdoc);
    const data = await getDocs(userCollectionRef);

    setTodo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoader(false)
  };

  const UpdateTodo = async (item) => {
    setEditData(item.entry);
    setShowInputId(item.id);
  }

  const saveChanges = async (id) => {
    const userCollectionRef = collection(db, "todolist", user.uid, "todos");
    const userdoc = doc(db, "todolist", user.uid, "todos", id);
    await updateDoc(userdoc, { entry: editData });
    const data = await getDocs(userCollectionRef);
    setTodo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setShowInputId(false)
  }

  return (

    <div className="todo-div">
      <div className="header-name">
        <h2>Welcome {user?.displayName}</h2  >
        <button className="logout-btn" onClick={() => { logOut(); navigate("/"); }}>Log Out
        </button>
      </div>


      <h1>Todo-list</h1>


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
        Add Todo
      </button>
      {loader && <h1>Loading...</h1>}


      {todo.map((item) => {
        return (
          <div key={item.id} className="list">

            {!(showInputId == item.id) && <h1 className="todo-list">{item.entry}</h1>}
            {(showInputId == item.id) && <div>
              <input value={editData} onChange={(e) => { setEditData(e.target.value) }}></input>
              <button onClick={saveChanges.bind(null, item.id)}>Save</button>
            </div>}

            <button className="delete-btn"
              onClick={() => {
                DeleteTodo(item.id);
              }}
            >
              <img src="https://cdn-icons-png.flaticon.com/512/3096/3096687.png" />
            </button>
            <button onClick={() => { UpdateTodo(item) }}>Update</button>

          </div>
        );
      })}
    </div>


  );
}

export default Todo;
