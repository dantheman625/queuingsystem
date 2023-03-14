const lowValueQueu = [];
const midValueQueu = [];
const highValueQueu = [];

let prioritizeMid = false;

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

export function dequeu(agentId) {
  if (highValueQueu.length === 0 && midValueQueu.length === 0) return null;

  if (midValueQueu.length > 2 * highValueQueu.length) prioritizeMid = true;

  if (prioritizeMid) return prioritizedDeque(agentId);

  return normalDeque(agentId);
}

function normalDeque(agentId) {
  if (highValueQueu.length > 0) {
    const item = highValueQueu.findIndex(
      (e) => !e.givenSignatures.includes(agentId)
    );
    console.log(item);
    if (item >= 0) {
      const i = highValueQueu.splice(item, 1);
      return i[0];
    }
  }

  return midValueQueu.shift();
}

function prioritizedDeque(agentId) {
  const item = midValueQueu.shift();
  if (midValueQueu.length <= highValueQueu.length) prioritizeMid = false;
  return item;
}
