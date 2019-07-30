import React from "react";
import PropTypes from "prop-types";
import "./DurationPicker.css";
import DurationPickerColumn from "./DurationPickerColumn";

DurationPicker.propTypes = {
  onChange: PropTypes.func
};

function DurationPicker(props) {
  return (
    <div className="picker">
      <DurationPickerColumn
        onChange={hours =>
          props.onChange(prevDuration => ({ ...prevDuration, hours }))
        }
        unit="hours"
      />
      <DurationPickerColumn
        onChange={minutes =>
          props.onChange(prevDuration => ({ ...prevDuration, minutes }))
        }
        unit="mins"
      />
      <DurationPickerColumn
        onChange={seconds =>
          props.onChange(prevDuration => ({ ...prevDuration, seconds }))
        }
        unit="secs"
      />
    </div>
  );
}

export default DurationPicker;
