Feature("Robotic Hoover Service");

Scenario("cleans up all patches of dirt", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [2, 2],
    coords: [0, 0],
    patches: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    instructions: "NES",
  });
  I.seeResponseCodeIsSuccessful();
  I.seeResponseContainsJson({
    coords: [0, 1],
    patches: 3,
  });
});

Scenario("does not move if instructions are blank", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [2, 2],
    coords: [0, 0],
    patches: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    instructions: "",
  });
  I.seeResponseCodeIsSuccessful();
  I.seeResponseContainsJson({
    coords: [0, 0],
    patches: 0,
  });
});

Scenario("can start in top left corner", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [2, 2],
    coords: [0, 1],
    patches: [[1, 1]],
    instructions: "E",
  });
  I.seeResponseCodeIsSuccessful();
  I.seeResponseContainsJson({
    coords: [1, 1],
    patches: 1,
  });
});

Scenario("handles invalid instructions", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [2, 2],
    coords: [0, 0],
    patches: [[1, 1]],
    instructions: "INVALID",
  });
  I.seeResponseCodeIs(400);
});

Scenario("handles invalid coords", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [2, 2],
    coords: [-1, 0],
    patches: [[1, 1]],
    instructions: "NN",
  });
  I.seeResponseCodeIs(400);
});

Scenario("does not allow GET requests", ({ I }) => {
  I.sendGetRequest("/cleaning-sessions");
  I.seeResponseCodeIs(405);
});

Scenario("can start on patch of dirt", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [2, 2],
    coords: [0, 0],
    patches: [[1, 1]],
    instructions: "N",
  });
});

Scenario("does not allow starting point outside of bounds", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [4, 2],
    coords: [4, 0],
    patches: [[1, 1]],
    instructions: "W",
  });
  I.seeResponseCodeIs(400);
});

Scenario("can end on a patch of dirt", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [5, 5],
    coords: [1, 1],
    patches: [[2, 2]],
    instructions: "NE",
  });
  I.seeResponseCodeIsSuccessful();
  I.seeResponseContainsJson({
    coords: [2, 2],
    patches: 1,
  });
});

//BUG
Scenario("returns no patches when none were cleaned", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [4, 4],
    coords: [1, 1],
    patches: [[2, 2]],
    instructions: "N",
  });
  I.seeResponseCodeIsSuccessful();
  I.seeResponseContainsJson({
    coords: [1, 2],
    patches: 0,
  });
});

//BUG
Scenario("does not count cleaned patch twice", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [5, 5],
    coords: [1, 2],
    patches: [
      [1, 0],
      [2, 2],
      [2, 3],
    ],
    instructions: "NNESEESWNWW",
  });
  I.seeResponseCodeIsSuccessful();
  I.seeResponseContainsJson({
    coords: [1, 3],
    patches: 1,
  });
});

//BUG
Scenario("can start in origin", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [2, 2],
    coords: [0, 0],
    patches: [[1, 1]],
    instructions: "N",
  });
  I.seeResponseCodeIsSuccessful();
  I.seeResponseContainsJson({
    coords: [0, 1],
    patches: 0,
  });
});

//BUG
Scenario(
  "skids in place when instructed to go outside room boundary",
  ({ I }) => {
    I.sendPostRequest("/cleaning-sessions", {
      roomSize: [4, 4],
      coords: [1, 1],
      patches: [[2, 2]],
      instructions: "NNNNN",
    });
    I.seeResponseCodeIsSuccessful();
    I.seeResponseContainsJson({
      coords: [1, 3],
      patches: 0,
    });
  }
);

//BUG
Scenario("can start in top right corner", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [2, 3],
    coords: [1, 2],
    patches: [[1, 0]],
    instructions: "WSE",
  });
  I.seeResponseCodeIsSuccessful();
  I.seeResponseContainsJson({
    coords: [1, 1],
    patches: 1,
  });
});

//BUG
Scenario("handles invalid patches", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [2, 2],
    coords: [0, 0],
    patches: [[-1, 1]],
    instructions: "W",
  });
  I.seeResponseCodeIs(400);
});

//BUG
Scenario("handles invalid room size", ({ I }) => {
  I.sendPostRequest("/cleaning-sessions", {
    roomSize: [-2, 2],
    coords: [0, 0],
    patches: [[1, 1]],
    instructions: "N",
  });
  I.seeResponseCodeIs(400);
});
