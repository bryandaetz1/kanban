const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const allColumnsList = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumnIndex;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

getSavedColumns();
updateSavedColumns();

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

//Add to Column List, Rest Textbox
function addToColumn(columnIndex) {
  const itemText = addItems[columnIndex].textContent;
  const selectedArray = listArrays[columnIndex];
  selectedArray.push(itemText);
  updateDOM();
  addItems[columnIndex].textContent = "";
}

//Show Add Item Input Box
function showInputBox(columnIndex) {
  addBtns[columnIndex].style.visibility = "hidden";
  saveItemBtns[columnIndex].style.display = "flex";
  addItemContainers[columnIndex].style.display = "flex";
}

//Hide Add Item Input Box
function hideInputBox(columnIndex) {
  addBtns[columnIndex].style.visibility = "visible";
  saveItemBtns[columnIndex].style.display = "none";
  addItemContainers[columnIndex].style.display = "none";
  addToColumn(columnIndex);
}

//Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }

  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }

  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }

  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM();
}

function drag(event) {
  draggedItem = event.target;
  console.log("draggedItem", draggedItem);
}

function dragEnter(columnIndex) {
  allColumnsList[columnIndex].classList.add("over");
  currentColumnIndex = columnIndex;
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  //remove background color
  allColumnsList.forEach((column) => {
    column.classList.remove("over");
  });

  //add item to column
  const parent = allColumnsList[currentColumnIndex];
  parent.appendChild(draggedItem);

  rebuildArrays();
}

// Create DOM Element for a list item
function addListElementToColumn(columnElement, listItem) {
  const listElement = document.createElement("li");
  listElement.classList.add("drag-item");
  listElement.textContent = listItem;
  listElement.draggable = true;
  listElement.setAttribute("ondragstart", "drag(event)");
  columnElement.appendChild(listElement);
}

// Create DOM elements for each list item
function addListElementsToColumn(columnElement, listItems) {
  listItems.forEach((listItem) => {
    addListElementToColumn(columnElement, listItem);
  });
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  addListElementsToColumn(backlogList, backlogListArray);

  // Progress Column
  progressList.textContent = "";
  addListElementsToColumn(progressList, progressListArray);

  // Complete Column
  completeList.textContent = "";
  addListElementsToColumn(completeList, completeListArray);

  // On Hold Column
  onHoldList.textContent = "";
  addListElementsToColumn(onHoldList, onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// On Load
updateDOM();
