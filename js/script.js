// Generar fondo de números binarios
function generateBinaryBackground() {
    const binary = document.getElementById('binary');
    const width = window.innerWidth;
    const height = window.innerHeight;
    const columns = Math.floor(width / 15);
    const rows = Math.floor(height / 20);
    
    let content = '';
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            content += Math.random() > 0.5 ? '1' : '0';
        }
        content += '<br>';
    }
    
    binary.innerHTML = content;
}

generateBinaryBackground();
window.addEventListener('resize', generateBinaryBackground);

// Cada 2 segundos actualizar algunos números aleatorios del fondo
setInterval(() => {
    const binary = document.getElementById('binary');
    const text = binary.innerHTML;
    let newText = '';
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '0' || text[i] === '1') {
            if (Math.random() < 0.1) {
                newText += Math.random() > 0.5 ? '1' : '0';
            } else {
                newText += text[i];
            }
        } else {
            newText += text[i];
        }
    }
    
    binary.innerHTML = newText;
}, 2000);

// Cambiar tabs
document.getElementById('tab-basic').addEventListener('click', () => {
    document.getElementById('tab-basic').classList.add('active');
    document.getElementById('tab-complete').classList.remove('active');
    document.getElementById('content-basic').classList.add('active');
    document.getElementById('content-complete').classList.remove('active');
});

document.getElementById('tab-complete').addEventListener('click', () => {
    document.getElementById('tab-complete').classList.add('active');
    document.getElementById('tab-basic').classList.remove('active');
    document.getElementById('content-complete').classList.add('active');
    document.getElementById('content-basic').classList.remove('active');
});

// Formatear número de tarjeta con espacios cada 4 dígitos
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    input.value = formattedValue;
    detectCardType(formattedValue.replace(/\s+/g, ''));
}

// Formatear fecha de expiración con formato MM/AA
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        value = value.match(new RegExp('.{1,2}', 'g')).join('/');
        if (value.length > 5) {
            value = value.substring(0, 5);
        }
    }
    
    input.value = value;
}

// Detectar tipo de tarjeta según el número
function detectCardType(number) {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;
    const amexRegex = /^3[47]/;
    const discoverRegex = /^6(?:011|5)/;
    
    document.getElementById('visa-icon').classList.remove('detected');
    document.getElementById('mastercard-icon').classList.remove('detected');
    document.getElementById('amex-icon').classList.remove('detected');
    document.getElementById('discover-icon').classList.remove('detected');
    
    if (visaRegex.test(number)) {
        document.getElementById('visa-icon').classList.add('detected');
        return 'visa';
    } else if (mastercardRegex.test(number)) {
        document.getElementById('mastercard-icon').classList.add('detected');
        return 'mastercard';
    } else if (amexRegex.test(number)) {
        document.getElementById('amex-icon').classList.add('detected');
        return 'amex';
    } else if (discoverRegex.test(number)) {
        document.getElementById('discover-icon').classList.add('detected');
        return 'discover';
    }
    
    return 'unknown';
}

// Validar número de tarjeta usando algoritmo de Luhn
function validateCardNumber(number) {
    // Eliminar espacios y caracteres no numéricos
    number = number.replace(/\D/g, '');
    
    if (number.length < 13 || number.length > 19) {
        return false;
    }
    
    let sum = 0;
    let doubleUp = false;
    
    // Proceso desde la derecha a la izquierda
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (doubleUp) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        doubleUp = !doubleUp;
    }
    
    return (sum % 10) === 0;
}

// Validar fecha de expiración
function validateExpiry(expiry) {
    if (!/^\d\d\/\d\d$/.test(expiry)) {
        return false;
    }
    
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    // Validar mes
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validar que la fecha no sea del pasado
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        return false;
    }
    
    return true;
}

// Validar CVV
function validateCVV(cvv, cardType) {
    const cvvLength = cardType === 'amex' ? 4 : 3;
    return cvv.length === cvvLength && /^\d+$/.test(cvv);
}

// Aplicar formateo a los inputs
const cardNumberBasic = document.getElementById('card-number-basic');
const cardNumberComplete = document.getElementById('card-number-complete');
const cardExpiry = document.getElementById('card-expiry');

cardNumberBasic.addEventListener('input', () => formatCardNumber(cardNumberBasic));
cardNumberComplete.addEventListener('input', () => formatCardNumber(cardNumberComplete));
cardExpiry.addEventListener('input', () => formatExpiryDate(cardExpiry));

// Botones de validación
document.getElementById('validate-basic').addEventListener('click', () => {
    const cardNumber = cardNumberBasic.value.replace(/\s+/g, '');
    const resultElement = document.getElementById('result-basic');
    
    if (validateCardNumber(cardNumber)) {
        resultElement.className = 'result valid';
        resultElement.innerHTML = '✓ Número de tarjeta válido';
    } else {
        resultElement.className = 'result invalid';
        resultElement.innerHTML = '✗ Número de tarjeta inválido';
    }
    
    resultElement.style.display = 'block';
});

document.getElementById('validate-complete').addEventListener('click', () => {
    const cardNumber = cardNumberComplete.value.replace(/\s+/g, '');
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCVV = document.getElementById('card-cvv').value;
    const resultElement = document.getElementById('result-complete');
    
    const cardType = detectCardType(cardNumber);
    
    let isValid = true;
    let errorMessages = [];
    
    if (!validateCardNumber(cardNumber)) {
        isValid = false;
        errorMessages.push('Número de tarjeta inválido');
    }
    
    if (!validateExpiry(cardExpiry)) {
        isValid = false;
        errorMessages.push('Fecha de expiración inválida');
    }
    
    if (!validateCVV(cardCVV, cardType)) {
        isValid = false;
        errorMessages.push('CVV inválido');
    }
    
    if (isValid) {
        resultElement.className = 'result valid';
        resultElement.innerHTML = '✓ Tarjeta válida';
    } else {
        resultElement.className = 'result invalid';
        resultElement.innerHTML = '✗ ' + errorMessages.join(', ');
    }
    
    resultElement.style.display = 'block';
});