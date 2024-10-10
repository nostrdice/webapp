export function extractMultiplier(content: string) {
  let header = "";
  if (content.includes("1.05x")) {
    header = "1.05x";
  } else if (content.includes("1.1x")) {
    header = "1.1x";
  } else if (content.includes("1.33")) {
    header = "1.33";
  } else if (content.includes("1.5")) {
    header = "1.5";
  } else if (content.includes("2x")) {
    header = "2x";
  } else if (content.includes("3x")) {
    header = "3x";
  } else if (content.includes("5x")) {
    header = "5x";
  } else if (content.includes("10x")) {
    header = "10x";
  } else if (content.includes("100x")) {
    header = "100x";
  } else if (content.includes("50x")) {
    header = "50x";
  } else if (content.includes("1000x")) {
    header = "1000x";
  }
  return header;
}
