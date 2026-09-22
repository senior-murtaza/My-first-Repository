let equipmentList = document.getElementById("equipmentList");
let searchInput = document.getElementById("searchInput");
let categoryFilter = document.getElementById("categoryFilter");
let checkoutForm = document.getElementById("checkoutForm");
let borrower = document.getElementById("borrower");
let equipmentSelect = document.getElementById("equipmentSelect");
let quantity = document.getElementById("quantity");
let loanList = document.getElementById("loanList");
// let availableOnly = document.getElementById("availableOnly")

async function getData() {
  const response = await fetch("data.json");
  const data = await response.json();
  return data;
}

let equipment;
let sessionLoans = [];

async function main() {
  equipment = await getData();
  console.log(equipment);

  equipment.forEach((element) => {
    let option = document.createElement("option");

    option.value = element.id;
    option.textContent = element.name;

    equipmentSelect.appendChild(option);
  });

  renderEquipment(equipment);
  updateUnavailableCount();
}

function renderEquipment(equipment) {
  while (equipmentList.firstChild) {
    equipmentList.removeChild(equipmentList.firstChild);
  }

  equipment.forEach((element) => {
    let row = document.createElement("tr");
    row.classList.add("card");

    let name = document.createElement("td");
    name.textContent = element.name;

    let category = document.createElement("td");
    category.textContent = "Category: " + element.category;

    let total = document.createElement("td");
    total.textContent = "Total: " + element.total;

    let available = document.createElement("td");
    available.textContent = "Available: " + element.available;

    row.appendChild(name);
    row.appendChild(category);
    row.appendChild(total);
    row.appendChild(available);

    equipmentList.appendChild(row);
  });
}

function renderLoans() {
  while (loanList.firstChild) {
    loanList.removeChild(loanList.firstChild);
  }

  sessionLoans.forEach((loan) => {
    let card = document.createElement("div");
    card.classList.add("card");

    let borrowerName = document.createElement("h3");
    borrowerName.textContent = loan.borrower;

    let quantity = document.createElement("p");
    quantity.textContent = "Quantity: " + loan.quantity;

    let remaining = document.createElement("p");
    remaining.textContent = "Remaining: " + loan.remaining;

    let status = document.createElement("p");
    status.textContent = "Status: " + loan.status;

    card.appendChild(borrowerName);
    card.appendChild(quantity);
    card.appendChild(remaining);
    card.appendChild(status);

    let returnButton = document.createElement("button");
    returnButton.textContent = "Return";
    if (loan.status === "Returned") {
      returnButton.disabled = true;
    }

    let returnInput = document.createElement("input");
    returnInput.type = "number";

    card.appendChild(returnInput);

    returnButton.addEventListener("click", () => {
      console.log("Return Clicked");

      let returnQuantity = Number(returnInput.value);
      console.log(returnQuantity);

      if (
        returnQuantity <= 0 ||
        returnQuantity > loan.remaining ||
        !Number.isInteger(returnQuantity)
      ) {
        console.log("Invalid retun quantity");
        return;
      }

      if (loan.remaining <= 0) {
        return;
      }

      loan.remaining -= returnQuantity;

      if (loan.remaining === 0) {
        loan.status = "Returned";
      }

      let returnItem = equipment.find((element) => {
        return element.id === loan.equipmentId;
      });

      returnItem.available += returnQuantity;
      console.log(returnItem);

      renderEquipment(equipment);
      renderLoans();
      updateUnavailableCount();
    });

    card.appendChild(returnButton);
    loanList.appendChild(card);
  });
}

function updateUnavailableCount() {
  let unavailableCount = document.getElementById("unavailableCount");

  let unavailable = equipment.filter((element) => {
    return element.available === 0;
  });

  unavailableCount.textContent = unavailable.length;
}

function filterEquipment() {
  let searchText = searchInput.value.toLowerCase();
  let selectedCategory = categoryFilter.value;

  let filteredEquipment = equipment.filter((element) => {
    let matchesSearch = element.name.toLowerCase().includes(searchText);

    let matchesCategory =
      selectedCategory === "all" || element.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderEquipment(filteredEquipment);
}
searchInput.addEventListener("input", filterEquipment);
categoryFilter.addEventListener("change", filterEquipment);
main();

checkoutForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("checkout submitted");

  let borrowerName = borrower.value;
  let Selectedequipment = equipmentSelect.value;
  let checkoutQuantity = quantity.value;

  if (borrowerName.length < 2 || borrowerName.length > 50) {
    console.log("Invalid borrower name!");
    return;
  }

  let selectedItem = equipment.find((element) => {
    return element.id === Number(Selectedequipment);
  });
  let checkoutNumber = Number(checkoutQuantity);
  if (
    checkoutNumber <= 0 ||
    !Number.isInteger(checkoutNumber) ||
    checkoutNumber > selectedItem.available
  ) {
    console.log("Invalid Quantity!");
    return;
  }

  selectedItem.available -= checkoutNumber;
  renderEquipment(equipment);
  updateUnavailableCount();

  let loan = {
    id: sessionLoans.length + 1,
    borrower: borrowerName,
    equipmentId: selectedItem.id,
    quantity: checkoutNumber,
    remaining: checkoutNumber,
    status: "Active",
  };

  sessionLoans.push(loan);
  renderLoans();
  console.log(sessionLoans);

  console.log(borrowerName);
  console.log(Selectedequipment);
  console.log(checkoutQuantity);
  console.log(selectedItem);
});
