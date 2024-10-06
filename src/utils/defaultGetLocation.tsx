export function defaultGetLocation(match: RegExpMatchArray) {
  if (match.index === undefined) throw new Error("match does not have index");
  return {
    start: match.index,
    end: match.index + match[0].length,
  };
}
