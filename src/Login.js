import React from "react";
import "./Login.css"
import { signInWithGoogle } from "./firebase-config";

function Login() {
  return (
    <div>

      <div className="login-div">


        <div className="btn-div">
          <button className="signInbtn" onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
      </div>
    </div>
  );
}
export default Login;
