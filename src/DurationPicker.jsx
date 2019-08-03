import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DurationPicker.css";
import DurationPickerColumn from "./DurationPickerColumn";

DurationPicker.propTypes = {
  onChange: PropTypes.func
};

function DurationPicker(props) {
  const [isSmallScreen, setIsSmallScreen] = useState(undefined);
  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth <= 400) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);
  return (
    <div className="picker">
      <DurationPickerColumn
        onChange={hours =>
          props.onChange(prevDuration => ({ ...prevDuration, hours }))
        }
        unit="hours"
        isSmallScreen={isSmallScreen}
      />
      <DurationPickerColumn
        onChange={minutes =>
          props.onChange(prevDuration => ({ ...prevDuration, minutes }))
        }
        unit="mins"
        isSmallScreen={isSmallScreen}
      />
      <DurationPickerColumn
        onChange={seconds =>
          props.onChange(prevDuration => ({ ...prevDuration, seconds }))
        }
        unit="secs"
        isSmallScreen={isSmallScreen}
      />
    </div>
  );
}

export default DurationPicker;
