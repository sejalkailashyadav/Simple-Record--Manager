let records = [];
loadRecordsFromLocalStorage();
let currentIndex = -1;
let sorting = { columns: "location", sortType: "asc" };
let currentPage = 1;
const recordsPerPage = 2;

document.getElementById("statusFilter").addEventListener("change", function () {
  filterData();
  
});
// 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
function saveRecordsToLocalStorage() {
  localStorage.setItem("records", JSON.stringify(records));
}
function loadRecordsFromLocalStorage() {
  const storedRecords = localStorage.getItem("records");
  if (storedRecords) {
    records = JSON.parse(storedRecords);
  }
}

function filterData() {
  let status = document.getElementById("statusFilter").value;
  let filteredRecords =
    status === "all"
      ? records
      : records.filter((record) => record.status === status);
  displayMatchingData(filteredRecords);
}

function addData(index = -1) {
  let myForm = document.getElementById("myForm");
  myForm.innerHTML = "";

  let heading = document.createElement("h1");
  heading.innerText = index == -1 ? "Add Records" : "Update Records";
  myForm.appendChild(heading);
  createCustomElement(
    "input",
    "location_name",
    "text",
    {
      placeholder: "Enter Your Location",
    },
    myForm
  );
  createCustomElement(
    "textarea",
    "location_desc",
    "text",
    {
      placeholder: "Enter Your Location Description",
      rows: 3,
      cols: 32,
      maxlength: 220,
    },
    myForm
  );
  let status_div = document.createElement("div");
  status_div.id = "status_div";
  let status_active = createCustomElement("input", "status_active", "radio", {
    name: "status",
    value: "Active",
  });
  let label_active = document.createElement("label");
  label_active.setAttribute("for", "status_active");
  label_active.textContent = "Active";

  let status_inactive = createCustomElement(
    "input",
    "status_inactive",
    "radio",
    {
      name: "status",
      value: "Inactive",
    }
  );
  let label_inactive = document.createElement("label");
  label_inactive.setAttribute("for", "status_inactive");
  label_inactive.textContent = "Inactive";

  status_div.appendChild(status_inactive);
  status_div.appendChild(label_inactive);
  status_div.appendChild(status_active);
  status_div.appendChild(label_active);

  myForm.appendChild(status_div);

  let button = document.createElement("button");
  button.id = "submit";
  button.innerHTML = index == -1 ? "submit" : "update";

  button.addEventListener("click", function (event) {
    event.preventDefault();
    saveData();
  });

  myForm.appendChild(button);
  if (index !== -1) {
    let record = records[index];
    document.getElementById("location_name").value = record.location;
    document.getElementById("location_desc").value = record.location_desc;
    if (record.status === "Active") {
      document.getElementById("status_active").checked = true;
    } else {
      document.getElementById("status_inactive").checked = true;
    }
    currentIndex = index;
  }
  saveRecordsToLocalStorage();
}

