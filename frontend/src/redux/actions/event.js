import axios from "axios";
import { server } from "../../server";
import {
  eventCreateRequest,
  eventCreateSuccess,
  eventCreateFail,
  getAlleventsShopRequest,
  getAlleventsShopSuccess,
  getAlleventsShopFailed,
  deleteeventRequest,
  deleteeventSuccess,
  deleteeventFailed,
  getAlleventsRequest,
  getAlleventsSuccess,
  getAlleventsFailed,
} from "../reducers/event";

// create event
export const createevent = (dataRe) => async (dispatch) => {
  try {
    dispatch(eventCreateRequest());

    const { data } = await axios.post(`${server}/event/create-event`, dataRe);
    console.log(data);
    dispatch(eventCreateSuccess(data.event));
  } catch (error) {
    console.log(error);
    // dispatch(eventCreateFail(error.response.data.message));
  }
};

// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch(getAlleventsShopRequest());

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
    dispatch(getAlleventsShopSuccess(data.events));
  } catch (error) {
    dispatch(getAlleventsShopFailed(error.response.data.message));
  }
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch(deleteeventRequest());
    console.log("ahihi");
    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(deleteeventSuccess(data.message));
  } catch (error) {
    dispatch(deleteeventFailed(error.response.data.message));
  }
};

// get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch(getAlleventsRequest());

    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch(getAlleventsSuccess(data.events));
  } catch (error) {
    dispatch(getAlleventsFailed(error.response.data.message));
  }
};
