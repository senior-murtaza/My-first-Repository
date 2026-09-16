let equipmentList = document.getElementById("equipmentList")
let searchInput = document.getElementById("searchInput")
let categoryFilter = document.getElementById("categoryFilter")
let equipmentSelect = document.getElementById("equipmentSelect")
let equipmentCount = document.getElementById("equipmentCount")
let unavailableCount = document.getElementById("unavailableCount")
let checkoutForm = document.getElementById("checkoutForm")
let borrower = document.getElementById("borrower")
let quantity = document.getElementById("quantity")
let checkoutMessage = document.getElementById("checkoutMessage")
let loanList = document.getElementById("loanList")

let equipment;
let sessionLoans = [];

async function getdata() {
  let response = await fetch("data.json")
  const data = await response.json()
  return data};

  async function main(){
  equipment = await getdata();

  equipment.forEach((element) => {
    let option = document.createElement("option")
      option.value = element.id;
      option.textContent = element.name;
      
      equipmentSelect.appendChild(option) 
  });
  renderEquipment(equipment)
  updateEquipmentCount()
  updateUnavailableCount()
  renderLoans()
}
main()

function renderEquipment(equipment){
  while(equipmentList.firstChild)
    equipmentList.removeChild(equipmentList.firstChild)

  equipment.forEach((element) => {
    let row = document.createElement("tr");

    let nameCell = document.createElement("td");
    nameCell.textContent = element.name;

    let categoryCell = document.createElement("td");
    categoryCell.textContent = "Category: " + element.category;

    let totalCell = document.createElement("td");
    totalCell.textContent = "Total: " + element.total;

    let availableCell = document.createElement("td");
    availableCell.textContent = "Available: " + element.available;
    
    row.appendChild(nameCell);
    row.appendChild(categoryCell);
    row.appendChild(totalCell);
    row.appendChild(availableCell);

    equipmentList.appendChild(row);
  });
};

function updateEquipmentCount(){
  equipmentCount.textContent = equipment.length
};

function updateUnavailableCount(){
  let unavailable = equipment.filter((element) => {
    return element.available === 0;
  });

  unavailableCount.textContent = unavailable.length;
}

searchInput.addEventListener("input", () => {
  let searchText = searchInput.value.toLowerCase(); 

  let filteredEquipment = equipment.filter((element) => {
    if(element.name.toLowerCase().includes(searchText)){
      return true;
    }else{
      return false;
    }
  })

  renderEquipment(filteredEquipment)
});

categoryFilter.addEventListener("change", () =>{
  let selectedCategory = categoryFilter.value;

  if(selectedCategory === "all"){
    renderEquipment(equipment)
  }else {
    let filteredEquipment = equipment.filter((element) => {
      if (element.category === selectedCategory){
        return true;
      }else{
        return false;
      }
    });

    renderEquipment(filteredEquipment)
  }
})

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault()

  let borrowerName = borrower.value.trim()
  let selectedEquipmentId = Number(equipmentSelect.value)
  let checkoutQuantity = Number(quantity.value)

  if(borrowerName.length < 2 || borrowerName.length > 60){
    checkoutMessage.textContent = "Borrower must be between 2 and 60 characters."
    return
  }

  if(!Number.isInteger(checkoutQuantity) || checkoutQuantity <= 0){
    checkoutMessage.textContent = "Quantity must be a positive integer."
    return
  }

  let selectedEquipment = equipment.find((element) => {
    return element.id === selectedEquipmentId
  })

  if(!selectedEquipment){
    checkoutMessage.textContent = "Please select equipment."
    return
  }

  if(checkoutQuantity > selectedEquipment.available){
    checkoutMessage.textContent = "Quantity is greater than available quantity."
    return
  }

  selectedEquipment.available -= checkoutQuantity

  let loan = {
    id: sessionLoans.length + 1,
    borrower: borrowerName,
    equipmentId: selectedEquipment.id,
    equipmentName: selectedEquipment.name,
    quantity: checkoutQuantity,
    remaining: checkoutQuantity
  }

  sessionLoans.push(loan)

  checkoutMessage.textContent = "Checkout successful."

  checkoutForm.reset()

  renderEquipment(equipment)
  updateUnavailableCount()
  renderLoans()
});

function renderLoans(){
  while(loanList.firstChild)
    loanList.removeChild(loanList.firstChild)

  sessionLoans.forEach((loan) => {
    let card = document.createElement("div")
    card.classList.add("card")

    let borrowerText = document.createElement("p")
    borrowerText.textContent = "Borrower: " + loan.borrower

    let equipmentText = document.createElement("p")
    equipmentText.textContent = "Equipment: " + loan.equipmentName

    let quantityText = document.createElement("p")
    quantityText.textContent = "Outstanding: " + loan.remaining

    let returnInput = document.createElement("input")
    returnInput.type = "number"
    returnInput.min = "1"
    returnInput.placeholder = "Return quantity"

    let returnButton = document.createElement("button")
    returnButton.type = "button"
    returnButton.textContent = "Return"

    if(loan.remaining === 0){
      quantityText.textContent = "Returned"
      returnInput.disabled = true
      returnButton.disabled = true
    }

    returnButton.addEventListener("click", () => {
      let returnQuantity = Number(returnInput.value)

      if(!Number.isInteger(returnQuantity) || returnQuantity <= 0){
        alert("Return quantity must be a positive integer.")
        return;
      }

      if(returnQuantity > loan.remaining){
        alert("Return quantity cannot be greater than outstanding quantity.")
        return;
      }

      let returnedEquipment = equipment.find((element) => {
        return element.id === loan.equipmentId
      })

      returnedEquipment.available += returnQuantity

      loan.remaining -= returnQuantity

      renderEquipment(equipment)
      updateUnavailableCount()
      renderLoans()
    })

    card.appendChild(borrowerText)
    card.appendChild(equipmentText)
    card.appendChild(quantityText)
    card.appendChild(returnInput)
    card.appendChild(returnButton)
    loanList.appendChild(card)
  })
};