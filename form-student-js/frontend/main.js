const form = document.getElementById('create-student-form');
const inputName = document.getElementById('inputName');
const inputSurname = document.getElementById('inputSurname');
const inputLastname = document.getElementById('inputLastname');
const inputBirthDate = document.getElementById('inputBirthDate');
const inputStudyStart = document.getElementById('inputStudyStart');
const inputFaculty = document.getElementById('inputFaculty');
const btnForm = document.getElementById('btnForm');
const tbody = document.querySelector('.tbody');

function getMaxInputDate() {
  const now = new Date();
  inputStudyStart.max = now.getFullYear();
  inputBirthDate.max = `${now.getFullYear()}-0${now.getMonth() + 1}-0${now.getDay()}`;
}
getMaxInputDate();

function firstUpperLetter(str) {
  const lowerCase = str.trim().toLowerCase();
  const splitted = lowerCase.split('');
  const firstLetter = splitted[0].toUpperCase();
  splitted.splice(0, 1);
  return result = firstLetter + splitted.join('');
}

// функции взаимодействия с сервеои

const getData = async function (url) {
  const request = await fetch(url);
  let data = await request.json();
  return data;
}

const deleteData = async function (url) {
  fetch(url, {
    method: 'DELETE'
  });
}

const renderStudentList = async () => {
  let studentList = await getData('http://localhost:3000/api/students');

  studentList = studentList ? studentList : [];

  renderStudentsTable(studentList);
}
renderStudentList();

// функция удаления студента из таблицы
function deleteStudent(student, elem) {
  if (confirm('Удалить студента из базы данных?')) {
    elem.remove();
    deleteData(`http://localhost:3000/api/students/${student.id}`)
  }
}

// функции отрисовки таблицы
function getStudentItem(studentObj, index) {

  function getBdayAndAge(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    let fullDate = day + '.';
    if (month < 9) {
      fullDate = fullDate + 0;
    }
    fullDate = fullDate + (month + 1) + '.' + year;

    const today = new Date();
    const age = String(Math.floor((today.getTime() - date.getTime()) / 60000 / 60 / 24 / 365));

    let result = fullDate + ' (' + age;

    if (age.endsWith('0') || age.endsWith('5') || age.endsWith('6') || age.endsWith('7') || age.endsWith('8') || age.endsWith('9') || age.endsWith('11') || age.endsWith('12') || age.endsWith('13') || age.endsWith('14')) {
      result = result + ' лет)'
    } else if (age.endsWith('1')) {
      result = result + ' год)'
    } else {
      result = result + ' года)'
    }

    return result
  }

  function getYearsOfStudy(year) {
    startYear = year.getFullYear();
    endYear = startYear + 4;
    monthStart = year.getMonth();

    const curYear = new Date().getFullYear();
    const curMonth = new Date().getMonth();

    let course = '';
    if (curYear - startYear === 0 || (curYear - startYear === 1 && curMonth < monthStart)) {
      course = '(1 курс)';
    }
    else if (curYear - startYear === 1 || (curYear - startYear === 2 && curMonth < monthStart)) {
      course = '(2 курс)';
    }
    else if (curYear - startYear === 2 || (curYear - startYear === 3 && curMonth < monthStart)) {
      course = '(3 курс)';
    }
    else if (curYear - startYear === 3 || (curYear - startYear === 4 && curMonth < monthStart)) {
      course = '(4 курс)';
    } else {
      course = '(Закончил)';
    }

    return result = startYear + '-' + endYear + ' ' + course;
  }

  const rowTable = document.createElement('tr');
  const tNumber = document.createElement('th');
  tNumber.scope = 'row';
  tNumber.innerHTML = index + 1;
  const tFullName = document.createElement('td');
  const fullName = `${studentObj.surname} ${studentObj.name} ${studentObj.lastname}`
  tFullName.innerHTML = fullName;
  tFullName.tabIndex = '0';
  const tBday = document.createElement('td');
  tBday.innerHTML = getBdayAndAge(new Date(studentObj.birthday));
  const tYearsOfStudy = document.createElement('td');
  tYearsOfStudy.innerHTML = getYearsOfStudy(new Date(studentObj.studyStart));
  const tFaculty = document.createElement('td');
  tFaculty.innerHTML = studentObj.faculty;

  tbody.append(rowTable);
  rowTable.append(tNumber);
  rowTable.append(tFullName);
  rowTable.append(tBday);
  rowTable.append(tYearsOfStudy);
  rowTable.append(tFaculty);

  tFullName.addEventListener('click', () => deleteStudent(studentObj, rowTable))
}

