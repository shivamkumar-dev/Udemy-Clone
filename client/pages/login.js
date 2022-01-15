// import { useState } from "react";

const Login = () => {
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const handleLogin = (e) => {
    //     e.preventDefault();
    //     console.table({ name, email, password })
    // }
    return (
        <>
            <div className="flex-1 mx-auto text-center bg--dark p-12">
                <h1 className="text-white text-2xl">Login</h1>
            </div>
            {/* <div className="columns-12">
                <form onSubmit={handleLogin}>
                    <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter Name" />
                    <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter Email" required />
                    <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter Password" required />
                </form>
            </div> */}
        </>
    )
}
export default Login;