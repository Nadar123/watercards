/*FORM VALIDATION*/
const form = document.getElementById('form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
let formValidationSuccessFlag = true;

form.addEventListener('submit', e => {
	e.preventDefault();
  if( checkInputs() ){
    submitForm()
  }
	e.target.reset();
});

function checkInputs() {

	const firstNameValue = firstName.value.trim();
	const lastNameValue = lastName.value.trim();
	const emailValue = email.value.trim();
  formValidationSuccessFlag = true;

	if (firstNameValue === '') {
    
		setErrorFor(firstName, 'First Name cannot be blank');
	} else if (!isValidName(firstNameValue)) {
		setErrorFor(firstName, 'Only 2 to 70 letters characters.');
	}
	else {
		setSuccessFor(firstName);
	}

	if (lastNameValue === '') {
		setErrorFor(lastName, 'Last Name cannot be blank');
	} else if (!isValidName(lastNameValue)) {
		setErrorFor(lastName, 'Only 2 to 70 letters characters.');
	}
	else {
		setSuccessFor(lastName);
	}

	if (emailValue === '') {
		setErrorFor(email, 'Email cannot be blank');
	} else if (!isEmail(emailValue)) {
		setErrorFor(email, 'Not a valid email');
	} else {
		setSuccessFor(email);
	}
  return formValidationSuccessFlag;
}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
  formValidationSuccessFlag = false;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}

function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function isValidName(string) {
	if (typeof string !== "string" || 
  string.length < 2 || string.length > 70 
    || /[^A-Za-z]+/g.test(string))
    
		return false;
	return true;
}

/*MODAL*/
const clickBtn = document.getElementById("clickBtn");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");

function submitForm(){

	popup.style.display = 'block';
	const sectionPopupWrapper = document.querySelector('.js-pop-up');
	renderDynamicPopupContent();
}

closeBtn.addEventListener('click', () => {
	popup.style.display = 'none';
});
popup.addEventListener('click', () => {
	popup.style.display = 'none';
});

function renderDynamicPopupContent() {
	const firstNamePopupWrapper = document.querySelector('.firstName');
	const firstName = firstNamePopupWrapper.value
	const lastNamPopupWrapper = document.querySelector('.lastName');
	const lastName = lastNamPopupWrapper.value

	let elTitle = document.querySelector('.js-popup-title')
	elTitle.innerHTML = `${firstName} ${lastName}, you ordered`;
}

/*PAYMENT FLOW*/
let products = [];

const allWater = document.querySelectorAll('.price-wrapper');
allWater.forEach(water => {
	water.querySelector('.water-total').textContent = '$ 0.00';
});

allWater.forEach((water, index) => {
	water.addEventListener('click', (event) => {
		if (event.target.classList.contains('order-dec') || 
      event.target.parentElement.classList.contains('order-dec')) {
			changeOrder(water, 'dec');
		}
		
		if (event.target.classList.contains('order-inc') || 
      event.target.parentElement.classList.contains('order-inc')) {
			changeOrder(water, 'inc');
		}
	});
});

 
function changeOrder(water, changeType) {
	let waterQuan = parseInt(water.querySelector('.order-val').textContent);
	let waterPrice = parseFloat(water.querySelector('.water-rate').getAttribute('data-price').replace(/[^\d.-]/g, ''));

	if (changeType === 'dec' && waterQuan > 0) waterQuan--;
	if (changeType === 'inc') waterQuan++;

	let price = waterPrice * waterQuan;

	water.querySelector('.order-val').textContent = waterQuan;
	water.querySelector('.water-total').textContent = `$ ${(price).toFixed(2)}`;

  updateCard(water,waterQuan,waterPrice);

  renderTotalCart();
}

function updateCard(water,qty,price){
  const waterParent = water.parentElement;
  const productID = waterParent.getAttribute('data-id');
  const existProduct = products.findIndex( (product) => product.id === productID )
  if( qty > 0 ){    
    if( existProduct === -1 ){
      products.push({
        id: productID,
        title: waterParent.querySelector('.title').textContent,
        qty: qty,
        price: price
      })
    } else{
      products[existProduct]['qty'] = qty;
      products[existProduct]['price'] = price;
    }
  } else{
    if( existProduct !== -1 ){
      products.splice(existProduct,1);
    }
  }
}

function renderTotalCart(){
  const totalPrice = products.reduce( (acc, product) => acc += product.qty * product.price, 0 )

	var elementTotalPrice = document.querySelector('.checkout-total-amount')
	elementTotalPrice.innerText = `$ ${(totalPrice).toFixed(2)}`;

  const billInfo = document.querySelector('.bill-info-wrapper');
  const popupProductList = document.querySelector('#popup .product-list');
  const checkout = document.querySelector('.checkout-wrapper');

  billInfo.querySelectorAll('.product-item').forEach( node => {
    if( ! node.classList.contains('template') ){
      node.remove();
    }
  });

  popupProductList.querySelectorAll('.product-item').forEach( node => {
    if( ! node.classList.contains('template') ){
      node.remove();
    }
  });

  products.forEach( product => {
    let productWrapper = billInfo.querySelector('.template').cloneNode(true)
    let productWrapperForPopup = popupProductList.querySelector('.template').cloneNode(true)

    productWrapper.className = 'product-item';
    productWrapperForPopup.className = 'product-item';
    
    productWrapper.querySelector('.bottle-pack').innerHTML = product.title
    productWrapper.querySelector('.amount-wrapper').innerHTML = product.qty
	
    productWrapperForPopup.querySelector('.title').innerHTML = product.title
    productWrapperForPopup.querySelector('.qty').innerHTML = `${product.qty} Packs of `;

    billInfo.appendChild( productWrapper );
    popupProductList.appendChild( productWrapperForPopup );
  })
}