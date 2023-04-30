/**Actions to ad to the section for onclick */
let menuInit=false;

const initMenuLinks = ()=>{
    let foundElems = document.querySelectorAll('.grid3elm > section');
    foundElems.forEach(element => {
        console.log(element);
        //now found the a
        let aElem = element.querySelector('a');
        console.log(aElem.href);
        if(typeof aElem.href !== 'undefined'){
            element.addEventListener("click", () => { location.href=aElem.href });
        }
    }); 
}

document.onreadystatechange = function() {
    console.log("The document State:: " + document.readyState);
    if( document.readyState == 'interactive'){
        console.log('init on :: '+document.readyState)
        console.log(document.querySelectorAll('.grid3elm > section'))
        initMenuLinks();
        menuInit=true;
    }
    if( document.readyState == 'complete' && menuInit === false){
        //then initi on complete state
        console.log('init on :: '+document.readyState)
        console.log(document.querySelectorAll('.grid3elm > section'))
        initMenuLinks();
        menuInit=true;
    }
  }