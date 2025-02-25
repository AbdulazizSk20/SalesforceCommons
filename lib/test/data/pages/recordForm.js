document.addEventListener('input', function (event) {
  var container = document.querySelector('.custom-picklist-container');
  var dropdown = container.querySelector('.dropdown-list');
  var input = container.querySelector('.filterable-input');
  var items = container.querySelectorAll('.dropdown-list-item');
  var filterValue = input.value.toUpperCase();
  setStyleOnValue(items,filterValue,dropdown,input);
});

document.addEventListener('click', function (event) {
  var selectedItem = event.target.closest('.dropdown-list-item');
  if (selectedItem) {
    var value = selectedItem.getAttribute('value');
    document.querySelector('.filterable-input').value = value;
    document.querySelector('.dropdown-list').style.display = 'none';
  }
});

document.addEventListener('click', function (event) {
  var container = document.querySelector('.custom-picklist-container');
  if (!container.contains(event.target)) {
    document.querySelector('.dropdown-list').style.display = 'none';
  }
});

document.addEventListener('input', function (event) {
  var container = document.querySelector('.custom-picklist-container1');
  var dropdown = container.querySelector('.dropdown-list1');
  var input = container.querySelector('.filterable-input1');
  var items = container.querySelectorAll('.dropdown-list-item1');
  var filterValue = input.value.toUpperCase();
  setStyleOnValue(items,filterValue,dropdown,input);
});

document.addEventListener('click', function (event) {
  var selectedItem = event.target.closest('.dropdown-list-item1');
  if (selectedItem) {
    var value = selectedItem.getAttribute('value');
    document.querySelector('.filterable-input1').value = value;
    document.querySelector('.dropdown-list1').style.display = 'none';
  }
});

document.addEventListener('input', function (event) {
  var container = document.querySelector('.custom-picklist-container2');
  var dropdown = container.querySelector('.dropdown-list2');
  var input = container.querySelector('.filterable-input2');
  var items = container.querySelectorAll('.dropdown-list-item2');
  var filterValue = input.value.toUpperCase();
  setStyleOnValue(items,filterValue,dropdown,input);
});

document.addEventListener('click', function (event) {
  var selectedItem = event.target.closest('.dropdown-list-item2');
  if (selectedItem) {
    var value = selectedItem.getAttribute('value');
    document.querySelector('.filterable-input2').value = value;
    document.querySelector('.dropdown-list2').style.display = 'none';
  }
});

document.addEventListener('input', function (event) {
  var container = document.querySelector('.custom-picklist-container3');
  var dropdown = container.querySelector('.dropdown-list3');
  var input = container.querySelector('.filterable-input3');
  var items = container.querySelectorAll('.dropdown-list-item3');
  var filterValue = input.value.toUpperCase();
  setStyleOnValue(items,filterValue,dropdown,input);
});

document.addEventListener('click', function (event) {
  var selectedItem = event.target.closest('.dropdown-list-item3');
  if (selectedItem) {
    var value = selectedItem.getAttribute('value');
    document.querySelector('.filterable-input3').value = value;
    document.querySelector('.dropdown-list3').style.display = 'none';
  }
});

document.addEventListener('input', function (event) {
  var container = document.querySelector('.custom-picklist-container4');
  var dropdown = container.querySelector('.dropdown-list4');
  var input = container.querySelector('.filterable-input4');
  var items = container.querySelectorAll('.dropdown-list-item4');
  var filterValue = input.value.toUpperCase();
  setStyleOnValue(items,filterValue,dropdown,input);
});

document.addEventListener('click', function (event) {
  var selectedItem = event.target.closest('.dropdown-list-item4');
  if (selectedItem) {
    var value = selectedItem.getAttribute('value');
    document.querySelector('.filterable-input4').value = value;
    document.querySelector('.dropdown-list4').style.display = 'none';
  }
});

function setStyleOnValue(items,filterValue,dropdown,input){
  items.forEach(function (item) {
    var itemValue = item.getAttribute('value').toUpperCase();
    itemValue.includes(filterValue) ? item.style.display = 'block' : item.style.display = 'none';
  });
  document.activeElement === input ? dropdown.style.display = 'block' : dropdown.style.display = 'none';
}