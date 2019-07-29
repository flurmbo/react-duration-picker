import React from "react";
import "./DurationPicker.css";
import DurationPickerColumn from "./DurationPickerColumn";

function DurationPicker(props) {
  return (
    <div className="picker">
      <DurationPickerColumn />
      <DurationPickerColumn />
      <DurationPickerColumn hasReticules={true} />
    </div>
  );
}

export default DurationPicker;
