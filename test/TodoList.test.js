const { expect } = require("chai");

describe("TodoList", function () {
  let todo, owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const Todo = await ethers.getContractFactory("TodoList");
    todo = await Todo.deploy();
    await todo.deployed();
  });

  it("adds a task", async () => {
    await todo.addTask("Write tests");
    const t = await todo.getTask(0);
    expect(t.content).to.equal("Write tests");
    expect(t.completed).to.equal(false);
  });

  it("toggles completion", async () => {
    await todo.addTask("Ship code");
    await todo.toggleComplete(0);
    const t = await todo.getTask(0);
    expect(t.completed).to.equal(true);
  });
});
