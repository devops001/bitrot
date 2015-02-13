
function randIntFromRange(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function randBool() {
  return Math.round(Math.random())===1;
}
