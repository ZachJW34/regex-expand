# regex-expand

> Rust's [Capture::expand](https://docs.rs/regex/latest/regex/struct.Captures.html#method.expand) with Javascript's [String.prototype.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement) semantics.

### Install and use

npm

```sh
# npm
npx jsr add @zachjw34/regex-expand
# deno
deno add jsr:@zachjw34/regex-expand
```

```ts
import { expand } from "@zachjw34/regex-expand";

expand("hello 123 world", /(\d+)/, "$1"); // => '123'
expand("hello 123 world", /(\d+)\s(?<cap>\w+)/, "$<cap> $1"); // => 'world 123'
expand(
  "---123 hello 456 world 789---",
  /(\d+)\s(\w+)\s(?<n>\d+)\s(?<w>\w+)\s(\d+)/g,
  "$$& = $& | $$`= $` | $$'= $' $$1 = $1 | $$2 = $2 | $$3 = $3 | $$4 = $4 | $$5 = $5 | $$<n> = $<n> | $$<w> = $<w>"
); // => '$& = 123 hello 456 world 789 | $`= --- | $'= --- | $1 = 123 | $2 = hello | $3 = 456 | $4 = world | $5 = 789 | $<n> = 456 | $<w> = world'
```

### Supported Template Patterns

The patterns supported by [String.prototype.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement) are supported by this function.

| Pattern   | Inserts                                                                                    |
| --------- | ------------------------------------------------------------------------------------------ |
| `$$`      | Inserts a "$".                                                                             |
| `$&`      | Inserts the matched substring.                                                             |
| ``$```    | Inserts the portion of the string that precedes the matched substring.                     |
| `$'`      | Inserts the portion of the string that follows the matched substring.                      |
| `$n`      | Inserts the nth (1-indexed) capturing group where `n` is a positive integer less than 100. |
| `$<Name>` | Inserts the named capturing group where `Name` is the group name.                          |
