import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

//Board API
export const fetchBoardDetailsAPI = async (boardId) => {
  const request = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //axios se tra ve qua property cua no la data
  return request.data
}

//Column API
export const createNewColumnAPI = async (newColumnData) => {
  const request = await axios.post(`${API_ROOT}/v1/columns/`, newColumnData)
  return request.data
}

//Card API
export const createNewCardAPI = async (newCardData) => {
  const request = await axios.post(`${API_ROOT}/v1/cards/`, newCardData)
  return request.data
}