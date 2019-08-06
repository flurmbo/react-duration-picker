import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DurationPicker.css";
import DurationPickerColumn from "./DurationPickerColumn";

DurationPicker.propTypes = {
  onChange: PropTypes.func,
  initialDuration: PropTypes.shape({
    hours: PropTypes.number,
    mins: PropTypes.number,
    secs: PropTypes.number,
  }),
  maxHours: PropTypes.number,
};

DurationPicker.defaultProps = {
  maxHours: 10,
  onChange: () => {},
  initialDuration: { hours: 0, mins: 0, secs: 0 },
};

function DurationPicker(props) {
  const { onChange, maxHours } = props;
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
          onChange(prevDuration => ({ ...prevDuration, hours }))
        }
        unit="hours"
        maxHours={maxHours}
        isSmallScreen={isSmallScreen}
        initial={5}
      />
      <DurationPickerColumn
        onChange={minutes =>
          onChange(prevDuration => ({ ...prevDuration, minutes }))
        }
        unit="mins"
        isSmallScreen={isSmallScreen}
        initial={23}
      />
      <DurationPickerColumn
        onChange={seconds =>
          onChange(prevDuration => ({ ...prevDuration, seconds }))
        }
        unit="secs"
        initial={45}
        isSmallScreen={isSmallScreen}
      />
    </div>
  );
}

export default DurationPicker;
