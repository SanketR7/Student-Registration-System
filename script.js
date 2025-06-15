let students = [];
let editingIndex = -1;

document.addEventListener("DOMContentLoaded", function () {
  loadStudentsFromStorage();
  displayStudents();

  document
    .getElementById("studentForm")
    .addEventListener("submit", handleFormSubmit);
  document
    .getElementById("editForm")
    .addEventListener("submit", handleEditSubmit);

  addValidationListeners();
});

function addValidationListeners() {
  ["studentName", "studentId", "email", "contactNo"].forEach((id) => {
    document
      .getElementById(id)
      .addEventListener("blur", () => validateField(id));
  });

  ["editStudentName", "editStudentId", "editEmail", "editContactNo"].forEach(
    (id) => {
      document
        .getElementById(id)
        .addEventListener("blur", () => validateEditField(id));
    }
  );
}

// ✅ Use localStorage
function loadStudentsFromStorage() {
  const stored = localStorage.getItem("students");
  if (stored) students = JSON.parse(stored);
}

function saveStudentsToStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function handleFormSubmit(e) {
  e.preventDefault();

  if (validateForm()) {
    const formData = new FormData(e.target);
    const student = {
      name: formData.get("studentName").trim(),
      id: formData.get("studentId").trim(),
      email: formData.get("email").trim(),
      contact: formData.get("contactNo").trim(),
    };

    if (students.some((s) => s.id === student.id)) {
      showMessage(
        "Student ID already exists. Please use a different ID.",
        "error"
      );
      return;
    }

    students.push(student);
    saveStudentsToStorage();
    displayStudents();
    clearForm();
    showMessage("Student registered successfully!", "success");
  }
}

function handleEditSubmit(e) {
  e.preventDefault();

  if (validateEditForm()) {
    const student = {
      name: document.getElementById("editStudentName").value.trim(),
      id: document.getElementById("editStudentId").value.trim(),
      email: document.getElementById("editEmail").value.trim(),
      contact: document.getElementById("editContactNo").value.trim(),
    };

    if (
      students.some((s, index) => s.id === student.id && index !== editingIndex)
    ) {
      showMessage(
        "Student ID already exists. Please use a different ID.",
        "error"
      );
      return;
    }

    students[editingIndex] = student;
    saveStudentsToStorage();
    displayStudents();
    closeEditModal();
    showMessage("Student record updated successfully!", "success");
  }
}

function validateForm() {
  return ["studentName", "studentId", "email", "contactNo"].every(
    validateField
  );
}

function validateEditForm() {
  return [
    "editStudentName",
    "editStudentId",
    "editEmail",
    "editContactNo",
  ].every(validateEditField);
}

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  field.classList.remove("error");

  if (!value) {
    errorMessage = getFieldLabel(fieldId) + " is required";
    isValid = false;
  } else {
    switch (fieldId) {
      case "studentName":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          errorMessage = "Name should contain only letters and spaces";
          isValid = false;
        }
        break;
      case "studentId":
        if (!/^\d+$/.test(value)) {
          errorMessage = "Student ID should contain only numbers";
          isValid = false;
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Please enter a valid email address";
          isValid = false;
        }
        break;
      case "contactNo":
        if (!/^\d{10}$/.test(value)) {
          errorMessage = "Contact number should be exactly 10 digits";
          isValid = false;
        }
        break;
    }
  }

  const errorElement = getErrorElement(fieldId);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.style.display = isValid ? "none" : "block";
  }

  if (!isValid) field.classList.add("error");

  return isValid;
}

function validateEditField(fieldId) {
  const field = document.getElementById(fieldId);
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  field.classList.remove("error");

  if (!value) {
    errorMessage = getFieldLabel(fieldId) + " is required";
    isValid = false;
  } else {
    switch (fieldId) {
      case "editStudentName":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          errorMessage = "Name should contain only letters and spaces";
          isValid = false;
        }
        break;
      case "editStudentId":
        if (!/^\d+$/.test(value)) {
          errorMessage = "Student ID should contain only numbers";
          isValid = false;
        }
        break;
      case "editEmail":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Please enter a valid email address";
          isValid = false;
        }
        break;
      case "editContactNo":
        if (!/^\d{10}$/.test(value)) {
          errorMessage = "Contact number should be exactly 10 digits";
          isValid = false;
        }
        break;
    }
  }

  const errorElement = getEditErrorElement(fieldId);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.style.display = isValid ? "none" : "block";
  }

  if (!isValid) field.classList.add("error");

  return isValid;
}

