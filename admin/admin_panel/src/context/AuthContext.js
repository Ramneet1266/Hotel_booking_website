import { createContext, useEffect, useReducer } from "react"

const INITIAL_STATE = {
	// this is done if refreshing of page is done and if there is any user inside the localstorage then it will reterive that user if not then by refreshing the page the user will be logout
	user: JSON.parse(localStorage.getItem("user")) || null,
	loading: false,
	error: null
}

export const AuthContext = createContext(INITIAL_STATE)

const AuthReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN_START":
			return {
				user: null,
				loading: true,
				error: null
			}
		case "LOGIN_SUCCESS":
			return {
				user: action.payload,
				loading: false,
				error: null
			}
		case "LOGIN_FAILURE":
			return {
				user: null,
				loading: false,
				error: action.payload
			}
		case "LOGUT":
			return {
				user: null,
				loading: false,
				error: null
			}
		default:
			return state
	}
}

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

	// this function searches for the user in the local storage also user is a option of object so to store the user in the local storage user is converted into string using stringify
	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(state.user))
	}, [state.user])

	return <AuthContext.Provider value={{ user: state.user, loading: state.loading, error: state.error, dispatch }}>{children}</AuthContext.Provider>
}
