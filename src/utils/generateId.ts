// remember the concept of IIFE and Closure in js 
const generateId = (function () {
    let counter = 0;
    return function () {
        counter++;
        return counter;
    };
})();

// console.log(generateId()); // Output: 1
// console.log(generateId()); // Output: 2
// console.log(generateId()); // Output: 3
export default generateId