function renderStudentsTable(studentsArray) {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  for (const each of studentsArray) {
    getStudentItem(each, studentsArray.indexOf(each))
  }
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const allInputs = form.querySelectorAll('input');

  for (const input of allInputs) {
    if (input.value.trim().length <= 0) {
      input.classList.add('is-invalid')
      input.classList.remove('border-secondary')
      input.value = '';
    } else {
      input.classList.remove('is-invalid')
      input.classList.add('border-secondary')
    }
  }

  const allInputsArr = Array.from(allInputs);

  if (allInputsArr.every((elem) => !elem.classList.contains('is-invalid'))) {
    const request = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      body: JSON.stringify({
        name: firstUpperLetter(inputName.value),
        surname: firstUpperLetter(inputSurname.value),
        lastname: firstUpperLetter(inputLastname.value),
        birthday: new Date(inputBirthDate.valueAsDate),
        studyStart: new Date(inputStudyStart.valueAsNumber, 8, 1),
        faculty: firstUpperLetter(inputFaculty.value),
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    renderStudentList()

    inputName.value = '';
    inputSurname.value = '';
    inputLastname.value = '';
    inputBirthDate.value = '';
    inputStudyStart.value = '';
    inputFaculty.value = '';
  }
})

// функции сортировки и фильтрации

async function sortStudents(prop1, prop2, prop3) {
  const data = await renderFilter();
  const result = data.sort((a, b) => a[prop1] === b[prop1] ? (a[prop2] < b[prop2] ? -1 : (a[prop3] < b[prop3] ? -1 : 1)) : (a[prop1] < b[prop1] ? -1 : 1));
  renderStudentsTable(result)
}

const thFullName = document.getElementById('th-full-name');
thFullName.addEventListener('click', () => sortStudents('surname', 'name', 'lastname'));

const thBday = document.getElementById('th-bday');
thBday.addEventListener('click', () => sortStudents('birthday'));

const thYearsStudy = document.getElementById('th-years-study');
thYearsStudy.addEventListener('click', () => sortStudents('studyStart'));

const thFaculty = document.getElementById('th-faculty');
thFaculty.addEventListener('click', () => sortStudents('faculty'));

async function renderFilter() {
  let filter = (arr, prop, value) => arr.filter(elem => String(elem[prop]).includes(value));

  let arr = await getData('http://localhost:3000/api/students');

  if (fioVal.value.trim() !== '') {
    for (let obj of arr) {
      obj.fio = `${obj.surname} ${obj.name} ${obj.lastname}`;
    }
    arr = filter(arr, 'fio', firstUpperLetter(fioVal.value));
  }
  if (fucVal.value.trim() !== '') arr = filter(arr, 'faculty', firstUpperLetter(fucVal.value));

  if (yStartVal.value.trim() !== '') arr = filter(arr, 'studyStart', firstUpperLetter(yStartVal.value));

  if (yEndVal.value.trim() !== '') {
    for (let obj of arr) {
      obj.yearEnd = new Date(obj.studyStart).getFullYear() + 4;
    }
    arr = filter(arr, 'yearEnd', firstUpperLetter(yEndVal.value))
  }

  renderStudentsTable(arr);

  return arr
}

const fioVal = document.getElementById('search-name');
fioVal.addEventListener('input', () => renderFilter('http://localhost:3000/api/students'));

const fucVal = document.getElementById('search-faculty');
fucVal.addEventListener('input', () => renderFilter('http://localhost:3000/api/students'));

const yStartVal = document.getElementById('search-year-start');
yStartVal.addEventListener('input', () => renderFilter('http://localhost:3000/api/students'));

const yEndVal = document.getElementById('search-year-end');
yEndVal.addEventListener('input', () => renderFilter('http://localhost:3000/api/students'));


