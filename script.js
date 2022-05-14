var main = document.querySelector('#main');

var list = Sortable.create(main, {
  group: 'list',
  sort: true,
  filter: '.add-card',
  draggable: '.list',
  ghostClass: "ghost",
  dragoverBubble: true,
});

function initContent() {
  var dropzones = document.querySelectorAll('.content');

  for (item of dropzones) {
    Sortable.create(item, {
      group: 'card',
      sort: true,
      draggable: '.card',
      ghostClass: "ghost",
    });
  }
}

initContent();

var inputs = document.querySelectorAll('textaread');

for (item of inputs) {
  item.addEventListener('blur', inputBlurHandler);
}

function inputBlurHandler(e) {
  this.classList.add('inactive');
  this.disabled = true;
  this.classList.remove('active');
  list.options.disabled = false;
}

var body = document.querySelector('body');

body.addEventListener('click', bodyClickHandler);

function bodyClickHandler(e) {
  elMouseLeaveHandler(e);
  var el = e.target;
  var isCard = el.classList.contains('card');
  var isTitle = el.classList.contains('title');
  var isInactive = el.classList.contains('inactive');
  var isEditable = el.classList.contains('editable');
  var editing = el.classList.contains('editing');
  
  if (isCard && isInactive) {
    list.options.disabled = true;
    el.disabled = false;
    el.classList.remove('inactive');
    el.classList.add('active');
    el.select();
  }
  
  if (isTitle && isInactive) {
    list.options.disabled = true;
    el.disabled = false;
    el.classList.remove('inactive');
    el.classList.add('active');
    el.select();
  }
  
  if (isEditable && !editing) {
    el.contentEditable = true;
    el.focus();
    document.execCommand('selectAll',false,null);
    el.addEventListener('blur', elBlurHandler);
    el.addEventListener('keypress', elKeypressHandler);
    el.classList.add('editing');
    
    if (el.parentElement.className === 'add-list') {
      el.parentElement.className = 'list initial';
    }
  }
}

function elKeypressHandler(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    e.target.blur();
  }
  
  var el = e.target;
  if (el.classList.contains('add-card')) {
    el.classList.add('pending'); 
  }

    
  if (el.parentElement.className === 'list initial') {
    el.parentElement.className = 'list pending';
  }
  
  // el.removeEventListener('keypress', elKeypressHandler);
}

function elBlurHandler(e) {
  var el = e.target;
  el.contentEditable = false;
  el.classList.remove('editing');
  
  if (el.classList.contains('pending')) {
    el.className = 'card removable editable';
    var newEl = document.createElement('div');
    newEl.className = 'add-card editable';
    var text = document.createTextNode('Add another card');
    newEl.appendChild(text);
    el.parentNode.appendChild(newEl);
    
    el.parentNode.querySelector('.content').appendChild(el);
  }
  
  if (el.parentElement.className === 'list initial') {
    el.parentElement.className = 'add-list';
  }
  
  if (el.parentElement.className === 'list pending') {
    el.parentElement.className = 'list';
    el.className = 'title removable editable';
    var newContent = document.createElement('div');
    newContent.className = 'content';
    el.parentElement.appendChild(newContent);
    
    var newEl = document.createElement('div');
    newEl.className = 'add-card editable';
    var text = document.createTextNode('Add another card');
    newEl.appendChild(text);
    el.parentNode.appendChild(newEl);
    
    document.querySelector('#main').appendChild(el.parentElement);
    
    initContent();
    
    var addList = document.createElement('div');
    addList.className = 'add-list';
    var title = document.createElement('div');
    title.className = 'title editable';
    var text = document.createTextNode('Add another list');
    title.appendChild(text);
    addList.appendChild(title);
    document.querySelector('body').appendChild(addList);
  }
  
  initDelete();
}

function initDelete() {
  var editables = document.querySelectorAll('.editable');

  for (item of editables) {
    item.addEventListener('mouseenter', elMouseEnterHandler);
    item.addEventListener('mouseleave', elMouseLeaveHandler);
  }
}

initDelete();

function elMouseEnterHandler(e) {
  var el = e.target;
  var isRemovable = el.classList.contains('removable');
  
  if (isRemovable) {
    var del = document.createElement('span');
    del.className = 'del';
    del.innerHTML = '&times;';
    el.appendChild(del);

    el.addEventListener('click', deleteHandler);
  }
}


function elMouseLeaveHandler(e) {
  var del = e.target.querySelector('span');
  if (del) e.target.removeChild(del);
}

function deleteHandler(e) {
  var parent = e.target.parentElement;
  
  if (parent.classList.contains('card')) {
    parent.parentElement.removeChild(parent);
  }
  
  if (parent.classList.contains('title')) {
    parent.parentElement.parentElement.removeChild(parent.parentElement);
  }
}