// All DOM Elements
const expensesForm = document.getElementById("expensesForm");
const csvFileElement = document.getElementById("expensesUploadFile");
const displaySection = document.getElementById("displaySection");
const expensesFileMessageEelement = document.getElementById("expensesFileUploadMessage");
const totalNumberOfExpenses = document.getElementById("totalNumberOfExpenses");
const totalExpenseAmount = document.getElementById("totalExpenseAmount");
const popupModalContentElement = document.getElementById("popupModalContent");
const expensesAddFormElement = document.getElementById("expensesAddForm");

const STORAGE_CONST = {
  EXPENSES_LABEL: 'expense_tracker_js_expenses_records'
};

let expensesFileUploaded = false;
let possibleDuplicateRecords = false;

let expensesDataCacheData = [];
let expensesDataKeys = [];

/**
 * onLoad of Application, will be called for loading keys from LocalStorage Expenses Data
 */
 function loadExpensesDataKeys() {
  // dateOfExpense
  // expenseDescription
  // expenseAmount
    if (expensesDataCacheData && Array.isArray(expensesDataCacheData)) {
      expensesDataCacheData.forEach(element => {
        expensesDataKeys.push('' + element.dateOfExpense + element.expenseDescription.split(" ").join("_") + element.expenseAmount + '');
      });
    } else {
      console.log('No Queue defined');
    }
  }

  /**
 * When ExpensesData file uploaded, will be called for loading new Expenses into
 */
function insertNewExpenses(tempExpensesData) {
  tempExpensesData.forEach(expenseRecord => {
    const tempKey = '' + expenseRecord.dateOfExpense + expenseRecord.expenseDescription + expenseRecord.expenseAmount + '';
    if (!expensesDataKeys.includes(tempKey)) {
      expensesDataCacheData.push(expenseRecord);
      expensesDataKeys.push(tempKey);
    } else {
      possibleDuplicateRecords = true;
      expensesDataCacheData.push(expenseRecord);
    }
  });
  expensesFileMessageEelement.innerHTML = "Successfully Uploaded Expenses Data File";
  expensesFileMessageEelement.hidden = false;
  expensesFileUploaded = true;
  checkWarnings();
}

window.onload = function() {

  const expensesDataString = localStorage.getItem(STORAGE_CONST.EXPENSES_LABEL);
  if (expensesDataString && expensesDataString.length > 0) {
    expensesDataCacheData = JSON.parse(expensesDataString);
    loadExpensesDataKeys();
    displayExepnsesData();
    expensesFileMessageEelement.innerHTML = "Successfully loaded Expenses Data From Cache";
    expensesFileMessageEelement.hidden = false;
    expensesFileUploaded = true;
  }
};

function csvToArray(str, delimiter = ",") {

  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  if (rows[rows.length - 1].trim() == "") {
    rows.splice(-1);
  }

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

function getTextLineFromExpense(item) {
  return [item.dateOfExpense,item.expenseDescription,item.expenseAmount].join(",");
}

function downloadFinalData() {
  const firstLine = 'dateOfExpense,expenseDescription,expenseAmount';
  var linesData = [firstLine, ...expensesDataCacheData.map(getTextLineFromExpense)];
  var fileName = "Expenses" + new Date().toISOString() + ".csv";
  downLoadFinalFile(linesData, fileName);
}

function downloadExpensesTemplate() {
  // dateOfExpense
  // expenseDescription
  // expenseAmount
  const firstLine = 'dateOfExpense,expenseDescription,expenseAmount';
  const secondLine = '2021-05-14,car petrol,2000.50';
  const rows = [firstLine, secondLine];

  downLoadFinalFile(rows, "expensesData.csv");
}

function downLoadFinalFile(rows, fileName) {
  let csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName);
  document.body.appendChild(link); // Required for FF

  link.click();
}

expensesForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const input = csvFileElement.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    const tempExpensesFileData = csvToArray(text);
    insertNewExpenses(tempExpensesFileData);
  };

  reader.readAsText(input);
});

