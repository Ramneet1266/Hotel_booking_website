import React, { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import "./login.css"
import { useNavigate } from "react-router-dom"

const Login = () => {
	const [credentials, setCredentials] = useState({
		username: undefined,
		password: undefined
	})

	const { loading, error, dispatch } = useContext(AuthContext)

	const navigate = useNavigate()

	const handleChange = e => {
		//here prev value of credentials is taken
		setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
	}

	const handleClick = async e => {
		e.preventDefault()
		//here payload is not returned as there is no value in the variables
		dispatch({ type: "LOGIN_START" })
		try {
			const res = await axios.post("/auth/login", credentials)
			dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details })
			navigate("/")
		} catch (err) {
			dispatch({ type: "LOGIN_FAILURE", payload: err.response.data })
		}
	}

	return (
		<div className="login">
			<div className="lContainer">
				<input type="text" placeholder="username" id="username" onChange={handleChange} className="lInput" />
				<input type="password" placeholder="password" id="password" onChange={handleChange} className="lInput" />
				{/* button is disabled if there is loading */}
				<button disabled={loading} className="lButton" onClick={handleClick}>
					Login
				</button>
				{error && <span>{error.message}</span>}
			</div>
		</div>
	)
}

export default Login
