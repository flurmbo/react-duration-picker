import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { toTwoDigitString } from "./utils";

DurationPickerColumn.propTypes = {
  onChange: PropTypes.func.isRequired,
  unit: PropTypes.oneOf(["hours", "mins", "secs"]).isRequired,
  isSmallScreen: PropTypes.bool,
  maxHours: PropTypes.number,
  cellHeight: PropTypes.number,
};

DurationPickerColumn.defaultProps = {
  isSmallScreen: undefined,
  maxHours: 10,
  cellHeight: 35,
};
function DurationPickerColumn(props) {
  // ********* STATE VARIABLES, PROPS, REFS ********* //
  const { onChange, isSmallScreen, unit, maxHours, cellHeight } = props;
  const NUM_CELLS = unit === "hours" ? maxHours : 60;
  const MIDDLE_CELL = NUM_CELLS / 2;
  const [offsetState, setOffsetState] = useState(() => {
    const numbers = [];
    for (let i = 0; i < NUM_CELLS; i++) {
      numbers.push(i);
    }
    return {
      offset: 0,
      inA: true,
      cellContents: numbers,
    };
  });

  const [slideyRectHeight, setSlideyRectHeight] = useState(undefined);
  const [lastClientY, setLastClientY] = useState(undefined);
  const lastClientYRef = useRef(undefined);
  const currentSelectionRef = useRef();
  const offsetStateRef = useRef(offsetState);
  const slideyRef = useRef(null);
  const containerRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const isMouseDownRef = useRef(false);

  const moveHandler = useCallback(
    e => {
      function handleSlideColumn(newOffset) {
        const slideyRect = slideyRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const middleOfContainer =
          (containerRect.bottom + containerRect.top) / 2;
        const middleOfVisibleSlideyBit = middleOfContainer - slideyRect.top;
        const proportion = middleOfVisibleSlideyBit / slideyRectHeight;
        if (proportion >= 0.75 || proportion <= 0.25) {
          setOffsetState(prevOffsetState => {
            return {
              offset:
                newOffset +
                ((proportion >= 0.75 ? 1 : -1) * slideyRectHeight) / 2,
              inA: !prevOffsetState.inA,
              cellContents: [
                ...prevOffsetState.cellContents.slice(MIDDLE_CELL, NUM_CELLS),
                ...prevOffsetState.cellContents.slice(0, MIDDLE_CELL),
              ],
            };
          });
        } else {
          setOffsetState(prevOffsetState => ({
            offset: newOffset,
            inA: prevOffsetState.inA,
            cellContents: prevOffsetState.cellContents,
          }));
        }
      }

      const { offset } = offsetStateRef.current;
      e.preventDefault();
      const position = e.touches ? e.touches[0].clientY : e.clientY;
      handleSlideColumn(offset + position - lastClientYRef.current);
      setLastClientY(position);
    },
    [slideyRectHeight]
  );
  function startHandler(e) {
    e.preventDefault();
    setLastClientY(e.touches ? e.touches[0].clientY : e.clientY);
  }

  function getCurrentSelection(offset, numbers) {
    return numbers[Math.abs(Math.round(offset / cellHeight)) + 1];
  }
  function getCurrentSelectionIndex(offset) {
    return Math.abs(Math.round(offset / cellHeight)) + 1;
  }

  const endHandler = useCallback(e => {
    e.preventDefault();
    const { offset } = offsetStateRef.current;
    // slowly slide to align current selection to center
    const currentSelectionIndex = getCurrentSelectionIndex(offset);
    setOffsetState(prevOffsetState => ({
      ...prevOffsetState,
      offset: -1 * (currentSelectionIndex - 1) * cellHeight,
    }));
  }, []);

  const mouseDownHandler = e => {
    startHandler(e);
    setIsMouseDown(true);
  };

  const keyDownHandler = e => {
    console.log(`key down and key is ${e.code}`);
  };

  const focusInHandler = () => {
    window.addEventListener("keydown", keyDownHandler);
  };

  const focusOutHandler = () => {
    window.removeEventListener("keydown", keyDownHandler);
  };

  // set up initial position configuration of slidey and measure slidey
  useEffect(() => {
    function getInitialOffset(slideyElem) {
      const slideyRect = slideyElem.getBoundingClientRect();
      return (slideyRect.bottom - slideyRect.top) / 2;
    }

    setOffsetState(prevOffsetState => ({
      offset: -1 * getInitialOffset(slideyRef.current),
      inA: true,
      cellContents: prevOffsetState.cellContents,
    }));
    const boundingClientRect = slideyRef.current.getBoundingClientRect();
    setSlideyRectHeight(boundingClientRect.bottom - boundingClientRect.top);
  }, [slideyRectHeight]);

  // set up and teardown listeners for keyboard input
  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("focusin", focusInHandler);
    container.addEventListener("focusout", focusOutHandler);
    return () => {
      container.removeEventListener("focusin", focusInHandler);
      container.removeEventListener("focusout", focusOutHandler);
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  useEffect(() => {
    // when offset config is changed, update current selection
    const currentSelection = getCurrentSelection(
      offsetState.offset,
      offsetState.cellContents
    );
    if (currentSelectionRef.current !== currentSelection) {
      currentSelectionRef.current = currentSelection;
      onChange(currentSelection);
    }
    offsetStateRef.current = offsetState;
  }, [offsetState, onChange]);

  useEffect(() => {
    lastClientYRef.current = lastClientY;
  }, [lastClientY]);
  useEffect(() => {
    if (isMouseDown && !isMouseDownRef.current) {
      // mouse just depressed
      window.addEventListener("mousemove", moveHandler);
      const mouseUpHandler = e => {
        endHandler(e);
        setIsMouseDown(false);
        window.removeEventListener("mousemove", moveHandler);
        window.removeEventListener("mouseup", mouseUpHandler);
      };
      window.addEventListener("mouseup", mouseUpHandler);
    }
    isMouseDownRef.current = isMouseDown;
  }, [isMouseDown, moveHandler, endHandler]);

  const cells = offsetState.cellContents.map(value => {
    return (
      <div className="cell" key={value}>
        {toTwoDigitString(value)}
      </div>
    );
  });
  return (
    <div
      className="columnContainer"
      ref={containerRef}
      onTouchMove={moveHandler}
      onTouchStart={startHandler}
      onTouchEnd={endHandler}
      onMouseDown={mouseDownHandler}
      role="slider"
      aria-valuemax={unit === "hours" ? maxHours : 60}
      aria-valuemin={0}
      aria-valuenow={currentSelectionRef.current}
      tabIndex={0}
    >
      <React.Fragment>
        <hr className="reticule" style={{ top: cellHeight - 1 }} />
        <hr className="reticule" style={{ top: cellHeight * 2 - 1 }} />
        <div className="textOverlay" style={{ top: cellHeight }}>
          {`${toTwoDigitString(currentSelectionRef.current)}`}
          <div>{isSmallScreen ? unit[0] : unit}</div>
        </div>
      </React.Fragment>
      <div
        className="column"
        style={{ top: offsetState.offset || 0 }}
        ref={slideyRef}
      >
        {cells}
      </div>
    </div>
  );
}

export default DurationPickerColumn;
