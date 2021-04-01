import React from 'react';
import { fetchStudents } from '../redux/store';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
//! import thunk
import { _deleteStudent } from '../redux/store';

class StudentList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadStudents();
  }

  handleDelete(id) {
    this.props.deleteStudent(id);
  }

  render() {
    return (
      <ul>
        {this.props.students.map((student) => (
          <li key={student.id}>
            <div>
              <p>Name: {student.fullName}</p>
              <p>Email: {student.email}</p>
              <Link to={`/students/${student.id}`}>View Detail</Link>
              <button onClick={() => this.handleDelete(student.id)}>
                DELETE STUDENT
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = (state) => ({
  students: state.students,
});

const mapDispatchToProps = (dispatch) => ({
  loadStudents: () => dispatch(fetchStudents()),
  deleteStudent: (id) => {
    dispatch(_deleteStudent(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentList);
