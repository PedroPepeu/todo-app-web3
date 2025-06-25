const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TodoList", (m) => {
  const todoList = m.contract("TodoList");
  
  return { todoList };
}); 