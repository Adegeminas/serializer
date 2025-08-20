const serialization = (array) => {
    const sortedArray = array.sort((a, b) => a - b);
    const deltedArray = toDeltas(sortedArray);
    const dividedArray = deltedArray.map((number) => numberToDivider(number));
    return compressString(dividedArray.join(''));
};

const deserialization = (serialized) => {
    const decompressed = decompressString(serialized);
    let deltedArray = [];
    let tempNumberStr = '';
    for (let i = 0; i < decompressed.length; i++) {
        if (dividers.includes(decompressed[i])) {
            deltedArray.push(Number(tempNumberStr + dividerMap[decompressed[i]]));
            tempNumberStr = '';
        } else {
            tempNumberStr += decompressed[i];
        }
    }  
    
    return fromDeltas(deltedArray);
};

//////////////////////////////////////////////////////////////////////

const MAX_NUMBER = 300;
const digitsMap = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G',
    7: 'H',
    8: 'I',
    9: 'J',
}
const dividerMap = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4,
    'F': 5,
    'G': 6,
    'H': 7,
    'I': 8,
    'J': 9,
}
const dividers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const counterMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const counterKeys = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
    'i': 8,
    'j': 9
};

const generateTripleArray = () => {
    const result = [];
    for (let i = 1; i <= MAX_NUMBER; i++) {
        result.push(i);
        result.push(i);
        result.push(i);
    }
    return result;
}

const generateRandomArray = (arrayLength, maxNumber, minNumber) => {
    const array = [];
    for (let i = 0; i < arrayLength; i++) {
        array.push(Math.floor((minNumber || 0) + Math.random() * ((maxNumber - minNumber || 0) || MAX_NUMBER)));
    }
    return array;
};
const naiveSerializationResult = (array) => {
    return array.sort((a, b) => a - b).join(',');
};

const numberToDivider = (number) => {
    const digits = String(number).split('');
    digits[digits.length - 1] = digitsMap[digits[digits.length - 1]];
    return digits.join('');
}

const numberToCounter = (number) => {
    const digits = String(number).split('');
    return digits.map((digit) => counterMap[digit]).join('');
}
const numberFromCounter = (number) => {
    const digits = String(number).split('');
    return digits.map((digit) => counterKeys[digit]).join('');
}

const toDeltas = (array) => {
    const deltas = [array[0]];
    for (let i = 0; i < array.length - 1; i++) {
        deltas.push(array[i + 1] - array[i]);
    }
    return deltas;
}

const fromDeltas = (deltas) => {
    const array = [deltas[0]];
    for (let i = 1; i < deltas.length; i++) {
        array.push(array[i - 1] + deltas[i]);
    }
    return array;
}

const compressString = (string) => {
    let compressedString = '_';
    let currentChar = string[0];
    let currentCharCount = 1;
    for (let i = 1; i < string.length; i++) {
        if (string[i] === currentChar) {
            currentCharCount++;
        } else {
            if (currentCharCount > 1) {
                compressedString += currentChar + numberToCounter(currentCharCount);
            } else {
                compressedString += currentChar.repeat(currentCharCount);
            }
            currentChar = string[i];
            currentCharCount = 1;
        }
    }

    if (currentCharCount > 1) {
        compressedString += currentChar + numberToCounter(currentCharCount);
    } else {
        for (let j = 0; j < currentCharCount; j++) {
            compressedString += currentChar;
        }
    }
    
    return compressedString.substring(1);
};

const decompressString = (string) => {
    let result = '_';
    let currentChar = '';
    let currentCharCount = '';

    for (let i = 0; i < string.length; i++) {
        if (counterMap.includes(string[i])) {
            currentCharCount += string[i];
        } else if (currentCharCount.length) {
            result += currentChar.repeat(Number(numberFromCounter(currentCharCount)) - 1);
            currentChar = string[i];
            result += string[i];
            currentCharCount = '';
        } else {
            currentChar = string[i];
            result += string[i];
        }
    }

    if (currentCharCount.length) {
        result += currentChar.repeat(Number(numberFromCounter(currentCharCount)) - 1);
    }
    return result.substring(1);
}

const testFunction = (testArray) => {
    const naiveResult = naiveSerializationResult(testArray);
    const result = serialization(testArray);
    const fromResult = deserialization(result);
    const retest = naiveSerializationResult(fromResult) === naiveResult;
    
    console.log('------------------------------')
    if (!retest){
        console.log('Failed');
    } else {
        console.log('Passed');
    }
    console.log(naiveResult);
    console.log('====>')
    console.log(result);
    console.log('Compressed by: ' + (naiveResult.length / result.length).toFixed(4));
    
    return (naiveResult.length / result.length).toFixed(2);
};
const runTests = () => {
    const testResults = [];
    testCases.forEach((testCase) => {
        testResults.push(testFunction(testCase));
    })
    const average = (testResults.reduce((a, b) => Number(a) + Number(b)) / testResults.length).toFixed(2);
    const errorsCount = testResults.filter((result) => Number(result) < 2).length;
    console.log('***************************')
    console.log(`Average: ${average}`);
    console.log(`Error percent: ${(errorsCount/testResults.length * 100).toFixed(2)}%`);
};

const testCases = [
    [1, 4, 5, 6, 10],
    generateRandomArray(50),
    generateRandomArray(100),
    generateRandomArray(500),
    generateRandomArray(1000),
    generateRandomArray(1000, 10, 1),
    generateRandomArray(1000, 100, 10),
    generateRandomArray(1000, 301, 100),
    generateTripleArray(),
]

runTests();