import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { toTwoDigitString } from "./utils";

DurationPickerColumn.propTypes = {
  onChange: PropTypes.func.isRequired,
  // note that 'minutes' and 'seconds' are abbreviated in this prop
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
  const [columnIsFocused, setColumnIsFocused] = useState(false);
  const columnIsFocusedRef = useRef(false);
  const numCells = unit === "hours" ? maxHours + 1 : 60;
  const [offsetState, setOffsetState] = useState(() => {
    const numbers = [];
    for (let i = 0; i < numCells; i++) {
      numbers.push(i);
    }
    return {
      offset: 0,
      cellContents: numbers,
    };
  });

  const [lastClientY, setLastClientY] = useState(undefined);
  const lastClientYRef = useRef(undefined);
  const currentSelectionRef = useRef();
  const offsetStateRef = useRef(offsetState);
  const slideyRef = useRef(null);
  const containerRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const isMouseDownRef = useRef(false);

  // ********* EVENT HANDLERS ********* //

  function startHandler(e) {
    e.preventDefault();
    setLastClientY(e.touches ? e.touches[0].clientY : e.clientY);
  }

  const moveHandler = useCallback(e => {
    e.preventDefault();
    const position = e.touches ? e.touches[0].clientY : e.clientY;
    console.log("setting offset state!");
    setOffsetState(prevOffsetState => {
      return {
        ...prevOffsetState,
        offset: prevOffsetState.offset + position - lastClientYRef.current,
      };
    });
    setLastClientY(position);
  }, []);

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

  const mouseDownHandler = useCallback(e => {
    startHandler(e);
    setIsMouseDown(true);
  }, []);

  const mouseMoveHandler = useCallback(
    e => {
      if (isMouseDownRef.current) {
        moveHandler(e);
      }
    },
    [moveHandler]
  );

  const mouseUpHandler = useCallback(
    e => {
      setIsMouseDown(false);
      if (isMouseDownRef.current) {
        endHandler(e);
      }
    },
    [endHandler]
  );

  const keyDownHandler = useCallback(e => {
    if (columnIsFocusedRef.current) {
      console.log(`key down and key is ${e.code}`);
    }
  }, []);

  const focusInHandler = useCallback(() => {
    setColumnIsFocused(true);
  }, []);

  const focusOutHandler = useCallback(() => {
    setColumnIsFocused(false);
  }, []);

  // ********* HELPER FUNCTIONS ********* //
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

  const alignOffsetToCell = useCallback(
    cellIndex => {
      console.log("aligning...");
      setOffsetState(prevOffsetState => {
        return {
          ...prevOffsetState,
          offset: -1 * (cellIndex - 1) * cellHeight,
        };
      });
    },
    [cellHeight]
  );

  const calculateOffsetToColumnRatio = useCallback(newOffset => {
    const delta = newOffset - offsetStateRef.current.offset;
    const slideyRect = slideyRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const middleOfContainer = (containerRect.bottom + containerRect.top) / 2;
    const middleOfVisibleSlideyBit = middleOfContainer - slideyRect.top - delta;
    const slideyRectHeight = slideyRect.bottom - slideyRect.top;
    return middleOfVisibleSlideyBit / slideyRectHeight;
  }, []);

  const handleSlideColumn = useCallback(
    newOffset => {
      const ratio = calculateOffsetToColumnRatio(newOffset);
      if (ratio >= 0.75 || ratio <= 0.25) {
        setOffsetState(prevOffsetState => {
          const { bottom, top } = slideyRef.current.getBoundingClientRect();
          return {
            offset:
              newOffset +
              ((ratio >= 0.75 ? 1 : -1) * (bottom - top)) / 2 +
              (numCells % 2 === 1 ? (-1 * cellHeight) / 2 : 0),
            cellContents: [
              ...prevOffsetState.cellContents.slice(numCells / 2, numCells),
              ...prevOffsetState.cellContents.slice(0, numCells / 2),
            ],
          };
        });
      } else {
        setOffsetState(prevOffsetState => ({
          offset: newOffset,
          cellContents: prevOffsetState.cellContents,
        }));
      }
    },
    [numCells, cellHeight, calculateOffsetToColumnRatio]
  );

  // ********* EFFECTS ********* //

  useEffect(() => {
    // when offset config is changed, check if need to adjust slidey and update current selection
    console.log(offsetState);
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
    // set up initial position configuration of slidey
    alignOffsetToCell(props.initial);

    // eslint-disable-next-line react/destructuring-assignment
  }, [alignOffsetToCell, props.initial]);

  useEffect(() => {
    lastClientYRef.current = lastClientY;
  }, [lastClientY]);

  // ********* MOUSE AND KEYBOARD EFFECTS ********* //

  useEffect(() => {
    if (isMouseDown !== isMouseDownRef.current) {
      isMouseDownRef.current = isMouseDown;
    }
  }, [isMouseDown]);

  useEffect(() => {
    if (columnIsFocused !== columnIsFocusedRef.current) {
      columnIsFocusedRef.current = columnIsFocused;
    }
  }, [columnIsFocused]);

  useEffect(() => {
    // set up and teardown listeners for keyboard and mouse input
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
  }, [
    focusInHandler,
    focusOutHandler,
    keyDownHandler,
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
  ]);

  // ********* RENDER ********* //

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
      <hr className="reticule" style={{ top: cellHeight - 1 }} />
      <hr className="reticule" style={{ top: cellHeight * 2 - 1 }} />
      <div className="textOverlay" style={{ top: cellHeight }}>
        {`${toTwoDigitString(currentSelectionRef.current)}`}
        <div>{isSmallScreen ? unit[0] : unit}</div>
      </div>
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
