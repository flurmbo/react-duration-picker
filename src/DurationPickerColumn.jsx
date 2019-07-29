import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
const CELL_HEIGHT = 35;
const NUM_CELLS = 20;
const MIDDLE_CELL = NUM_CELLS / 2;
const DECCELERATION_COEFFICIENT = 0.2;

DurationPickerColumn.propTypes = {
  onChange: PropTypes.func
};

function DurationPickerColumn(props) {
  function handleSlideColumn(newOffset) {
    const slideyRect = slideyRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const middleOfContainer = (containerRect.bottom + containerRect.top) / 2;
    const middleOfVisibleSlideyBit = middleOfContainer - slideyRect.top;
    const proportion = middleOfVisibleSlideyBit / slideyRectHeight;
    if (proportion >= 0.75 || proportion <= 0.25) {
      setOffsetState(prevOffsetState => {
        return {
          offset:
            newOffset + ((proportion >= 0.75 ? 1 : -1) * slideyRectHeight) / 2,
          inA: !prevOffsetState.inA,
          cellContents: [
            ...prevOffsetState.cellContents.slice(MIDDLE_CELL, NUM_CELLS),
            ...prevOffsetState.cellContents.slice(0, MIDDLE_CELL)
          ]
        };
      });
    } else {
      setOffsetState(prevOffsetState => ({
        offset: newOffset,
        inA: prevOffsetState.inA,
        cellContents: prevOffsetState.cellContents
      }));
    }
  }

  const slideyRef = useRef(null);
  const containerRef = useRef(null);

  function pointerMoveHandler(e) {
    const position = e.clientY;
    handleSlideColumn(offsetState.offset + position - lastClientY);
    setLastClientY(position);
    // setCursorData(prevCursorData => {
    //   const now = Date.now();
    //   return {
    //     now,
    //     position,
    //     speed:
    //       (2 * (position - prevCursorData.position)) /
    //       (now - prevCursorData.now)
    //   };
    // });
  }

  function pointerEnterHandler(e) {
    setLastClientY(e.clientY);
  }
  function getCurrentSelection(offset, numbers) {
    return numbers[Math.abs(Math.round(offset / CELL_HEIGHT)) + 1];
  }
  function getCurrentSelectionIndex(offset, numbers) {
    return Math.abs(Math.round(offset / CELL_HEIGHT)) + 1;
  }

  // function pointerLeaveHandler(e) {
  //   // console.log(cursorData.speed);
  //   let { speed } = cursorData;
  //   const interval = setInterval(() => {
  //     setOffset((prevOffset) => prevOffset + speed);
  //     speed = speed - DECCELERATION_COEFFICIENT;
  //     if (speed < 0) {
  //       clearInterval(interval);
  //     }
  //   }, 30);
  // }

  function pointerLeaveHandler(e) {
    // slowly slide to align current selection to center
    const currentSelectionIndex = getCurrentSelectionIndex(
      offsetState.offset,
      offsetState.cellContents
    );
    console.log(`aligning slider to ${currentSelectionIndex}`);
    console.log(
      `current offset: ${
        offsetState.offset
      } new offset: ${currentSelectionIndex * CELL_HEIGHT}`
    );
    setOffsetState(prevOffsetState => ({
      ...prevOffsetState,
      offset: -1 * (currentSelectionIndex - 1) * CELL_HEIGHT
    }));
  }

  // ********* STATE VARIABLES ********* //
  const [offsetState, setOffsetState] = useState(() => {
    const numbers = [];
    for (let i = 0; i < NUM_CELLS; i++) {
      numbers.push(i);
    }
    return {
      offset: 0,
      inA: true,
      cellContents: numbers
    };
  });

  const [slideyRectHeight, setSlideyRectHeight] = useState(undefined);
  const [lastClientY, setLastClientY] = useState(undefined);
  // const [cursorData, setCursorData] = useState({
  //   time: 0,
  //   position: 0,
  //   speed: 0
  // });
  const currentSelectionRef = useRef();

  // set up initial position configuration of slidey and measure slidey
  useEffect(() => {
    function getInitialOffset(slideyElem) {
      const slideyRect = slideyElem.getBoundingClientRect();
      return (slideyRect.bottom - slideyRect.top) / 2;
    }

    setOffsetState(prevOffsetState => ({
      offset: -1 * getInitialOffset(slideyRef.current),
      inA: true,
      cellContents: prevOffsetState.cellContents
    }));
    const boundingClientRect = slideyRef.current.getBoundingClientRect();
    setSlideyRectHeight(boundingClientRect.bottom - boundingClientRect.top);
  }, []);
  const { onChange } = props;
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
  }, [offsetState, onChange]);

  const cells = offsetState.cellContents.map(value => {
    if (value === MIDDLE_CELL) {
      return (
        <div className="cellMiddle" key={value}>
          {value}
        </div>
      );
    } else {
      return (
        <div className={value % 2 === 0 ? "cell" : "cellOdd"} key={value}>
          {value}
        </div>
      );
    }
  });
  if (
    currentSelectionRef.current !==
    getCurrentSelection(offsetState.offset, offsetState.cellContents)
  ) {
    console.log(
      getCurrentSelection(offsetState.offset, offsetState.cellContents)
    );
  }
  return (
    <div
      className="columnContainer"
      onPointerMove={pointerMoveHandler}
      ref={containerRef}
      onPointerEnter={pointerEnterHandler}
      // onPointerLeave={pointerLeaveHandler}
      onPointerLeave={pointerLeaveHandler}
      onClick={props.onClick}
    >
      <React.Fragment>
        <hr className="reticule" style={{ top: CELL_HEIGHT - 1 }} />
        <hr className="reticule" style={{ top: CELL_HEIGHT * 2 - 1 }} />
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
