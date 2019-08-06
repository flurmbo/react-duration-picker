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
      <p>
        Hook based React component for picking durations of time. Inspired by
        Android number pickers.
      </p>
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
          Confirm Selection
        </button>
      </ReactModal>
      <div>
        {`You have selected a duration of ${hours} hour${
          hours !== 1 ? "s" : ""
        }, ${minutes} minute${minutes !== 1 ? "s" : ""}, and ${seconds} second${
          seconds !== 1 ? "s" : ""
        }.`}
      </div>
      <h2>Features</h2>
      <ul>
        <li>Support for mobile devices as well as mouse and keyboard input.</li>
        <li>
          Source code and documentation available on{" "}
          <a href="https://github.com/flurmbo/react-duration-picker">Github</a>.
        </li>
      </ul>
    </React.Fragment>
  );
}

export default App;
