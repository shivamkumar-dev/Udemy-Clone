import { useState } from "react";
const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleRegister = (e) => {
        e.preventDefault();
        console.table({ name, email, password })
    }

    return (
        <>
            <div className="flex-1 text-center p-12 bg--dark">
                <h1 className="text-white text-2xl">Register</h1>
            </div>
            <div className="flex-1 p-12">
                <form className="flex flex-col items-center" onSubmit={handleRegister}>
                    <div className="flex w-64 items-center mb-4 p-3 bg-gray-100">
                        <input type="text" className="flex-1 outline-none bg-gray-100" onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter Name" />
                    </div>
                    <div className="flex w-64 items-center mb-4 p-3 bg-gray-100">
                        <input type="email" className="flex-1 outline-none bg-gray-100" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter Email" required />
                    </div>
                    <div className="flex w-64 items-center mb-4 p-3 bg-gray-100">
                        <input type="password" className="flex-1 outline-none bg-gray-100" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter Password" required />
                    </div>
                    <div className="flex w-64 items-center mb-4 p-3 bg-gray-800">
                        <button type="submit" className="flex-1 text-white text-center bg-gray-800">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Register;