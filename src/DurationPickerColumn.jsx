import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { toTwoDigitString } from "./utils";

DurationPickerColumn.propTypes = {
  onChange: PropTypes.func.isRequired,
  unit: PropTypes.oneOf(["hours", "mins", "secs"]).isRequired,
  isSmallScreen: PropTypes.bool,
  maxHours: PropTypes.number,
  cellHeight: PropTypes.number,
  initial: PropTypes.number,
};

DurationPickerColumn.defaultProps = {
  isSmallScreen: undefined,
  maxHours: 10,
  cellHeight: 35,
  initial: 0,
};
function DurationPickerColumn(props) {
  // ********* STATE VARIABLES, PROPS, REFS ********* //
  const { onChange, isSmallScreen, unit, maxHours, cellHeight } = props;
<<<<<<< HEAD
  const [columnIsFocused, setColumnIsFocused] = useState(false);
  const NUM_CELLS = unit === "hours" ? maxHours : 60;
  const MIDDLE_CELL = NUM_CELLS / 2;
=======
  const numCells = unit === "hours" ? maxHours : 60;
  const middleCell = numCells / 2;
>>>>>>> alignment handler issues
  const [offsetState, setOffsetState] = useState(() => {
    const numbers = [];
    for (let i = 0; i < numCells; i++) {
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
                ...prevOffsetState.cellContents.slice(middleCell, numCells),
                ...prevOffsetState.cellContents.slice(0, middleCell),
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
    [middleCell, numCells, slideyRectHeight]
  );
  function startHandler(e) {
    e.preventDefault();
    setLastClientY(e.touches ? e.touches[0].clientY : e.clientY);
  }

  const getCurrentSelection = useCallback(
    (offset, numbers) => {
      return numbers[Math.abs(Math.round(offset / cellHeight)) + 1];
    },
    [cellHeight]
  );

  const getCurrentSelectionIndex = useCallback(
    offset => {
      return Math.abs(Math.round(offset / cellHeight)) + 1;
    },
    [cellHeight]
  );

  const endHandler = useCallback(
    e => {
      e.preventDefault();
      const { offset } = offsetStateRef.current;
      // align current selection to center
      const currentSelectionIndex = getCurrentSelectionIndex(offset);
      alignOffsetToCell(currentSelectionIndex);
    },
    [alignOffsetToCell, getCurrentSelectionIndex]
  );

  const mouseDownHandler = e => {
    startHandler(e);
    setIsMouseDown(true);
  };

<<<<<<< HEAD
  const mouseMoveHandler = e => {
    if (isMouseDownRef.current) {
      console.log("mouse is moving and down");
      moveHandler(e);
    }
  };

  const mouseUpHandler = e => {
    if (isMouseDownRef.current) {
      setIsMouseDown(false);
      endHandler(e);
    }
  };

  const alignOffsetToCell = cellIndex => {
    setOffsetState(prevOffsetState => ({
      ...prevOffsetState,
      offset: -1 * (cellIndex - 1) * cellHeight,
    }));
  };
=======
  const alignOffsetToCell = useCallback(
    cellIndex => {
      // setOffsetState(prevOffsetState => ({
      //   ...prevOffsetState,
      //   offset: -1 * (cellIndex - 1) * cellHeight,
      // }));
      handleSlideColumn(-1 * (cellIndex - 1) * cellHeight);
    },
    [cellHeight, handleSlideColumn]
  );

  const handleSlideColumn = useCallback(
    newOffset => {
      const slideyRect = slideyRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const middleOfContainer = (containerRect.bottom + containerRect.top) / 2;
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
              ...prevOffsetState.cellContents.slice(middleCell, numCells),
              ...prevOffsetState.cellContents.slice(0, middleCell),
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
    },
    [middleCell, numCells, slideyRectHeight]
  );
>>>>>>> alignment handler issues

  const keyDownHandler = e => {
    if (columnIsFocused) {
      console.log(`key down and key is ${e.code}`);
    }
  };

<<<<<<< HEAD
  const focusInHandler = () => {
    setColumnIsFocused(true);
  };

  const focusOutHandler = () => {
    setColumnIsFocused(false);
  };
=======
  const focusInHandler = useCallback(() => {
    window.addEventListener("keydown", keyDownHandler);
  }, []);

  const focusOutHandler = useCallback(() => {
    window.removeEventListener("keydown", keyDownHandler);
  }, []);
>>>>>>> alignment handler issues

  // set up initial position configuration of slidey and measure slidey
  useEffect(() => {
    alignOffsetToCell(props.initial);
    const boundingClientRect = slideyRef.current.getBoundingClientRect();
    setSlideyRectHeight(boundingClientRect.bottom - boundingClientRect.top);
    // eslint-disable-next-line react/destructuring-assignment
  }, [alignOffsetToCell, props.initial, slideyRectHeight]);

  useEffect(() => {
    if (isMouseDown !== isMouseDownRef.current) {
      isMouseDownRef.current = isMouseDown;
    }
  }, [isMouseDown]);

  // set up and teardown listeners for keyboard and mouse input
  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("focusin", focusInHandler);
    container.addEventListener("focusout", focusOutHandler);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    return () => {
      container.removeEventListener("focusin", focusInHandler);
      container.removeEventListener("focusout", focusOutHandler);
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("mousemove", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [focusInHandler, focusOutHandler]);

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
  }, [getCurrentSelection, offsetState, onChange]);

  useEffect(() => {
    lastClientYRef.current = lastClientY;
  }, [lastClientY]);

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
