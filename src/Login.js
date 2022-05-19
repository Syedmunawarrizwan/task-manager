import React from "react";
import { signInWithGoogle } from "./firebase-config";

function Login() {
  return (
    <React.Fragment>
      <div className="signInbtn">
        <button onClick={signInWithGoogle}>signInWithGoogle</button>
      </div>
    </React.Fragment>
  );
}
export default Login;
