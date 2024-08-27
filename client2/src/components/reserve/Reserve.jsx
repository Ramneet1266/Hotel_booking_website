import React, { useContext, useState } from "react"
import "./reserve.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import useFetch from "../hooks/useFetch"
import { useNavigate } from "react-router-dom"
import { SearchContext } from "../../context/SearchContext"
import axios from "axios"

const Reserve = ({ setOpen, hotelId }) => {
	const [selectedRooms, setSelectedRooms] = useState([])
	const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`)
	const { date } = useContext(SearchContext)

	const getDatesInRange = (startDate, endDate) => {
		const start = new Date(startDate)
		const end = new Date(endDate)
		const date = new Date(start.getTime())

		let dates = []

		while (date <= end) {
			dates.push(new Date(date).getTime())
			date.setDate(date.getDate() + 1)
		}
		return dates
	}
	const allDates = getDatesInRange(date[0].startDate, date[0].endDate)

	const isAvailable = roomNumber => {
		// the sum method will check whether the unavailableDates include any of the dates entered by user or not if yes then the return will be in negative ie dates are unabailable
		const isFound = roomNumber.unavailableDates.some(date => allDates.includes(new Date(date).getTime()))

		return !isFound
	}

	const handleSelect = e => {
		const checked = e.target.checked
		const value = e.target.value
		//here this function means if the box is checked then add that selected box to prev selected rooms and if the same box which was checked before is unchecked then remove that box from the prev seelcted rooms
		setSelectedRooms(checked ? [...selectedRooms, value] : selectedRooms.filter(item => item !== value))
	}

	const navi = useNavigate()
	const handleClick = async () => {
		try {
			await Promise.all(
				selectedRooms.map(roomId => {
					const res = axios.put(`/rooms/availability/${roomId}`, { date: allDates })
					return res.data
				})
			)
			setOpen(false)
			navi("/")
		} catch (err) {}
	}
	return (
		<div className="reserve">
			<div className="rContainer">
				<FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)} />
				<span>Select your rooms:</span>
				{data.map(item => (
					<div className="rItem">
						<div className="rItemInfo">
							<div className="rTitle">{item.title}</div>
							<div className="rDesc">{item.desc}</div>
							<div className="rMax">
								Max People: <b>{item.maxPeople}</b>
							</div>
							<div className="rPrice">${item.price}</div>
						</div>
						<div className="rSelectRooms">
							{item.roomNumbers.map(roomNumber => (
								<div className="room">
									<label>{roomNumber.number}</label>
									<input type="checkbox" value={roomNumber._id} onChange={handleSelect} disabled={!isAvailable(roomNumber)} />
								</div>
							))}
						</div>
					</div>
				))}
				<button onClick={handleClick} className="rButton">
					Reserve Now!
				</button>
			</div>
		</div>
	)
}

export default Reserve
