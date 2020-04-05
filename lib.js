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
    let prev, count = 1;
    for (let c of string) {
        if (c === prev) {
            count += 1;
            if (count >= 26) {
                return false;
            }
        } else {
            count = 1;
            prev = c;
        }
    }
    return true;
}

//

function geffe([lfsr1, lfsr2, lfsr3], length) {
    const result = [];

    for (let i = 0; i < length; ++i) {
        const x1 = currentValue(lfsr1);
        const x2 = currentValue(lfsr2);
        const x3 = currentValue(lfsr3);

        result.push((x1 & x2) ^ (!x2 & x3));

        lfsr1 = shiftLfsr(lfsr1);
        lfsr2 = shiftLfsr(lfsr2);
        lfsr3 = shiftLfsr(lfsr3);
    }

    return result.join('');
}

function stopAndGo([lfsr1, lfsr2, lfsr3], length) {
    const result = [];

    for (let i = 0; i < length; ++i) {
        const x1 = currentValue(lfsr1);
        const x2 = currentValue(lfsr2);
        const x3 = currentValue(lfsr3);

        result.push(x2 ^ x3);

        lfsr1 = shiftLfsr(lfsr1);
        if (x1) {
            lfsr2 = shiftLfsr(lfsr2);
        }
        if (!x1) {
            lfsr3 = shiftLfsr(lfsr3);
        }
    }

    return result.join('');
}

function shrinking([lfsr1, lfsr2], length) {
    const result = [];

    for (let i = 0; i < length;) {
        const x1 = currentValue(lfsr1);
        const x2 = currentValue(lfsr2);

        if (x1) {
            result.push(x2);
            ++i;
        }

        lfsr1 = shiftLfsr(lfsr1);
        lfsr2 = shiftLfsr(lfsr2);
    }

    return result.join('');
}

//

function shiftLfsr({ constantTerm, taps, contents }) {
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
