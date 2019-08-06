import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import DurationPicker from "../src/DurationPicker";

ReactModal.setAppElement("#root");

AppModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};

function AppModal(props) {
  const { isOpen } = props;
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
          initialDuration={{ hours: 0, minutes: 0, seconds: 0 }}
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
