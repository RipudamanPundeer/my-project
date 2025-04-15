const mongoose = require("mongoose");
const Test = require("./models/Test");

mongoose.connect("mongodb://127.0.0.1:27017/webdev")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const sampleTests = [
    {
      title: "JavaScript Basics",
      description: "Test your fundamental knowledge of JavaScript.",
      duration: 20, // 20 minutes
      questions: [
        {
          questionText: "What is the output of `typeof NaN` in JavaScript?",
          options: ["Number", "Undefined", "NaN", "Object"],
          correctAnswer: "Number",
        },
        {
          questionText: "Which of the following is a falsy value in JavaScript?",
          options: ["'false'", "0", "[]", "'0'"],
          correctAnswer: "0",
        },
        {
          questionText: "Which symbol is used for comments in JavaScript?",
          options: ["//", "/* */", "--", "#"],
          correctAnswer: "//",
        },
        {
          questionText: "What does `JSON.stringify()` do?",
          options: [
            "Parses a JSON string",
            "Converts an object to a JSON string",
            "Removes all whitespace from JSON",
            "Encodes a JSON object",
          ],
          correctAnswer: "Converts an object to a JSON string",
        },
        {
          questionText: "What will `console.log(2 + '2')` output?",
          options: ["4", "22", "NaN", "TypeError"],
          correctAnswer: "22",
        },
        {
          questionText: "What keyword is used to declare variables in ES6?",
          options: ["var", "let", "const", "Both let and const"],
          correctAnswer: "Both let and const",
        },
        {
          questionText: "Which function is used to parse a JSON string in JavaScript?",
          options: ["JSON.parse()", "JSON.stringify()", "JSON.decode()", "JSON.convert()"],
          correctAnswer: "JSON.parse()",
        },
        {
          questionText: "What does the `===` operator do in JavaScript?",
          options: [
            "Checks for value equality",
            "Checks for value and type equality",
            "Assigns a value",
            "Performs bitwise comparison",
          ],
          correctAnswer: "Checks for value and type equality",
        },
        {
          questionText: "Which built-in function removes the last element from an array?",
          options: ["pop()", "push()", "shift()", "unshift()"],
          correctAnswer: "pop()",
        },
        {
          questionText: "Which array method is used to filter elements based on a condition?",
          options: ["map()", "reduce()", "filter()", "forEach()"],
          correctAnswer: "filter()",
        },
      ],
    },
    {
      title: "ReactJS Fundamentals",
      description: "Assess your knowledge of ReactJS.",
      duration: 15, // 15 minutes
      questions: [
        {
          questionText: "What is React primarily used for?",
          options: ["Server-side scripting", "Database management", "Building user interfaces", "Operating systems"],
          correctAnswer: "Building user interfaces",
        },
        {
          questionText: "Which React Hook is used to handle state?",
          options: ["useEffect", "useState", "useRef", "useReducer"],
          correctAnswer: "useState",
        },
        {
          questionText: "What does JSX stand for?",
          options: ["JavaScript XML", "JavaScript Extension", "Java Standard X", "JSON XML"],
          correctAnswer: "JavaScript XML",
        },
        {
          questionText: "Which lifecycle method runs after a component mounts?",
          options: ["componentDidUpdate", "componentDidMount", "componentWillUnmount", "useEffect"],
          correctAnswer: "componentDidMount",
        },
        {
          questionText: "How do you pass data from a parent to a child component?",
          options: ["Props", "State", "Context", "Hooks"],
          correctAnswer: "Props",
        },
      ],
    },
    {
      title: "MongoDB Essentials",
      description: "Evaluate your knowledge of MongoDB.",
      duration: 10, // 10 minutes
      questions: [
        {
          questionText: "MongoDB is a...",
          options: ["SQL database", "NoSQL database", "Relational database", "None of the above"],
          correctAnswer: "NoSQL database",
        },
        {
          questionText: "Which command is used to insert a document in MongoDB?",
          options: ["db.insert()", "db.collection.insertOne()", "db.add()", "db.collection.addOne()"],
          correctAnswer: "db.collection.insertOne()",
        },
        {
          questionText: "What type of database is MongoDB?",
          options: ["Relational", "Key-Value", "Document-Oriented", "Graph"],
          correctAnswer: "Document-Oriented",
        },
      ],
    },
    {
      title: "Node.js & Express",
      description: "Assess your knowledge of Node.js and Express.",
      duration: 10, // 10 minutes
      questions: [
        {
          questionText: "Which module is used to create an HTTP server in Node.js?",
          options: ["http", "fs", "path", "express"],
          correctAnswer: "http",
        },
        {
          questionText: "Which command initializes a new Node.js project?",
          options: ["node start", "npm init", "node init", "npm start"],
          correctAnswer: "npm init",
        },
        {
          questionText: "Which function is used to read a file in Node.js?",
          options: ["fs.readFile()", "read.file()", "fileSystem.read()", "fs.getFile()"],
          correctAnswer: "fs.readFile()",
        },
      ],
    },
  ];

const seedDB = async () => {
  await Test.deleteMany({});
  await Test.insertMany(sampleTests);
  console.log("Database seeded!");
  mongoose.connection.close();
};

seedDB();
