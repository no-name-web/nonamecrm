
const formPanel = document.getElementById("formPanel");
const customerForm = document.getElementById("customerForm");
const customerList = document.getElementById("customerList");
const searchInput = document.getElementById("search");
const emptyMessage = document.getElementById("emptyMessage");

// Load saved customers from this browser
let customers = [];

try {
  customers = JSON.parse(
    localStorage.getItem("simpleCRMCustomers") || "[]"
  );

  if (!Array.isArray(customers)) {
    customers = [];
  }
} catch {
  customers = [];
}

function saveCustomers() {
  try {
    localStorage.setItem(
      "simpleCRMCustomers",
      JSON.stringify(customers)
    );
  } catch {
    alert("Unable to save data in this browser.");
  }
}

function renderCustomers() {
  const query = searchInput.value.toLowerCase().trim();

  const filteredCustomers = customers.filter(customer =>
    [customer.name, customer.email, customer.company, customer.status]
      .some(value => value.toLowerCase().includes(query))
  );

  customerList.replaceChildren();

  filteredCustomers.forEach(customer => {
    const row = document.createElement("tr");

    function addCell(value) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
      return cell;
    }

    addCell(customer.name);
    addCell(customer.email);
    addCell(customer.company);

    const statusCell = addCell("");
    const statusLabel = document.createElement("span");
    statusLabel.className = "status " + customer.status;
    statusLabel.textContent = customer.status;
    statusCell.appendChild(statusLabel);

    const actionCell = addCell("");
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      if (!confirm("Delete this customer?")) return;

      customers = customers.filter(item => item.id !== customer.id);
      saveCustomers();
      renderCustomers();
    });

    actionCell.appendChild(deleteButton);
    customerList.appendChild(row);
  });

  document.getElementById("totalCustomers").textContent =
    customers.length;

  document.getElementById("newLeads").textContent =
    customers.filter(c => c.status === "New Lead").length;

  document.getElementById("converted").textContent =
    customers.filter(c => c.status === "Converted").length;

  emptyMessage.hidden = filteredCustomers.length > 0;
}

document.getElementById("openForm").addEventListener("click", () => {
  formPanel.hidden = false;
  document.getElementById("name").focus();
});

document.getElementById("cancelForm").addEventListener("click", () => {
  customerForm.reset();
  formPanel.hidden = true;
});

customerForm.addEventListener("submit", event => {
  event.preventDefault();

  const customer = {
    id: crypto.randomUUID(),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    company: document.getElementById("company").value.trim(),
    status: document.getElementById("status").value
  };

  if (!customer.name || !customer.email || !customer.company) {
    alert("Please fill in all customer fields.");
    return;
  }

  customers.unshift(customer);
  saveCustomers();

  customerForm.reset();
  formPanel.hidden = true;
  renderCustomers();
});

searchInput.addEventListener("input", renderCustomers);

renderCustomers();
