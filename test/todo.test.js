import { test } from "node:test";
import assert from "node:assert/strict";
import { addTodo, toggleTodo, removeTodo, clearCompleted, visibleTodos } from "../src/todo.js";

test("addTodo appends a trimmed title with the next id", () => {
  const one = addTodo([], "  Buy milk ");
  assert.deepEqual(one, [{ id: 1, title: "Buy milk", done: false }]);
  assert.equal(addTodo(one, "Walk dog")[1].id, 2);
});

test("addTodo ignores an empty title", () => {
  assert.deepEqual(addTodo([], "   "), []);
});

test("toggleTodo flips only the matching todo", () => {
  const todos = addTodo(addTodo([], "a"), "b");
  const toggled = toggleTodo(todos, 2);
  assert.equal(toggled[0].done, false);
  assert.equal(toggled[1].done, true);
});

test("removeTodo drops the matching todo", () => {
  const todos = addTodo(addTodo([], "a"), "b");
  assert.deepEqual(removeTodo(todos, 1).map((t) => t.title), ["b"]);
});

test("visibleTodos filters by active and done", () => {
  const todos = toggleTodo(addTodo(addTodo([], "a"), "b"), 1);
  assert.deepEqual(visibleTodos(todos, "active").map((t) => t.title), ["b"]);
  assert.deepEqual(visibleTodos(todos, "done").map((t) => t.title), ["a"]);
  assert.equal(visibleTodos(todos, "all").length, 2);
});

test("clearCompleted removes only completed todos and keeps the rest in order", () => {
  let todos = addTodo(addTodo(addTodo([], "a"), "b"), "c");
  todos = toggleTodo(toggleTodo(todos, 1), 3);
  assert.deepEqual(clearCompleted(todos).map((t) => t.title), ["b"]);
});

test("clearCompleted leaves an active todo untouched", () => {
  const todos = toggleTodo(addTodo(addTodo([], "a"), "b"), 1);
  const active = todos[1];
  const cleared = clearCompleted(todos);
  assert.equal(cleared.length, 1);
  assert.equal(cleared[0], active);
  assert.equal(cleared[0].done, false);
});

test("clearCompleted keeps a list without completed todos and an empty list as they are", () => {
  const todos = addTodo(addTodo([], "a"), "b");
  assert.deepEqual(clearCompleted(todos), todos);
  assert.deepEqual(clearCompleted([]), []);
});
