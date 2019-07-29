import React, { useState } from "react";
import DurationPicker from "../src/DurationPicker";
import ReactModal from "react-modal";
ReactModal.setAppElement("#root");
function App(props) {
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const onChange = newDuration => {
    setDuration(newDuration);
  };
  const { hours, minutes, seconds } = duration;
  return (
    <div>
      <ReactModal
        isOpen={true}
        contentLabel="Minimal Modal Example"
        style={{
          content: {
            width: 500,
            height: 500,
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: -250,
            marginTop: -250
          }
        }}
      >
        <div>
          <DurationPicker onChange={onChange} />
        </div>
        <button>Close Modal</button>
      </ReactModal>
      <div>
        {`You have selected the numbers ${hours}, ${minutes}, and ${seconds}.`}
      </div>
    </div>
  );
}

export default App;
