import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

//Board API
export const fetchBoardDetailsAPI = async (boardId) => {
  const request = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //axios se tra ve qua property cua no la data
  return request.data
}

export const updateDetailBoardsAPI = async (boardId, updateData) => {
  const request = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return request.data
}

export const moveCardToDifferentToColumnAPI = async ( updateData) => {
  const request = await axios.put(`${API_ROOT}/v1/boards/supports/moving_cards`, updateData)
  return request.data
}

//Column API
export const createNewColumnAPI = async (newColumnData) => {
  const request = await axios.post(`${API_ROOT}/v1/columns/`, newColumnData)
  return request.data
}

export const updateDetailColumnAPI = async (columnId, updateData) => {
  const request = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return request.data
}

export const deleteDetailColumnAPI = async (columnId) => {
  const request = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return request.data
}


//Card API
export const createNewCardAPI = async (newCardData) => {
  const request = await axios.post(`${API_ROOT}/v1/cards/`, newCardData)
  return request.data
}

