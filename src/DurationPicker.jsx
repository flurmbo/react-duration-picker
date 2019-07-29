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
      />
      <DurationPickerColumn
        onChange={minutes =>
          props.onChange(prevDuration => ({ ...prevDuration, minutes }))
        }
      />
      <DurationPickerColumn
        onChange={seconds =>
          props.onChange(prevDuration => ({ ...prevDuration, seconds }))
        }
      />
    </div>
  );
}

export default DurationPicker;
