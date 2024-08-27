import { createContext, useReducer } from "react"

const INITIAL_STATE = {
	city: undefined,
	date: [],
	options: {
		adult: undefined,
		children: undefined,
		room: undefined
	}
}

export const SearchContext = createContext(INITIAL_STATE)

const SearchReducer = (state, action) => {
	switch (action.type) {
		case "NEW_SEARCH":
			// action.payload is the destination, date range and options and here they are also being updated
			return action.payload
		case "RESET_SEARCH":
			// it will pick the destination, date range and options defiend above as they are empty
			return INITIAL_STATE
		default:
			return state
	}
}

export const SearchContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE)

	return <SearchContext.Provider value={{ city: state.city, date: state.date, options: state.options, dispatch }}>{children}</SearchContext.Provider>
}
