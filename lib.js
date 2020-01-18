function monoBitTest(string) {
    return [].filter.call(string, c => c == 1).length;
}

function pokerTest(string) {
    const quadrupleCounts = {};
    for (let i = 0; i < string.length; i += 4) {
        const quadruple = string.substr(i, 4);
        quadrupleCounts[quadruple] = (quadrupleCounts[quadruple] || 0) + 1;
    }
    console.log(quadrupleCounts);

    return 16 / 5000 * Object.values(quadrupleCounts).map(c => c * c).reduce((a, b) => a + b) - 5000;
}

function longRunsTest(string) {
    let prev, count = 0;
    for (let c of string) {
        if (c === prev) {
            count += 1;
            if (count >= 26) {
                return false;
            }
        } else {
            count = 0;
            prev = c;
        }
    }
    return true;
}

//

function geffe([lsfm1, lsfm2, lsfm3], length) {
    const result = [];

    for (let i = 0; i < length; ++i) {
        const x1 = currentValue(lsfm1);
        const x2 = currentValue(lsfm2);
        const x3 = currentValue(lsfm3);

        result.push((x1 & x2) ^ (!x2 & x3));

        lsfm1 = shiftLsfm(lsfm1);
        lsfm2 = shiftLsfm(lsfm2);
        lsfm3 = shiftLsfm(lsfm3);
    }

    return result.join('');
}

function stopAndGo([lsfm1, lsfm2, lsfm3], length) {
    const result = [];

    for (let i = 0; i < length; ++i) {
        const x1 = currentValue(lsfm1);
        const x2 = currentValue(lsfm2);
        const x3 = currentValue(lsfm3);

        result.push(x2 ^ x3);

        lsfm1 = shiftLsfm(lsfm1);
        if (x1) {
            lsfm2 = shiftLsfm(lsfm2);
        }
        if (!x1) {
            lsfm3 = shiftLsfm(lsfm3);
        }
    }

    return result.join('');
}

function shrinking([lsfm1, lsfm2], length) {
    const result = [];

    for (let i = 0; i < length;) {
        const x1 = currentValue(lsfm1);
        const x2 = currentValue(lsfm2);

        if (x1) {
            result.push(x2);
            ++i;
        }

        lsfm1 = shiftLsfm(lsfm1);
        lsfm2 = shiftLsfm(lsfm2);
    }

    return result.join('');
}

//

function shiftLsfm({ constantTerm, taps, contents }) {
    let newValue = taps.reduce(
        (acc, tapIndex) => acc ^ contents[tapIndex],
        constantTerm
    );
    return {
        constantTerm,
        taps,
        contents: newValue + contents.substring(0, contents.length - 1)
    }
}

function currentValue({ contents }) {
    return parseInt(contents[contents.length - 1])
}
