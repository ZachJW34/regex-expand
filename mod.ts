/**
 * Expand a regex capture group into the provided template.
 * @param value String to match against
 * @param regex RegExp to use to match
 * @param template String template to expand into
 * ```ts
 * expand("hello 123 world", /(\d+)/, "$1"); // => '123'
 * expand("hello 123 world", /(\d+)\s(?<cap>\w+)/, "$<cap> $1"); // => 'world 123'
 * ```
 * @example
 */
export function expand(
  value: string,
  regex: RegExp,
  template: string
): string | null {
  const matches = regex.exec(value);
  if (!matches) return null;

  let idx = 0;
  let res = "";

  outerloop: while (idx < template.length) {
    const [currentChar, nextChar] = [template[idx], template[idx + 1]];

    // Don't check the last character, valid patterns have 2+ characters
    if (idx >= template.length - 1) {
      res += currentChar;
      idx += 1;
    }

    // If it doesn't start with $ just add the character
    else if (currentChar !== "$") {
      res += currentChar;
      idx += 1;
    }

    // '$$' -> '$'
    else if (nextChar === "$") {
      res += "$";
      idx += 2;
    }

    // '$&' -> match
    else if (nextChar === "&") {
      res += matches[0];
      idx += 2;
    }

    // '$`' -> Preceding match
    else if (nextChar === "`") {
      res += value.substring(0, value.search(matches[0]));
      idx += 2;
    }

    // '$&' -> After match
    else if (nextChar === "'") {
      res += value.substring(value.search(matches[0]) + matches[0].length);
      idx += 2;
    }

    // '$n' -> Positional match
    // assume less than 10 positional capture groups for now
    else if (Number.parseInt(nextChar)) {
      const positional = matches[Number.parseInt(nextChar)];
      if (positional) {
        res += positional;
      } else {
        res += currentChar + nextChar;
      }
      idx += 2;
    }

    // '$n' -> Named Capture Group
    else if (nextChar === "<") {
      if (!matches.groups) {
        res += currentChar + nextChar;
        idx += 2;
      } else {
        for (const key in matches.groups || {}) {
          // value = 'hello 123 world' | regex = /(?<num>\d+)/g | template = '$<num>'
          // idx = 6, key = 'num' => substring(6, 6 + 3 + 3) === '$<num>'
          const substringOffset = idx + key.length + 3; // $<>;
          if (template.substring(idx, substringOffset) === `$<${key}>`) {
            res += matches.groups[key];
            idx = substringOffset;
            continue outerloop;
          }
        }

        // Didn't find a named capture group
        res += currentChar + nextChar;
        idx += 2;
      }
    }

    // '$...' -> Started with $ but no match
    else {
      res += currentChar;
      idx += 1;
    }
  }

  return res;
}
