const fId = 'contactForm';
const sId = 'sendContactForm';
const otherSendId = 'sendOtherContactForm';
const endPoint = 'https://crisguille.pythonanywhere.com/api/v1/';
let formInit = false;
let widgetId = '';
/**
 * Initialize contact Form
 * @param { string } formId
 * @param { string } submitButton
 */
const initContactForm = (formId, submitButton, sendOther) => {
    try {
        const form = document.getElementById(formId);
        const submitBtn = window.document.getElementById(submitButton);
        const sendOhterBtn = window.document.getElementById(sendOther);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            return false;
        });

        //add event to buttonn
        submitBtn.addEventListener("click", () => { submitForm(form, submitBtn) });
        //add event to the back to the form
        sendOhterBtn.addEventListener("click", () => { form.reset(); showContactForm(); });
        //Init Tool Tips
        drawToolTips();
        console.log('Form INIT done');
        formInit = true;
    } catch (e) {
        console.log('errorrr not Init::', e);
        return false;
    }
    formInit = true;
}

/**
 * desc
 * @param { object } form
 * @param { * } btn
 * @returns bool
 */
const submitForm = async (form, btn) => {
    //console.log(form, btn);
    //Validate if is ok continue if not just return validateForm Will show the errors
    if (!validateForm(form)) return false;

    formShowLoading(btn);

    //Select all but not checked checkboxes
    const inputs = form.querySelectorAll('input:not([type="checkbox"]:not(:checked)), textarea');
    const jsonObject = {};
    let formData = new FormData();
    inputs.forEach((input) => {
        if (input.name.includes('cf-turnstile') || input.name == '') return;
        input.value = input.value.trim();
        formData.append(input.name, input.value);
    })

    // convert to json the elements of the form
    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }
    //Do the call to the server (server will manage the message)
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonObject)
        };
        const response = await fetch(endPoint + 'comments', requestOptions);

        if (response.ok) {
            const data = await response.json();
            console.log('Server Send Back:', data);
            showContactResponse();
        } else {
            throw new Error('Server Error ' + response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    //Button enabled
    formHideLoading(btn);
    return true;
}

/**
 * Show loading and hide button
 * @param { object } btn
 */
const formShowLoading = (btn) => {
    btn.disabled = true;
    btn.style.display = "none";
    let nextSibling = btn.nextSibling; // get the next sibling node
    while (nextSibling && nextSibling.nodeName !== 'I') {
        nextSibling = nextSibling.nextSibling; // iterate through the next sibling nodes
    }
    const loadingIcon = nextSibling;
    loadingIcon.style.display = 'block';
}
/**
 * Hide loading and show button
 * @param { object } btn
 */
const formHideLoading = (btn) => {
    btn.disabled = false;
    btn.style.display = "block";
    let nextSibling = btn.nextSibling; // get the next sibling node
    while (nextSibling && nextSibling.nodeName !== 'I') {
        nextSibling = nextSibling.nextSibling; // iterate through the next sibling nodes
    }
    const loadingIcon = nextSibling;
    loadingIcon.style.display = 'none';
}
/**
 * Show the form success mesage
 */
const showContactResponse = () => {
    const rotateSection = document.querySelector('section.rotation');
    rotateSection.classList.add('active');
}
/**
 * Show form and hide success mesage
 */
const showContactForm = () => {
    const rotateSection = document.querySelector('section.rotation.active');
    rotateSection.classList.remove('active');
}
/**
 * Validate the form
 * @param { object } form
 */
const validateForm = (form) => {
    let validated = true;
    //Reset fields first
    resetErrors(form);
    //first check all fields 
    //then check turnstile
    console.log(typeof turnstile.getResponse(widgetId), turnstile.getResponse(widgetId));
    if (typeof turnstile.getResponse(widgetId) == 'undefined') return false;
    console.log('continue validations')
    //get all the inputs
    const inputs = form.querySelectorAll('input:not([type="button"]), textarea');
    //Loop and trim all the values before validate
    //trim all eccept cf_
    inputs.forEach((input) => {
        if (input.name.includes('cf-turnstile') || input.name == '') return;
        input.value = input.value.trim();
    })

    const tobeValidatedObject = [];
    const inputsRequired = form.querySelectorAll('[required],[data-valtype]');
    inputsRequired.forEach((input) => {
        input.value = input.value.trim();
        //save in the object if the field is valid or not
        let validation = validField(input)
        tobeValidatedObject.push({ 'input': input, 'valid': validation });
        //if one is false set false. Start with true, so if all ok will be true if at least one is false will be false
        //console.log(' tested::' ,input);
        validated = (validation === false) ? false : validated;
    })

    //console.log('tobeValidatedObject', tobeValidatedObject);
    //now if is not valid then show errors
    if (false === validated) {
        showErrors(tobeValidatedObject);
    }

    return validated;
}

/**
 * Remove error class
 * @param  {form}  form
 */
const resetErrors = (form) => {
    form.querySelectorAll('.error').forEach((input) => {
        input.classList.remove('error');
    });
}

/**
 * Display errors add error class and focus on first error
 * @param { * } dataFields
 */
const showErrors = (dataFields) => {
    let focused = false;
    dataFields.forEach((data, idx) => {
        if (data.valid === false) {
            data.input.classList.add('error');
            if (focused === false) {
                data.input.focus();
                focused = true;
                //console.log( data.input);
            }
        }
    })
}

/**
 * add tooltips from form data
 */
const drawToolTips = () => {
    // Get all the inputs with data-tooltip attribute
    const inputs = document.querySelectorAll('input[data-tooltip],textarea[data-tooltip]');

    // Loop through each input and add event listeners
    inputs.forEach((input) => {
        // Create a tooltip element
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.classList.add(input.type);

        tooltip.textContent = input.dataset.tooltip;
        input.parentNode.insertBefore(tooltip, input.nextSibling);

        // Show the tooltip when the input is focused or hovered
        input.addEventListener('focus', () => {
            tooltip.style.display = 'block';
        });
        input.addEventListener('blur', () => {
            tooltip.style.display = 'none';
        });
        input.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
        });
        input.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });
}

