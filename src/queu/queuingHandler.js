const lowValueQueu = [];
const midValueQueu = [];
const highValueQueu = [];

export function getQueusSizes() {
  return {
    low: lowValueQueu.length,
    mid: midValueQueu.length,
    high: highValueQueu.length,
  };
}

export function enqueu(newItem) {
  console.log("enquue entered");
  try {
    if (!newItem) throw new Error("new item undefined");
    const parsedItem = JSON.parse(newItem);

    switch (parsedItem.requiredSignatures) {
      case 0:
        lowValueQueu.push(parsedItem);
        break;
      case 1:
        midValueQueu.push(parsedItem);
        break;
      case 2:
        highValueQueu.push(parsedItem);
        break;
      default:
        throw new Error("Could not assign item by type");
    }
  } catch (e) {
    console.log(e.message);
  }
}

export function dequeuLowValue() {
  if (lowValueQueu.length === 0) return null;

  return lowValueQueu.shift();
}

export function getLowValueQueu() {
  return lowValueQueu;
}
