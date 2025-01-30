import { assertEquals } from "@std/assert";
import { expand } from "./mod.ts";

Deno.test(function insert_positional() {
  const actual = expand("hello123world", /(\d+)/g, "$1");
  const expected = "123";

  assertEquals(actual, expected);
});

Deno.test(function insert_named_capture_group() {
  const actual = expand("hello123world", /(?<num>\d+)/g, "$<num>");
  const expected = "123";

  assertEquals(actual, expected);
});

Deno.test(function insert_matched() {
  const actual = expand("hello123world", /\d+/g, "$&");
  const expected = "123";

  assertEquals(actual, expected);
});

Deno.test(function insert_preceding() {
  const actual = expand("hello123world", /\d+/g, "$`");
  const expected = "hello";

  assertEquals(actual, expected);
});

Deno.test(function insert_following() {
  const actual = expand("hello123world", /\d+/g, "$'");
  const expected = "world";

  assertEquals(actual, expected);
});

Deno.test(function ignore_double_$() {
  const actual = expand("hello123world", /(\d+)/g, "1 $1 $$1 $$$1 $$<num>");
  const expected = "1 123 $1 $123 $<num>";

  assertEquals(actual, expected);
});

Deno.test(function ignore_unmatched_positional() {
  const actual = expand("hello123world", /\d+/g, "$2");
  const expected = "$2";

  assertEquals(actual, expected);
});

Deno.test(function ignore_unmatched_named() {
  const actual = expand("hello123world", /(?<yes>\d+)/g, "$<no>");
  const expected = "$<no>";

  assertEquals(actual, expected);
});

Deno.test(function null_if_no_match() {
  const actual = expand("hello123world", /abc/g, "$&");
  const expected = null;

  assertEquals(actual, expected);
});

Deno.test(function kitchen_sink() {
  const actual = expand(
    "---123 hello 456 world 789---",
    /(\d+)\s(\w+)\s(?<n>\d+)\s(?<w>\w+)\s(\d+)/g,
    `$$& = $&
$$\`= $\`
$$\'= $\'
$$1 = $1
$$2 = $2
$$3 = $3
$$4 = $4
$$5 = $5
$$<n> = $<n>
$$<w> = $<w>`
  );
  const expected = `$& = 123 hello 456 world 789
$\`= ---
$\'= ---
$1 = 123
$2 = hello
$3 = 456
$4 = world
$5 = 789
$<n> = 456
$<w> = world`;

  assertEquals(actual, expected);
});
