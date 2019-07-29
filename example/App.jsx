import React, { useState } from "react";
import DurationPicker from "../src/DurationPicker";
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
      <div>
        {`You have selected the numbers ${hours}, ${minutes}, and ${seconds}.`}
      </div>
      <DurationPicker onChange={onChange} />
    </div>
  );
}

export default App;
