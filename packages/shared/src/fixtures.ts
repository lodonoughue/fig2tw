import { pick } from "./pick.js";
import { refOf, valueOf, VariableObject } from "./variables.js";

const redRef = ["colors", "red"];
const redRefVar = refOf(["refs", "colors"], "first", "color", redRef);
const lightRed = { r: 255, g: 138, b: 188, a: 1 };
const lightRedVar = valueOf(redRef, "light", lightRed);
const darkRed = { r: 181, g: 0, b: 78, a: 1 };
const darkRedVar = valueOf(redRef, "dark", darkRed);

const blueRef = ["colors", "blue"];
const blueRefVar = refOf(["refs", "colors"], "second", "color", blueRef);
const lightBlue = { r: 164, g: 199, b: 255, a: 1 };
const lightBlueVar = valueOf(blueRef, "light", lightBlue);
const darkBlue = { r: 40, g: 95, b: 181, a: 1 };
const darkBlueVar = valueOf(blueRef, "dark", darkBlue);

const fooRef = ["strings", "foo"];
const fooRefVar = refOf(["refs", "strings"], "first", "string", fooRef);
const singleFoo = "foo";
const singleFooVar = valueOf(fooRef, "single", singleFoo);
const doubleFoo = "foofoo";
const doubleFooVar = valueOf(fooRef, "double", doubleFoo);

const barRef = ["strings", "bar"];
const barRefVar = refOf(["refs", "strings"], "second", "string", barRef);
const singleBar = "bar";
const singleBarVar = valueOf(barRef, "single", singleBar);
const doubleBar = "barbar";
const doubleBarVar = valueOf(barRef, "double", doubleBar);

const threeRef = ["numbers", "three"];
const threeRefVar = refOf(["refs", "numbers"], "first", "number", threeRef);
const regularThree = 3;
const regularThreeVar = valueOf(threeRef, "regular", regularThree);
const poweredThree = 9;
const poweredThreeVar = valueOf(threeRef, "powered", poweredThree);

const fiveRef = ["numbers", "five"];
const fiveRefVar = refOf(["refs", "numbers"], "second", "number", fiveRef);
const regularFive = 5;
const regularFiveVar = valueOf(fiveRef, "regular", regularFive);
const poweredFive = 25;
const poweredFiveVar = valueOf(fiveRef, "powered", poweredFive);

const truthyRef = ["booleans", "truthy"];
const truthyRefVar = refOf(["refs", "booleans"], "first", "boolean", truthyRef);
const regularTruthy = true;
const regularTruthyVar = valueOf(truthyRef, "regular", regularTruthy);
const inverseTruthy = false;
const inverseTruthyVar = valueOf(truthyRef, "inverse", inverseTruthy);

const falsyRef = ["booleans", "falsy"];
const falsyRefVar = refOf(["refs", "booleans"], "second", "boolean", falsyRef);
const regularFalsy = false;
const regularFalsyVar = valueOf(falsyRef, "regular", regularFalsy);
const inverseFalsy = true;
const inverseFalsyVar = valueOf(falsyRef, "inverse", inverseFalsy);

const refRef = ["refs", "refs"];
const refColorRef = ["refs", "colors"];
const refColorRefVar = refOf(refRef, "first", "string", refColorRef);
const refStringRef = ["refs", "strings"];
const refStringRefVar = refOf(refRef, "second", "string", refStringRef);

const colorVar = valueOf(["types", "color"], "regular", lightRed);
const stringVar = valueOf(["types", "string"], "regular", singleFoo);
const numberVar = valueOf(["types", "number"], "regular", regularThree);
const booleanVar = valueOf(["types", "boolean"], "regular", regularTruthy);
const refVar = refOf(["types", "ref"], "regular", "color", ["types", "color"]);

const faultyVar = { path: ["faulty", "variable"], mode: "regular", type: "" };