//Different validations
const validField = (elem) => {
    let validation = false;
    console.log(elem.type)
    const isRequired = elem.required;
    try {
        switch (elem.type) {
            case 'checkbox':
                //if is checkbox need to know if is checked, just this
                validation = elem.checked; //we validate if is required
                break;
            default:
                //here see the dataset.valtype and call dynamicaly the validation type functio
                //This allow add more data types to validate
                const valFunction = `val${elem.dataset.valtype}`;
                //console.log(valFunction, elem.getAttribute('maxlength'))
                try {
                    validation = (elem.getAttribute('maxlength') > 0) ?
                        window[valFunction](elem.value, isRequired, elem.getAttribute('maxlength')) :
                        window[valFunction](elem.value, isRequired);
                }
                catch (e) {
                    //if there is some error here set validation to false like valFunction not defined
                    validation = false;
                    console.error('Error valid Field::', e);
                }

                break;
        }
    }
    catch (e) {
        //on error return false
        console.error('Validation error::', e);
    }
    return validation;
}

//validation Functions can not use arrows because need in window object
//args could be input value, required attr and data max leng optional
function valNotEmpty(...args) {

    let valid = false;
    if (args.length < 2) return false; // need arguemnts at least 2 but not empty is same with or without required

    if (args[0].length > 0 &&
        (args.length == 2 ||
            (args.length == 3 && (args[2] == null || args[0].length <= parseInt(args[2]))
            )
        )
    ) {
        valid = true;
    }

    return valid;
}

//Valid Formats
//(123x) 456-7890xx
//(123x)456-7890xx
//123x-456-7890xx
//123x4567890xx
function valPhone(...args) {
    if (args.length == 0) return false; // need arguemnts

    let valid = true;
    //if required or have some value
    if (args[1] === true || args[0] != '') {
        var phoneRegex = /^\(?(\d{3,4})\)?[- ]?(\d{3})[- ]?(\d{4,})$/;
        valid = phoneRegex.test(args[0]);
    }

    return valid;
}

//Email standard format specified by RFC 5322
function valEmail(...args) {
    if (args.length == 0) return false; // need arguemnts
    let valid = true;
    if (args[1] === true || args[0] != '') {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        valid = emailRegex.test(args[0]);
    }

    return valid;
}

//Turnstile initialization
window.onloadTurnstileCallback = function () {
    widgetId = turnstile.render('.tWidget', {
        sitekey: '0x4AAAAAAADuMf6idoUbw75c',
        callback: function (token) {
            console.log(`Challenge Success ${token}`);
        },
    });
    console.log(widgetId);
};

//init when page is ready
//On load works on the net domcontent loaded not
window.onload = function () {
    console.log('init with window on load', formInit);
    if (formInit === false) {
        initContactForm(fId, sId, otherSendId);
    }
}

document.onreadystatechange = function () {
    console.log("The document State:: " + document.readyState, formInit);
    if (document.readyState == 'interactive' && formInit === false) {
        console.log('init on interactive :: ' + document.readyState)
        initContactForm(fId, sId, otherSendId);
    }
    if (document.readyState == 'complete' && formInit === false) {
        //then initi on complete state
        console.log('init on complete:: ' + document.readyState, formInit)
        initContactForm(fId, sId, otherSendId);
    }
}