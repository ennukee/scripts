/*	
LeetCode
Problem #295 -- Difficulty: Hard

Dylan Bowers

https://leetcode.com/problems/find-median-from-data-stream/
*/

var MedianFinder = function() {
    this.data = []
};

MedianFinder.prototype.addNum = function(num) {
    let left = 0
    let right = this.data.length
    while (left <= right) {
        let mid = Math.floor((right + left) / 2)
        if (num >= this.data[mid]) { left = mid + 1 }
        else { right = mid - 1 }
    }
    this.data.splice(left, 0, num)
};

MedianFinder.prototype.findMedian = function() {
    const mid = Math.floor(this.data.length / 2)
    return (this.data.length % 2 === 0)
        ? (this.data[mid] + this.data[mid - 1]) / 2 
        :  this.data[mid]
};

var obj = new MedianFinder()

// obj.addNum(6)
// console.log(obj.findMedian())
// obj.addNum(10)
// console.log(obj.findMedian())
// obj.addNum(2)
// console.log(obj.findMedian())
// obj.addNum(6)
// console.log(obj.findMedian())

obj.addNum(12)
console.log(obj.findMedian())
obj.addNum(10)
console.log(obj.findMedian())
obj.addNum(13)
console.log(obj.findMedian())
obj.addNum(11)
console.log(obj.findMedian())

// Array.from(Array(100000), () => 10).forEach(i => obj.addNum(i))
// console.log(obj.findMedian())
