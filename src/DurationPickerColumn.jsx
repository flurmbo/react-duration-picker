import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { toTwoDigitString } from "./utils";
const CELL_HEIGHT = 35;
const NUM_CELLS = 20;
const MIDDLE_CELL = NUM_CELLS / 2;

DurationPickerColumn.propTypes = {
  onChange: PropTypes.func,
  unit: PropTypes.oneOf(["hours", "mins", "secs"])
};

function DurationPickerColumn(props) {
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
  const currentSelectionRef = useRef();
  const offsetStateRef = useRef(offsetState);
  const slideyRef = useRef(null);
  const containerRef = useRef(null);

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

  function moveHandler(e) {
    const { offset } = offsetStateRef.current;
    e.preventDefault();
    const position = e.touches[0].clientY;
    handleSlideColumn(offset + position - lastClientY);
    setLastClientY(position);
  }

  function startHandler(e) {
    e.preventDefault();
    setLastClientY(e.touches[0].clientY);
  }

  function getCurrentSelection(offset, numbers) {
    return numbers[Math.abs(Math.round(offset / CELL_HEIGHT)) + 1];
  }
  function getCurrentSelectionIndex(offset) {
    return Math.abs(Math.round(offset / CELL_HEIGHT)) + 1;
  }

  function endHandler(e) {
    e.preventDefault();
    const { offset } = offsetStateRef.current;
    // slowly slide to align current selection to center
    const currentSelectionIndex = getCurrentSelectionIndex(offset);
    setOffsetState(prevOffsetState => ({
      ...prevOffsetState,
      offset: -1 * (currentSelectionIndex - 1) * CELL_HEIGHT
    }));
  }

  function mouseDownHandler(e) {}
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
    offsetStateRef.current = offsetState;
  }, [offsetState, onChange]);

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
    >
      <React.Fragment>
        <hr className="reticule" style={{ top: CELL_HEIGHT - 1 }} />
        <hr className="reticule" style={{ top: CELL_HEIGHT * 2 - 1 }} />
        <div className="textOverlay" style={{ top: CELL_HEIGHT }}>
          {`${toTwoDigitString(currentSelectionRef.current)}`}
          <div className="foo">{props.unit}</div>
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
