function toTwoDigitString(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return `${number}`;
}

function otherFunction() {
  console.log("himom");
}
export { toTwoDigitString, otherFunction };
