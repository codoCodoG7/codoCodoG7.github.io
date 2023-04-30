let menuType = '';
const endPoint = 'https://crisguille.pythonanywhere.com/api/v1';
//const endPoint = 'http://127.0.0.1:5000/api/v1';
const noImage = '';
let originalItem = null;
let itemsContainer = null;
let msgContainer = null;
let initMenuItems = false;
const errorMsg = "Por favor intente nuevamente en unos minutos";

const intMenuItems = (containerId, cloneItemId,msgContainerId) => {
  // Obtener el elemento original y el contenedor donde se insertará
   originalItem = document.getElementById(cloneItemId);
   itemsContainer = document.getElementById(containerId);
   if(typeof msgContainerId != null){
    msgContainer = document.getElementById(msgContainerId);
   }
   
}

const getMenuItems = async (mType) => {
  try {
    const eMType = encodeURIComponent(mType)
    const response = await fetch(endPoint + '/menuTypeItems/' + eMType);
    
    hideErrorMesg();

    if (response.ok) {
      const menuData = await response.json();
      console.log('Server Send Back:', menuData);
      hideLoading();
      
      //Draw server response
      menuData.forEach(mItem => {
        //console.log(mItem);
        drawItem(mItem);
      });
    } else {
      throw new Error('Server Error ' + response.status);
    }
  } catch (error) {
    console.error('Error fetching menu data:', error);
    showErrorMesg();
  }
}

const drawItem = (item) => {
  // Clone original Item
  const newItem = originalItem.cloneNode(true);
  //changeId
  newItem.setAttribute('id', 'menuItemType-'+item.id);
  // Change content
  newItem.querySelector(".burgerTitle").textContent = item.name;
  newItem.querySelector(".burgerDesc").textContent = item.description;
  newItem.querySelector(".burgerPrice").textContent = '$'+item.price;

  newItem.querySelector("img").src = (typeof item.image != 'undefined' && item.image != '')  ? item.image : noImage;
  newItem.querySelector("img").setAttribute('alt', item.name);

  // Add to the container
  itemsContainer.appendChild(newItem);
}

const showErrorMesg = ()=>{
  if(null != msgContainer){
    msgContainer.innerHTML = '';
    msgContainer.insertAdjacentHTML('beforeend', errorMsg);
    document.querySelector('div.loading i.bx.customRed').style.display='none';
  }
}

const hideErrorMesg = ()=>{
  if(null != msgContainer){
    msgContainer.innerHTML = '';
  }
}

const hideLoading = ()=>{
  hideErrorMesg();
  document.querySelector('div.loading').style.display='none'
}