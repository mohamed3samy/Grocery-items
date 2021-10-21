const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

let editElement,
	editFlag = false,
	editID = "";

form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

document.addEventListener("DOMContentLoaded", setupItems);

// Add item
function addItem(e) {
	e.preventDefault();

	const value = grocery.value;
	const id = new Date().getTime().toString();

	if (value !== "" && !editFlag) {
		const element = document.createElement("article");
		const attr = document.createAttribute("data-id");

		attr.value = id;
		element.setAttributeNode(attr);
		element.classList.add("grocery-item");

		element.innerHTML = `
		<p class="title">${value}</p>
		<div class="btn-container">
			<button type="button" class="edit-btn">
				<i class="fa fa-pencil-square-o"></i>
			</button>
			<button type="button" class="delete-btn">
				<i class="fa fa-trash"></i>
			</button>
		</div>
		`;

		const deleteBtn = element.querySelector(".delete-btn");
		deleteBtn.addEventListener("click", deleteItem);

		const editBtn = element.querySelector(".edit-btn");
		editBtn.addEventListener("click", editItem);

		list.appendChild(element);

		displayAlert("item added to the list", "success");

		container.classList.add("show-container");

		addToLocalStorage(id, value);

		setBackToDefault();
	} else if (value !== "" && editFlag) {
		editElement.innerHTML = value;
		displayAlert("item changed", "success");

		editLocalStorage(editID, value);

		setBackToDefault();
	} else {
		displayAlert("please enter item", "danger");
	}
}

// displayAlert
function displayAlert(text, action) {
	alert.textContent = text;
	alert.classList.add(`alert-${action}`);

	setTimeout(() => {
		alert.textContent = "";
		alert.classList.remove(`alert-${action}`);
	}, 1000);
}

// Clear Items
function clearItems() {
	const items = document.querySelector(".grocery-item");

	if (items.length > 0) {
		items.forEach((items) => list.removeChild(item));
	}

	container.classList.remove("show-container");
	displayAlert("Your list is empty", "danger");
	setBackToDefault();

	localStorage.removeItem("list");
}

// Delete item
function deleteItem(e) {
	const element = e.currentTarget.parentElement.parentElement;

	const id = element.dataset.id;

	list.removeChild(element);

	if (list.children.length === 0) {
		container.classList.remove("show-container");
	}
	displayAlert("item removed", "danger");

	setBackToDefault();

	removeFromLocalStorage(id);
}

// Edit item
function editItem(e) {
	const element = e.currentTarget.parentElement.parentElement;

	editElement = e.currentTarget.parentElement.previousElementSibling;
	grocery.value = editElement.innerHTML;
	editFlag = true;
	editID = element.dataset.id;
	submitBtn.textContent = "edit";
}

function setBackToDefault() {
	grocery.value = "";
	editFlag = false;
	editID = "";
	submitBtn.textContent = "submit";
}

// Add to local storge
function addToLocalStorage(id, value) {
	const grocery = {
		id,
		value,
	};
	const items = getLocalStorage();

	items.push(grocery);
	localStorage.setItem("list", JSON.stringify(items));
}

// get local storage
function getLocalStorage() {
	return localStorage.getItem("list")
		? JSON.parse(localStorage.getItem("list"))
		: [];
}

// Remove from local storage
function removeFromLocalStorage(id) {
	let items = getLocalStorage();
	items = items.filter((item) => {
		if (item.id !== id) return item;
	});
	localStorage.setItem("list", JSON.stringify(items));
}

// Edit local storage
function editLocalStorage(id, value) {
	let items = getLocalStorage();

	items = items.map((item) => {
		if (item.id === id) {
			item.value = value;
		}
		return item;
	});
	localStorage.setItem("list", JSON.stringify(items));
}

// Setup local storage
function setupItems() {
	let items = getLocalStorage();

	if (items.length > 0) {
		items.forEach((item) => {
			creatListItem(item.id, item.value);
		});
		container.classList.add("show-container");
	}
}

function creatListItem(id, value) {
	const element = document.createElement("article");
	const attr = document.createAttribute("data-id");

	attr.value = id;
	element.setAttributeNode(attr);
	element.classList.add("grocery-item");

	element.innerHTML = `
		<p class="title">${value}</p>
		<div class="btn.container">
			<button type="button" class="edit-btn">
				<i class="fa fa-pencil-square-o"></i>
			</button>
			<button type="button" class="delete-btn">
				<i class="fa fa-trash"></i>
			</button>
		</div>
		`;

	const deleteBtn = element.querySelector(".delete-btn");
	deleteBtn.addEventListener("click", deleteItem);

	const editBtn = element.querySelector(".edit-btn");
	editBtn.addEventListener("click", editItem);

	list.appendChild(element);
}
