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
              <button onClick={saveChanges.bind(null, item.id)}>
                <img src="https://cdn-icons.flaticon.com/png/512/4436/premium/4436481.png?token=exp=1653144176~hmac=b1d82ec1e28a0944ea16839a1db75c4d"></img>
              </button>
            </div>}

            <button className="delete-btn"
              onClick={() => {
                DeleteTodo(item.id);
              }}
            >
              <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" />
            </button>
            <button onClick={() => { UpdateTodo(item) }}><img src="https://cdn-icons.flaticon.com/png/512/420/premium/420140.png?token=exp=1653144448~hmac=5970243b17bbc9d0f093b71869b41e94"></img></button>

          </div>
        );
      })}
    </div>


  );
}

export default Todo;
