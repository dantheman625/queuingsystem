const lowValueQueu = [];

function enqueu(newItem) {
  console.log("enquue entered");
  try {
    if (!newItem) throw new Error("new item undefined");

    lowValueQueu.push(JSON.parse(newItem));

    return lowValueQueu;
  } catch (e) {
    console.log(e.message);
  }
}

function dequeu() {
  if ((lowValueQueu.length = 0)) return null;

  return lowValueQueu.shift();
}

function getQueu() {
  return lowValueQueu;
}

export { enqueu, dequeu, getQueu };
