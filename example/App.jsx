import React, { useState } from "react";
import ReactModal from "react-modal";
import DurationPicker from "../src/DurationPicker";

ReactModal.setAppElement("#root");
function App() {
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const onChange = newDuration => {
    setDuration(newDuration);
  };
  const { hours, minutes, seconds } = duration;
  return (
    <React.Fragment>
      <h1>React Duration Picker</h1>
      Hook based React component for picking durations of time. Inspired by
      Android number pickers.
      <h2>Example</h2>
      <button onClick={() => setIsOpen(true)} type="button">
        Select Duration
      </button>
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
          onClick={() => setIsOpen(false)}
          type="button"
          style={{ float: "right" }}
        >
          Select duration
        </button>
      </ReactModal>
      <div>
        {`You have selected the numbers ${hours}, ${minutes}, and ${seconds}.`}
      </div>
    </React.Fragment>
  );
}

export default App;