export const variables = {
  colors: {
    red: [lightRedVar, darkRedVar],
    blue: [lightBlueVar, darkBlueVar],
  },
  strings: {
    foo: [singleFooVar, doubleFooVar],
    bar: [singleBarVar, doubleBarVar],
  },
  numbers: {
    three: [regularThreeVar, poweredThreeVar],
    five: [regularFiveVar, poweredFiveVar],
  },
  booleans: {
    truthy: [regularTruthyVar, inverseTruthyVar],
    falsy: [regularFalsyVar, inverseFalsyVar],
  },
  refs: {
    colors: [redRefVar, blueRefVar],
    strings: [fooRefVar, barRefVar],
    numbers: [threeRefVar, fiveRefVar],
    booleans: [truthyRefVar, falsyRefVar],
    refs: [refColorRefVar, refStringRefVar],
  },
  types: {
    color: [colorVar],
    string: [stringVar],
    number: [numberVar],
    boolean: [booleanVar],
    ref: [refVar],
  },
  faulty: {
    variable: [faultyVar],
  },
  // prettier-ignore
  fonts: {
    heading: {
      fontSize: [valueOf(["fonts", "heading", "fontSize"], "regular", 24)],
      lineHeight: [valueOf(["fonts", "heading", "lineHeight"], "regular", 24)],
      letterSpacing: [valueOf(["fonts", "heading", "letterSpacing"], "regular", 0)],
      fontWeight: [valueOf(["fonts", "heading", "fontWeight"], "regular", 800)],
    },
    body: {
      fontSize: [valueOf(["fonts", "body", "fontSize"], "regular", 12)],
      lineHeight: [valueOf(["fonts", "body", "lineHeight"], "regular", 16)],
      letterSpacing: [valueOf(["fonts", "body", "letterSpacing"], "regular", 4)],
      fontWeight: [valueOf(["fonts", "body", "fontWeight"], "regular", 500)],
    },
  },
  // prettier-ignore
  recursive: {
    firsts: {
      color: [refOf(["recursive", "firsts", "color"], "regular", "color", redRef)],
      string: [refOf(["recursive", "firsts", "string"], "regular", "string", fooRef)],
      number: [refOf(["recursive", "firsts", "number"], "regular", "number", threeRef)],
      boolean: [refOf(["recursive", "firsts", "boolean"], "regular", "boolean", truthyRef)],
    },
    seconds: {
      color: [refOf(["recursive", "seconds", "color"], "regular", "color", blueRef)],
      string: [refOf(["recursive", "seconds", "string"], "regular", "string", barRef)],
      number: [refOf(["recursive", "seconds", "number"], "regular", "number", fiveRef)],
      boolean: [refOf(["recursive", "seconds", "boolean"], "regular", "boolean", falsyRef)],
    }
  },
} satisfies VariableObject;

function pickCollections<P extends keyof typeof variables>(
  collections: P[],
): Pick<typeof variables, P> {
  return pick(variables, collections, it => it) as Pick<typeof variables, P>;
}

export const fixtures = {
  redRef,
  redRefVar,
  lightRed,
  lightRedVar,
  darkRed,
  darkRedVar,
  blueRef,
  blueRefVar,
  lightBlue,
  lightBlueVar,
  darkBlue,
  darkBlueVar,
  fooRef,
  fooRefVar,
  singleFoo,
  singleFooVar,
  doubleFoo,
  doubleFooVar,
  barRef,
  barRefVar,
  singleBar,
  singleBarVar,
  doubleBar,
  doubleBarVar,
  threeRef,
  threeRefVar,
  regularThree,
  regularThreeVar,
  poweredThree,
  poweredThreeVar,
  fiveRef,
  fiveRefVar,
  regularFive,
  regularFiveVar,
  poweredFive,
  poweredFiveVar,
  truthyRef,
  truthyRefVar,
  regularTruthy,
  regularTruthyVar,
  inverseTruthy,
  inverseTruthyVar,
  falsyRef,
  falsyRefVar,
  regularFalsy,
  regularFalsyVar,
  inverseFalsy,
  inverseFalsyVar,
  refRef,
  refColorRef,
  refColorRefVar,
  refStringRef,
  refStringRefVar,
  colorVar,
  stringVar,
  numberVar,
  booleanVar,
  refVar,
  variables,
  pickCollections,
};
