let rowArray = [...Array(6).keys()].map((item) => item * 100);

function getSnappingValue(originValue, gridArray) {
    let targetValue = 0;
    let distance = 1000000;
    gridArray.forEach((gridValue) => {
        if (Math.abs(originValue - gridValue) <= distance) {
            distance = Math.abs(originValue - gridValue);
            targetValue = gridValue;
        }
    });
    return targetValue;
}

console.log(getSnappingValue(160, rowArray));
