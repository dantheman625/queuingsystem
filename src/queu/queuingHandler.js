const lowValueQueu = [];
const midValueQueu = [];
const highValueQueu = [];

const midValueQueuSecondReview = [];
const highValueQueuSecondReview = [];

let prioritizeMid = false;

export function getQueusSizes() {
  return {
    low: lowValueQueu.length,
    mid: midValueQueu.length,
    midSec: midValueQueuSecondReview.length,
    high: highValueQueu.length,
    highSec: highValueQueuSecondReview.length,
  };
}

export function enqueu(newItem) {
  console.log("enquue entered");
  try {
    if (!newItem) throw new Error("new item undefined");
    const parsedItem = JSON.parse(newItem);

    switch (parsedItem.type) {
      case "low":
        lowValueQueu.push(parsedItem);
        break;
      case "mid":
        if (parsedItem.requiredSignatures === 2) {
          midValueQueuSecondReview.push(parsedItem);
          break;
        }
        midValueQueu.push(parsedItem);
        break;
      case "high":
        if (parsedItem.givenSignatures.length > 0) {
          highValueQueuSecondReview.push(parsedItem);
          break;
        }
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
  if (
    highValueQueu.length === 0 &&
    midValueQueu.length === 0 &&
    highValueQueuSecondReview.length === 0 &&
    midValueQueuSecondReview.length === 0
  )
    return null;

  const item = findOldest(agentId);

  return normalDeque(item);
}

function findOldest(agentId) {
  let item = null;

  highValueQueuSecondReview.forEach((e) => {
    if (item === null) {
      if (!e.givenSignatures.includes(agentId)) {
        item = e;
      }
      return;
    }
    if (item !== null && !e.givenSignatures.includes(agentId)) {
      if (e.timeStamp < item.timeStamp) {
        item = e;
      }
    }
  });

  highValueQueu.forEach((e) => {
    if (item === null) {
      item = e;
      return;
    }
    if (e.timeStamp < item.timeStamp) {
      item = e;
    }
  });

  midValueQueuSecondReview.forEach((e) => {
    if (item === null) {
      if (!e.givenSignatures.includes(agentId)) {
        item = e;
      }
      return;
    }
    if (item !== null && !e.givenSignatures.includes(agentId)) {
      if (e.timeStamp < item.timeStamp) {
        item = e;
      }
    }
  });

  midValueQueu.forEach((e) => {
    if (item === null) {
      item = e;
      return;
    }
    if (e.timeStamp < item.timeStamp) {
      item = e;
    }
  });
  return item;
}

function normalDeque(item) {
  if (item.type === "high") {
    if (item.givenSignatures.length > 0) {
      const i = highValueQueuSecondReview.findIndex((x) => x.id === item.id);
      return highValueQueuSecondReview.splice(i, 1);
    }
    const i = highValueQueu.findIndex((x) => x.id === item.id);
    return highValueQueu.splice(i, 1);
  }
  if (item.type === "mid") {
    if (item.givenSignatures.length > 0) {
      const i = midValueQueuSecondReview.findIndex((x) => x.id === item.id);
      return midValueQueuSecondReview.splice(i, 1);
    }
    const i = midValueQueu.findIndex((x) => x.id === item.id);
    return midValueQueu.splice(i, 1);
  }
  return null;
}
