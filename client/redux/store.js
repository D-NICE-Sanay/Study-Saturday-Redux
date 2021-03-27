import { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import axios from 'axios';
import thunkMiddleware from 'redux-thunk';

// ACTION TYPES go here:
const GOT_STUDENTS = 'GOT_STUDENTS';
const GOT_SINGLE_STUDENT = 'GOT_SINGLE_STUDENT';
const DELETE_STUDENT = 'DELETE_STUDENT';

// ACTION CREATORS go here:
const gotStudents = (students) => ({
  type: GOT_STUDENTS,
  students,
});

const gotSingleStudent = (student) => ({
  type: GOT_SINGLE_STUDENT,
  student,
});

const deleteStudent = (id) => {
  return {
    type: DELETE_STUDENT,
    id,
  };
};

// THUNK CREATORS go here:
export const fetchStudents = () => async (dispatch) => {
  const { data } = await axios.get('/api/students');
  dispatch(gotStudents(data));
};

export const fetchSingleStudent = (id) => async (dispatch) => {
  const { data } = await axios.get(`/api/students/${id}`);
  dispatch(gotSingleStudent(data));
};

export const _deleteStudent = (id) => {
  return async (dispatch) => {
    try {
      // based on the response we are getting from the backend which is just a 204 No Content
      await axios.delete(`/api/students/${id}`);
      // dispatch id to action creator to let our front-end know of the changes we made in the backend 
      dispatch(deleteStudent(id));
    } catch (error) {
      console.log(error);
    }
  };
};

const initialState = {
  students: [],
  singleStudent: {},
};

const reducer = (state = initialState, action) => {
  const filteredStudents = state.students.filter((student) => {
    //console.log(typeof action.id); // just to make sure
    return student.id !== action.id;
  });
  //to make sure our filter worked
  //console.log('IN THE REDUCER ---->', filteredStudents);
  switch (action.type) {
    case GOT_STUDENTS:
      return {
        ...state,
        students: action.students,
      };
    case GOT_SINGLE_STUDENT:
      return {
        ...state,
        singleStudent: action.student,
      };
    case DELETE_STUDENT:
      return { ...state, students: filteredStudents };
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);

export default store;
