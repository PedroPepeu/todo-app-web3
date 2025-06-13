// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TodoList {
    uint256 public taskCount;

    struct Task {
        uint256 id;
        string  content;
        bool    completed;
    }

    mapping(uint256 => Task) private tasks;

    event TaskAdded(uint256 indexed id, string content);
    event TaskUpdated(uint256 indexed id, string newContent);
    event TaskToggled(uint256 indexed id, bool completed);
    event TaskDeleted(uint256 indexed id);

    function addTask(string calldata _content) external {
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskAdded(taskCount, _content);
        taskCount++;
    }

    function updateTask(uint256 _id, string calldata _newContent) external {
        require(_id < taskCount, "Task doesn't exist");
        tasks[_id].content = _newContent;
        emit TaskUpdated(_id, _newContent);
    }

    function toggleComplete(uint256 _id) external {
        require(_id < taskCount, "Task doesn't exist");
        tasks[_id].completed = !tasks[_id].completed;
        emit TaskToggled(_id, tasks[_id].completed);
    }

    function deleteTask(uint256 _id) external {
        require(_id < taskCount, "Task doesn't exist");
        delete tasks[_id];
        emit TaskDeleted(_id);
    }

    function getTask(uint256 _id) external view returns (Task memory) {
        require(_id < taskCount, "Task doesn't exist");
        return tasks[_id];
    }
}