function getFieldLabel(fieldId) {
  const labels = {
    studentName: "Student name",
    studentId: "Student ID",
    email: "Email",
    contactNo: "Contact number",
    editStudentName: "Student name",
    editStudentId: "Student ID",
    editEmail: "Email",
    editContactNo: "Contact number",
  };
  return labels[fieldId] || "Field";
}

// ✅ FIXED: Correct error ID mapping for edit form
function getErrorElement(fieldId) {
  const errorIds = {
    studentName: "nameError",
    studentId: "idError",
    email: "emailError",
    contactNo: "contactError",
  };
  return document.getElementById(errorIds[fieldId]);
}

function getEditErrorElement(fieldId) {
  const errorIds = {
    editStudentName: "editNameError",
    editStudentId: "editIdError",
    editEmail: "editEmailError",
    editContactNo: "editContactError",
  };
  return document.getElementById(errorIds[fieldId]);
}

function displayStudents() {
  const tableBody = document.getElementById("studentTableBody");
  const emptyState = document.getElementById("emptyState");
  const table = document.getElementById("studentTable");

  if (students.length === 0) {
    table.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  table.style.display = "table";
  emptyState.style.display = "none";

  tableBody.innerHTML = students
    .map(
      (student, index) => `
      <tr>
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.id)}</td>
        <td>${escapeHtml(student.email)}</td>
        <td>${escapeHtml(student.contact)}</td>
        <td>
          <button class="btn btn-edit" onclick="editStudent(${index})">✏️ Edit</button>
          <button class="btn btn-delete" onclick="deleteStudent(${index})">🗑️ Delete</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function editStudent(index) {
  editingIndex = index;
  const student = students[index];

  document.getElementById("editStudentName").value = student.name;
  document.getElementById("editStudentId").value = student.id;
  document.getElementById("editEmail").value = student.email;
  document.getElementById("editContactNo").value = student.contact;

  clearEditFormErrors();
  document.getElementById("editModal").style.display = "block";
}

function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student record?")) {
    students.splice(index, 1);
    saveStudentsToStorage();
    displayStudents();
    showMessage("Student record deleted successfully!", "success");
  }
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  editingIndex = -1;
  document.getElementById("editForm").reset();
  clearEditFormErrors();
}

function clearForm() {
  document.getElementById("studentForm").reset();
  clearFormErrors();
}

function clearFormErrors() {
  ["nameError", "idError", "emailError", "contactError"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
      el.textContent = "";
    }
  });

  ["studentName", "studentId", "email", "contactNo"].forEach((id) => {
    const field = document.getElementById(id);
    if (field) field.classList.remove("error");
  });
}

function clearEditFormErrors() {
  [
    "editNameError",
    "editIdError",
    "editEmailError",
    "editContactError",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
      el.textContent = "";
    }
  });

  ["editStudentName", "editStudentId", "editEmail", "editContactNo"].forEach(
    (id) => {
      const field = document.getElementById(id);
      if (field) field.classList.remove("error");
    }
  );
}

function showMessage(message, type) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
  messageElement.style.display = "block";

  setTimeout(() => {
    messageElement.style.display = "none";
  }, 5000);
}

window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeEditModal();
  }
};
/**
 * Show a specific section and reload students if viewing records
 */
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("hidden");
  });

  // Show the selected section
  const section = document.getElementById(`${sectionId}-section`);
  if (section) {
    section.classList.remove("hidden");

    // If viewing records, reload from storage and display
    if (sectionId === "records") {
      loadStudentsFromStorage();
      displayStudents();
    }
  }
}
