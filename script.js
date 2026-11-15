//SECTION 1: MOBILE MENU (works on every page)
   
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("open");
  });
}

//SECTION 2: STUDENT SYSTEM 
   
const studentForm = document.getElementById("student-form");

if (studentForm) {

  //DATA 

  let students = [];
  let nextId = 1;

 //2B. GRAB HTML ELEMENTS 

  const recordsBody = document.getElementById("records-body");
  const formMessage = document.getElementById("form-message");
  const searchInput = document.getElementById("search-input");
  const searchMessage = document.getElementById("search-message");

  const statTotal = document.getElementById("stat-total");
  const statPassed = document.getElementById("stat-passed");
  const statFailed = document.getElementById("stat-failed");
  const statAverage = document.getElementById("stat-average");
  const recordsSummary = document.getElementById("records-summary");

  const countExcellent = document.getElementById("count-excellent");
  const countVeryGood = document.getElementById("count-verygood");
  const countGood = document.getElementById("count-good");
  const countAverage = document.getElementById("count-average");
  const countFailed = document.getElementById("count-failed");

  //SECTION 3: PERFORMANCE
     
  function getPerformance(marks) {
    if (marks >= 80) {
      return "Excellent";
    } else if (marks >= 70) {
      return "Very Good";
    } else if (marks >= 60) {
      return "Good";
    } else if (marks >= 50) {
      return "Average";
    } else {
      return "Failed";
    }
  }

  function getPerformanceClass(label) {
    return label.toLowerCase().replace(" ", "-");
  }

  //SECTION 4: DISPLAY THE RECORDS TABLE

  function addCell(row, text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
  }

  function renderStudents(list) {
    recordsBody.innerHTML = "";

    if (list.length === 0) {
      recordsBody.innerHTML =
        '<tr><td colspan="7">No students found.</td></tr>';
      return;
    }

    for (let i = 0; i < list.length; i++) {
      const student = list[i];
      const label = getPerformance(student.marks);
      const row = document.createElement("tr");

      addCell(row, student.name);
      addCell(row, student.age);
      addCell(row, student.gender);
      addCell(row, student.course);
      addCell(row, student.marks);

      const performanceCell = document.createElement("td");
      performanceCell.innerHTML =
        '<span class="' + getPerformanceClass(label) + '">' + label + "</span>";
      row.appendChild(performanceCell);

      const actionsCell = document.createElement("td");
      actionsCell.innerHTML =
        '<input type="text" class="marks-input" placeholder="New" data-id="' + student.id + '">' +
        ' <button class="btn-update" data-id="' + student.id + '">Update</button>' +
        ' <button class="btn-delete" data-id="' + student.id + '">Delete</button>';
      row.appendChild(actionsCell);

      recordsBody.appendChild(row);
    }
  }

  //SECTION 5: SEARCH + STATISTICS + REFRESH
     

  // Returns the students to show: all of them, or only those
  // whose name contains the text typed in the search box.
  function getVisibleStudents() {
    const searchText = searchInput.value.trim().toLowerCase();

    if (searchText === "") {
      searchMessage.textContent = "";
      return students;
    }

    const matches = [];
    for (let i = 0; i < students.length; i++) {
      if (students[i].name.toLowerCase().includes(searchText)) {
        matches.push(students[i]);
      }
    }

    if (matches.length === 0) {
      searchMessage.textContent = "No matching student found.";
      searchMessage.className = "message error";
    } else {
      searchMessage.textContent = matches.length + " student(s) found.";
      searchMessage.className = "message success";
    }
    return matches;
  }

  // Statistics always use ALL students, not just search results.
  function updateStats() {
    let totalMarks = 0;
    let passed = 0;
    let failed = 0;
    let excellent = 0, veryGood = 0, good = 0, average = 0;

    for (let i = 0; i < students.length; i++) {
      const marks = students[i].marks;
      totalMarks = totalMarks + marks;

      if (marks >= 50) {
        passed++;
      } else {
        failed++;
      }

      const label = getPerformance(marks);
      if (label === "Excellent") excellent++;
      else if (label === "Very Good") veryGood++;
      else if (label === "Good") good++;
      else if (label === "Average") average++;
    }

    let averageMarks = 0;
    if (students.length > 0) {
      averageMarks = totalMarks / students.length;
    }

    statTotal.textContent = students.length;
    statPassed.textContent = passed;
    statFailed.textContent = failed;
    statAverage.textContent = averageMarks.toFixed(1);

    recordsSummary.textContent =
      "Total: " + students.length +
      " | Average: " + averageMarks.toFixed(1) +
      " | Passed: " + passed +
      " | Failed: " + failed;

    countExcellent.textContent = excellent;
    countVeryGood.textContent = veryGood;
    countGood.textContent = good;
    countAverage.textContent = average;
    countFailed.textContent = failed;
  }

  // Call this after EVERY change to the students array.
  function refresh() {
    renderStudents(getVisibleStudents());
    updateStats();
  }
console.log(countExcellent, countVeryGood, countGood, countAverage, countFailed);

  //SECTION 6: REGISTRATION FORM
    
  function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "message " + type;
  }

  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Step 1: read the values
    const name = document.getElementById("student-name").value.trim();
    const ageText = document.getElementById("student-age").value.trim();
    const gender = document.getElementById("student-gender").value;
    const course = document.getElementById("student-course").value;
    const marksText = document.getElementById("student-marks").value.trim();

    // Step 2: any field empty?
    if (name === "" || ageText === "" || gender === "" || course === "" || marksText === "") {
      showFormMessage("Please fill in all fields.", "error");
      return;
    }

    // Step 3: convert to numbers and validate
    const age = Number(ageText);
    const marks = Number(marksText);

    if (isNaN(age) || age <= 0) {
      showFormMessage("Please enter a valid age.", "error");
      return;
    }

    if (isNaN(marks) || marks < 0 || marks > 100) {
      showFormMessage("Marks must be a number between 0 and 100.", "error");
      return;
    }

    // Step 4: add the student object to the array
    students.push({
      id: nextId,
      name: name,
      age: age,
      gender: gender,
      course: course,
      marks: marks
    });
    nextId++;

    // Step 5: success message, clear the form, redraw
    showFormMessage("Student registered successfully!", "success");
    studentForm.reset();
    refresh();
  });

  //SECTION 7: DELETE + UPDATE MARKS
     
  recordsBody.addEventListener("click", function (event) {
    const clicked = event.target;
    const id = Number(clicked.dataset.id); // which student?

    // DELETE
    if (clicked.classList.contains("btn-delete")) {
      const sure = confirm("Are you sure you want to delete this student?");
      if (sure) {
        // keep every student whose id is NOT the one clicked
        students = students.filter(function (student) {
          return student.id !== id;
        });
        refresh();
      }
    }

    //UPDATE MARKS 
    if (clicked.classList.contains("btn-update")) {
      // the input is in the same cell as the button
      const marksInput = clicked.parentElement.querySelector(".marks-input");
      const newMarksText = marksInput.value.trim();
      const newMarks = Number(newMarksText);

      if (newMarksText === "" || isNaN(newMarks) || newMarks < 0 || newMarks > 100) {
        alert("Please enter new marks between 0 and 100.");
        return;
      }

      for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
          students[i].marks = newMarks;
        }
      }
      refresh();
    }
  });

  //SECTION 8: SEARCH EVENT
     
  // "input" fires on every keystroke, so results update as you type.
  searchInput.addEventListener("input", refresh);

  refresh(); // draw the empty table and zero stats on page load
}

//SECTION 9: CONTACT FORM (only runs on contact.html)
   
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const contactFeedback = document.getElementById("contact-feedback");

  function showContactMessage(text, type) {
    contactFeedback.textContent = text;
    contactFeedback.className = "message " + type;
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (fullName === "" || email === "" || subject === "" || message === "") {
      showContactMessage("Please fill in all fields.", "error");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showContactMessage("Please enter a valid email address.", "error");
      return;
    }

    if (message.length < 10) {
      showContactMessage("Your message must be at least 10 characters long.", "error");
      return;
    }

    showContactMessage("Thank you, your message has been sent.", "success");
    contactForm.reset();
  });
}