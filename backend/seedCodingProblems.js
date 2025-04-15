const mongoose = require("mongoose");
const CodingProblem = require("./models/CodingProblem");

mongoose.connect("mongodb://127.0.0.1:27017/webdev")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const sampleProblems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    difficulty: "Easy",
    constraints: `2 <= nums.length <= 104
-109 <= nums[i] <= 109
-109 <= target <= 109
Only one valid answer exists.`,
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "[0,1]",
        isHidden: false
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "[1,2]",
        isHidden: false
      },
      {
        input: "[3,3]\n6",
        expectedOutput: "[0,1]",
        isHidden: false
      },
      {
        input: "[1,5,8,3,4,7]\n11",
        expectedOutput: "[2,5]",
        isHidden: true
      }
    ],
    tags: ["Array", "Hash Table"]
  },
  {
    title: "Fibonacci Number",
    description: `Write a function to calculate the nth number in the Fibonacci sequence.
The Fibonacci sequence is defined as:
F(0) = 0, F(1) = 1
F(n) = F(n-1) + F(n-2), for n > 1`,
    difficulty: "Easy",
    constraints: `0 <= n <= 30`,
    testCases: [
      {
        input: "2",
        expectedOutput: "1",
        isHidden: false
      },
      {
        input: "3",
        expectedOutput: "2",
        isHidden: false
      },
      {
        input: "4",
        expectedOutput: "3",
        isHidden: false
      },
      {
        input: "20",
        expectedOutput: "6765",
        isHidden: true
      }
    ],
    tags: ["Dynamic Programming", "Math", "Recursion"]
  }
];

const seedDB = async () => {
  await CodingProblem.deleteMany({});
  await CodingProblem.insertMany(sampleProblems);
  console.log("Database seeded with coding problems!");
  mongoose.connection.close();
};

seedDB();