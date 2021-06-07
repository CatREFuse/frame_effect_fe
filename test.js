var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var out = arr.sort(function() {
    return Math.random() > 0.5 ? -1 : 1;
});

console.log(out);