function createCustomElement(
  elementName,
  id = "",
  type = "text",
  attributes = {},
  appendChildname
) {
  const element = document.createElement(elementName);

  element.id = id;
  element.type = type;

  for (const [key, value] of Object.entries(attributes)) {
    if (key == "textContent") {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  }

  if (appendChildname) {
    appendChildname.appendChild(element);
  }
  return element;
}

function saveData() {
  let locationValue = document.getElementById("location_name").value;
  let locationDescValue = document.getElementById("location_desc").value;
  let statusValue;
  if (locationDescValue && locationDescValue == "") {
    swal("Please Enters location infomation !!! ");
  }
  if (document.getElementById("status_active").checked) {
    statusValue = "Active";
  } else if (document.getElementById("status_inactive").checked) {
    statusValue = "Inactive";
  } else {
    swal("Please select a status !!! ");
    return;
  }
  if (currentIndex == -1) {
    swal("Data Successfully Added !!! ");
  } else {
    swal("Data Successfully Updated !!! ");
  }

  if (currentIndex !== -1) {
    records[currentIndex].location = locationValue;
    records[currentIndex].location_desc = locationDescValue;
    records[currentIndex].status = statusValue;
    currentIndex = -1;
  } else {
    records.push({
      location: locationValue,
      location_desc: locationDescValue,
      status: statusValue,
    });
    saveRecordsToLocalStorage();
    refreshData();
  }

  document.getElementById("location_name").value = "";
  document.getElementById("location_desc").value = "";
  document.getElementById("status_active").checked = false;
  document.getElementById("status_inactive").checked = false;
  displayData();
  saveRecordsToLocalStorage();
}

document.getElementById("statusFilter").addEventListener("change", function () {
  filterData();
});

function filterData() {
  let status = document.getElementById("statusFilter").value;
  let filteredRecords =
    status === "all"
      ? records
      : records.filter((record) => record.status === status);
  displayMatchingData(filteredRecords);
}
function displayData() {
  displayMatchingData(records);
}

function deleteData(index) {
  let check = confirm("Are you sure you want to delete ?");
  if (check) {
    records.splice(index, 1);
  }
  saveRecordsToLocalStorage();
  refreshData();
}

function editData(index) {
  currentIndex = index;
  addData(index);
  saveRecordsToLocalStorage();
}

function sortData(columns) {
  if (sorting.columns === columns) {
    sorting.sortType = sorting.sortType === "asc" ? "desc" : "asc";
  } else {
    sorting.columns = columns;
    sorting.sortType = "asc";
  }

  records.sort((a, b) => {
    if (sorting.sortType === "asc") {
      return String(a[columns]).localeCompare(String(b[columns]));
    } else {
      return String(b[columns]).localeCompare(String(a[columns]));
    }
  });
  refreshData();
}

function searchData() {
  currentPage = 1;
  let searchingElement = document
    .getElementById("searchid")
    .value.toLowerCase();
  let status = document.getElementById("statusFilter").value;
  let matchingRecords = records.filter(
    (record) =>
      (record.location.toLowerCase().includes(searchingElement) ||
        record.location_desc.toLowerCase().includes(searchingElement)) &&
      (status === "all" || record.status === status)
  );
  displayMatchingData(matchingRecords);
}

function displayMatchingData(matchingRecords) {
  let displayDiv = document.getElementById("submitdata");
  let tableContent = `
      <table>
          <tr>
              <th onClick="sortData('location')">Location</th>
              <th onClick="sortData('location_desc')">Description</th>
              <th onClick="sortData('status')">Status</th>
              <th>More</th>
              <th></th>
          </tr>`;
  let totalPages = Math.ceil(matchingRecords.length / recordsPerPage);
  let startIndex = (currentPage - 1) * recordsPerPage;
  let endIndex = Math.min(startIndex + recordsPerPage, matchingRecords.length);
  for (let i = startIndex; i < endIndex; i++) {
    // let record = matchingRecords[i];
    let record = matchingRecords[i];
    let originalIndex = records.indexOf(record);

    tableContent += `
          <tr>
              <td>${record.location}</td>
              <td>${record.location_desc}</td>
              <td>${record.status}</td>
             <td><button  id="records-btn" onclick="deleteData(${originalIndex})">Delete</button></td>
              <td><button  id="records-btn" onclick="editData(${originalIndex})">Edit</button></td>
              
          </tr>`;
  }
  if (matchingRecords.length === 0) {
    tableContent += `
        <tr>
            <td colspan="5">No records found</td>
        </tr>`;
  }
  tableContent += `</table>`;
  displayDiv.innerHTML = tableContent;

  let paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  if (currentPage > 1) {
    let prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    prevButton.onclick = function () {
      currentPage--;
      displayMatchingData(matchingRecords);
    };
    paginationDiv.appendChild(prevButton);
  }

  for (let i = 1; i <= totalPages; i++) {
    let button = document.createElement("button");
    button.id = "pagenationId";
    button.textContent = i;
    button.onclick = function () {
      currentPage = i;
      displayMatchingData(matchingRecords);
    };
    paginationDiv.appendChild(button);
  }
  if (currentPage < totalPages) {
    let nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.onclick = function () {
      currentPage++;
      displayMatchingData(matchingRecords);
    };
    paginationDiv.appendChild(nextButton);
  }
}

function refreshData() {
  let status = document.getElementById("statusFilter").value;
  let searchingElement = document
    .getElementById("searchid")
    .value.toLowerCase();
  let filteredRecords = records.filter(
    (record) =>
      (record.location.toLowerCase().includes(searchingElement) ||
        record.location_desc.toLowerCase().includes(searchingElement)) &&
      (status === "all" || record.status === status)
  );
  displayMatchingData(filteredRecords);
}
