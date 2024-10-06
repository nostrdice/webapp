import { cloneElement } from "react";
import { defaultGetLocation } from "./defaultGetLocation.tsx";

import { EmbedableContent, EmbedType } from "./buildContents.tsx";

export function embedJSX(content: EmbedableContent, embed: EmbedType): EmbedableContent {
  return content
    .map((subContent) => {
      if (typeof subContent === "string") {
        const matches = subContent.matchAll(embed.regexp);

        if (matches) {
          const newContent: EmbedableContent = [];
          let cursor = 0;
          let str = subContent;
          for (const match of matches) {
            if (match.index !== undefined) {
              const { start, end } = (embed.getLocation || defaultGetLocation)(match);

              if (start < cursor) continue;

              const before = str.slice(0, start - cursor);
              const after = str.slice(end - cursor, str.length);
              const isEndOfLine = /^\p{Z}*(\n|$)/iu.test(after);
              let render = embed.render(match, isEndOfLine);
              if (render === null) continue;

              if (typeof render !== "string" && !render.props.key) {
                render = cloneElement(render, { key: embed.name + match[0] + match.index });
              }

              newContent.push(before, render);

              cursor = end;
              str = after;
            }
          }

          // if all matches failed just return the existing content
          if (newContent.length === 0) {
            return subContent;
          }

          // add the remaining string to the content
          if (str.length > 0) {
            newContent.push(str);
          }

          return newContent;
        }
      }

      return subContent;
    })
    .flat();
}
