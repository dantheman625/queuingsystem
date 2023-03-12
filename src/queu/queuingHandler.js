const lowValueQueu = [];

function enqueuLowValue(newItem) {
  console.log("enquue entered");
  try {
    if (!newItem) throw new Error("new item undefined");

    lowValueQueu.push(JSON.parse(newItem));

    return lowValueQueu;
  } catch (e) {
    console.log(e.message);
  }
}

function dequeuLowValue() {
  if (lowValueQueu.length === 0) return null;

  return lowValueQueu.shift();
}

function getLowValueQueu() {
  return lowValueQueu;
}

export { enqueuLowValue, dequeuLowValue, getLowValueQueu };
