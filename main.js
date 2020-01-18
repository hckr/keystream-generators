const lsfrsBody = document.querySelector('#lsfr-table tbody');

const [tr1, generateNext1, getData1] = createLfsrRow('LSFR 1', 13);
lsfrsBody.appendChild(tr1);

const [tr2, generateNext2, getData2] = createLfsrRow('LSFR 2', 17);
lsfrsBody.appendChild(tr2);

const [tr3, generateNext3, getData3] = createLfsrRow('LSFR 3', 19);
lsfrsBody.appendChild(tr3);

//

const keyLengthInput = document.getElementById('key-length');
const keyResultTextarea = document.getElementById('key-result');

const geffeButton = document.getElementById('geffe-generator');
geffeButton.addEventListener('click', () => runGenerator(geffe));

const stopAndGoButton = document.getElementById('stop-and-go-generator');
stopAndGoButton.addEventListener('click', () => runGenerator(stopAndGo));

const shrinkingButton = document.getElementById('shrinking-generator');
shrinkingButton.addEventListener('click', () => runGenerator(shrinking));

function runGenerator(generator) {
    const data1 = getData1();
    const data2 = getData2();
    const data3 = getData3();
    const length = parseInt(keyLengthInput.value);
    keyResultTextarea.value = generator([data1, data2, data3], length);
}

//

const monoBitTestButton = document.getElementById('mono-bit-test');
monoBitTestButton.addEventListener('click', () => {
    const result = monoBitTest(keyResultTextarea.value);
    const passed = 9725 < result && result < 10275;
    alert(`Test result: ${passed ? 'PASSED' : 'FAILED'}

    X = ${result}`);
});

const pokerTestButton = document.getElementById('poker-test');
pokerTestButton.addEventListener('click', () => {
    const result = pokerTest(keyResultTextarea.value);
    const passed = 2.16 < result && result < 46.17;
    alert(`Test result: ${passed ? 'PASSED' : 'FAILED'}

    X = ${result}`);
});

const longRunsTestButton = document.getElementById('long-runs-test');
longRunsTestButton.addEventListener('click', () => {
    const result = longRunsTest(keyResultTextarea.value);
    alert(`Test result: ${result ? 'PASSED' : 'FAILED'}`);
});

//

function createLfsrRow(name, termsCount) {
    const tr = document.createElement('tr');

    const nameTh = document.createElement('th');
    nameTh.scope = 'row';
    nameTh.innerText = name;
    tr.appendChild(nameTh);

    const tapsCountTd = document.createElement('td');
    const termsCountInput = document.createElement('input');
    termsCountInput.className = 'terms-count';
    termsCountInput.type = 'number';
    termsCountInput.min = 1;
    termsCountInput.max = 25;
    termsCountInput.value = termsCount;
    tapsCountTd.appendChild(termsCountInput);
    tr.appendChild(tapsCountTd);

    const termsTd = document.createElement('td');
    tr.appendChild(termsTd);

    function updateFunctionSelector() {
        termsTd.innerHTML = '';
        const termsDiv = createFunctionSelector(parseInt(termsCountInput.value) || 0);
        termsTd.appendChild(termsDiv);
    }

    updateFunctionSelector();
    termsCountInput.addEventListener('change', () => updateFunctionSelector());

    const contentsTd = document.createElement('td');
    const contentsInput = document.createElement('input');
    contentsTd.appendChild(contentsInput);
    tr.appendChild(contentsTd);

    function updateContentsValue(newValue) {
        contentsInput.value = newValue || '1'.repeat(parseInt(termsCountInput.value) || 0);
    }

    updateContentsValue();
    termsCountInput.addEventListener('change', () => updateContentsValue());
    contentsInput.addEventListener('blur', () => {
        if (contentsInput.value.length < termsCountInput.value) {
            contentsInput.value = '0'.repeat(termsCountInput.value - contentsInput.value.length) + contentsInput.value;
        }
    });

    const generateTd = document.createElement('td');
    const generateButton = document.createElement('button');
    generateButton.innerText = 'Generate';

    function generateNext() {
        const data = getData();
        const result = currentValue(data);
        contentsInput.value = shiftLsfm(data).contents;

        console.log(result);
        return result;
    }

    generateButton.addEventListener('click', () => generateNext());
    generateTd.appendChild(generateButton);
    tr.appendChild(generateTd);

    function getData() {
        return {
            constantTerm: parseInt(termsTd.querySelector('input[name=constant-term').value),
            taps: [].filter.call(termsTd.querySelectorAll('input[type=checkbox]'), c => c.checked).map(c => parseInt(c.name)),
            contents: contentsInput.value
        }
    }

    return [tr, generateNext, getData];
}

function createFunctionSelector(termsCount) {
    const termsDiv = document.createElement('div');
    termsDiv.className = 'taps';
    const constantTermInput = document.createElement('input');
    constantTermInput.name = 'constant-term';
    constantTermInput.type = 'number';
    constantTermInput.min = 0;
    constantTermInput.max = 1;
    constantTermInput.value = 1;
    termsDiv.appendChild(constantTermInput);
    for (let i = 0; i < termsCount; ++i) {
        const termLabel = document.createElement('label');
        const termCheckbox = document.createElement('input');
        termCheckbox.type = 'checkbox';
        termCheckbox.name = i;
        termLabel.append(termCheckbox);
        const termSpan = document.createElement('span');
        termSpan.innerHTML = `⊕ x<sup>${i + 1}</sup>`;
        termLabel.appendChild(termSpan);
        termsDiv.appendChild(termLabel);
    }
    return termsDiv;
}
