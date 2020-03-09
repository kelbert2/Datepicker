import * as React from "react";
// import Hello from "..";
// import renderer from "react-test-renderer";

// test("Component should show 'red' text 'Hello World'", () => {
//     const component = renderer.create(<Hello text="World" />);
//     const testInstance = component.root;

//     expect(testInstance.findByType(Hello).props.text).toBe("World");

//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
// });
describe("Selected begin and end dates", () => {
    test("Selecting a date that is before the selected begin and end dates sets a new begin date", () => {

    });
    test("Selecting a date after the begin and end dates sets a new end date", () => {

    });
});
describe("Selected begin but no end date", () => {
    test("Selecting before the selected beginDate switches the two", () => {

    });
    test("Selecting a date after a begin date selects the end date", () => {

    });
});
describe("Selected end but no begin date", () => {
    test("Selecting a date before the end date sets a begin date", () => {

    });
    test("Selecting a date after the end date sets a new end date and sets the previous end date to the begin date", () => {

    });
});

// expect(function()).toEqual(output);


test("Selecting the selected begin date resets range selection", () => {

});
test("Selecting the selected end date resets range selection", () => {

});

describe("Disable Month View", () => {
    test("It should open up in Year View", () => {

    });
    test("It is impossible to navigate to Month View by pressing the Period Button", () => {

    });
});