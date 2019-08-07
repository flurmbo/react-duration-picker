import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import DurationPicker from "../src/DurationPicker";

ReactModal.setAppElement("#root");

AppModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  initialDuration: PropTypes.shape({
    hours: PropTypes.number,
    mins: PropTypes.number,
    secs: PropTypes.number,
  }),
};

AppModal.defaultProps = {
  initialDuration: { hours: 0, mins: 0, secs: 0 },
};

function AppModal(props) {
  const { isOpen, initialDuration } = props;
  const [durationDisplayedOnPicker, setDurationDisplayedOnPicker] = useState(
    undefined
  );
  const onChange = duration => {
    setDurationDisplayedOnPicker(duration);
  };
  const buttonClickHandler = () => {
    const { setIsOpen, onCloseModal } = props;
    setIsOpen(false);
    onCloseModal(durationDisplayedOnPicker);
  };
  console.log(durationDisplayedOnPicker || { hours: 0, mins: 0, secs: 0 });
  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Select Duration"
      style={{
        overlay: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          position: "static",
        },
      }}
    >
      <div>
        <DurationPicker
          onChange={onChange}
          initialDuration={initialDuration || { hours: 0, mins: 0, secs: 0 }}
          maxHours={9}
        />
      </div>
      <button
        onClick={buttonClickHandler}
        type="button"
        style={{ float: "right" }}
      >
        Confirm Selection
      </button>
    </ReactModal>
  );
}

export default AppModal;