function submitExpenseClickEvent() {
  // dateOfExpense,expenseDescription,expenseAmount
  const fields = ["newExpenseDate", "newExpenseDesc", "newExpenseAmount"];
  const newExpenseObj = {};
  fields.forEach(field => {
    const fieldElement = document.getElementById(field);
    if (fieldElement != null && fieldElement != undefined) {
      const fieldValue = fieldElement.value;
      if (field === "newExpenseDate" && fieldValue) {
        newExpenseObj.dateOfExpense = fieldValue;
      } else if (field === "newExpenseDesc" && fieldValue) {
        newExpenseObj.expenseDescription = fieldValue;
      } else if (field === "newExpenseAmount" && fieldValue) {
        newExpenseObj.expenseAmount = fieldValue;
      }
    }
  });
  expensesDataCacheData.push(newExpenseObj);
  hidePopupModal();
}

function displayExepnsesData() {
  var html = "<table border='1|1'>";
  html += "<tr>";
  html += "<th>" + "Expense Date" + "</th>";
  html += "<th>" + "Expense Description" + "</th>";
  html += "<th>" + "Expense Amount" + "</th>";
  html += "<th>" + " " + "</th>";
  html += "</tr>";
  var countH = 0;
  var amountToRecover = 0;
  // dateOfExpense
  // expenseDescription
  // expenseAmount
  expensesDataCacheData.forEach((element, index) => {
    if (element != undefined && element != null && element != "") {
      html += "<tr>";
      html += "<td>" + element.dateOfExpense + "</td>";
      html += "<td>" + element.expenseDescription + "</td>";
      html += "<td>" + element.expenseAmount + "</td>";
      html += "<td>" + "<a href='javascript:deleteExpenseRecord(" + JSON.stringify(element) + ", " + index + ")' >Delete Record</a>"  + "</td>";

      html += "</tr>";
      countH = countH + 1;
      amountToRecover = amountToRecover + +element.expenseAmount;
    }
      
  });
  html += "</table>";

  displaySection.innerHTML = html;
  totalNumberOfExpenses.innerHTML = "&nbsp; &nbsp; &nbsp; <b>Number Expenses: </b>" + "<b>" + countH + "</b>";
  totalExpenseAmount.innerHTML = "&nbsp; &nbsp; &nbsp; <b>Total Expense Amount: </b>" + "<b>" + amountToRecover + "</b>";
  localStorage.setItem(STORAGE_CONST.EXPENSES_LABEL, JSON.stringify(expensesDataCacheData));
}

function addExpenseClickEvent() {
  popupModalContentElement.style.display = "block";
}

function hidePopupModal() {
  const fields = ["newExpenseDate", "newExpenseDesc", "newExpenseAmount"];
  fields.forEach(field => {
    const fieldElement = document.getElementById(field);
    if (fieldElement != null && fieldElement != undefined) {
      fieldElement.value = null;
    }
  });
  popupModalContentElement.style.display = "none";
  displayExepnsesData();
}

function checkWarnings() {
  if (possibleDuplicateRecords) {
    alert("There might be possible Duplicate records, please verify");
  }
  displayExepnsesData();
}

function deleteExpenseRecord(stringfiedExpenseRec, index) {
  if (stringfiedExpenseRec) {
    var expenseRecordDel = {};
    var typeOfInput = typeof stringfiedExpenseRec;
    if (typeOfInput === 'object') {
      expenseRecordDel = stringfiedExpenseRec;
      deleteExpenseAtIndex(expenseRecordDel, index);
    } else if (typeOfInput === 'string') {
      try {
        expenseRecordDel = JSON.parse(stringfiedExpenseRec);
        deleteExpenseAtIndex(expenseRecordDel, index);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

function deleteExpenseAtIndex(expenseRecordDel, index) {
  var promptRes = confirm('Are you sure to delete record with Description: ' + expenseRecordDel.expenseDescription + ' on Date: ' + expenseRecordDel.dateOfExpense);

  if (promptRes) {
    if (JSON.stringify(expenseRecordDel) === JSON.stringify(expensesDataCacheData[index])) {
      expensesDataCacheData.splice(index, 1);
      displayExepnsesData();
    } else {
      var filteredRec = expensesDataCacheData.filter(element => {
        return (expenseRecordDel.expenseDescription === element.expenseDescription &&
          expenseRecordDel.dateOfExpense === element.dateOfExpense && expenseRecordDel.expenseAmount === element.expenseAmount);
      });
      if (filteredRec && filteredRec.length > 0) {
        expensesDataCacheData.splice(expensesDataCacheData.indexOf(filteredRec[0]), 1);
        displayExepnsesData();
      }
    }
  }
}