React duration picker for mobile, inspired by Android number pickers. A live demo is available [here](https://flurmbo.github.io/react-duration-picker).

# Installation

Currently you'll have to clone the repository yourself from Github. The project will be added to the npm registry in the near future.

# Usage

```javascript
const onChange = (duration) => {
  const { hours, minutes, seconds } = duration;
  setState({ hours, minutes, seconds });
}

return (
  <Modal open={isOpen}>
  <DurationPicker

    onChange={onChange} />
    maxHours={5}
    <button onClick={closeModal}
  </Modal>
)
```

# Contributing

Contributions and feedback are welcome. Submit bugs or suggestions as an [issue](https://github.com/flurmbo/react-duration-picker/issues) on Github.
