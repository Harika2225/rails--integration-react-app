import React from "react";
import Modal from "react-modal";
import "./styles.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskModal = ({
  isOpen,
  onRequestClose,
  task,
  handleChange,
  handleSubmit,
}) => {
  const { title, note, completed } = task;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Task Modal"
      className="modal"
    >
      <div className="modal-header">
        <h1>{task.id ? `Editing task ${title}` : "New Task"}</h1>
      </div>
      <div className="modal-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="clearfix"
        >
          <div>
            <label>Title</label> &nbsp;
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Note</label> &nbsp;
            <input
              type="text"
              name="note"
              value={note}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Completed</label> &nbsp;
            <DatePicker
              selected={completed}
              onChange={handleChange}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select Date"
              // required
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-info"
              onClick={onRequestClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TaskModal;
