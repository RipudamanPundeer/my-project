const mongoose = require("mongoose");
const Test = require("./models/Test");

mongoose.connect("mongodb://127.0.0.1:27017/webdev")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const sampleTests = [
    {
      title: "JavaScript Basics",
      description: "Test your fundamental knowledge of JavaScript.",
      duration: 30, // 30 minutes
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
        {
          questionText: "What is closure in JavaScript?",
          options: [
            "A function that has access to variables in its outer scope",
            "A way to close a browser window",
            "A method to end a loop",
            "A way to close database connections"
          ],
          correctAnswer: "A function that has access to variables in its outer scope",
        },
        {
          questionText: "What is the purpose of the `Promise` object?",
          options: [
            "To handle asynchronous operations",
            "To promise code will work",
            "To store global variables",
            "To create loops"
          ],
          correctAnswer: "To handle asynchronous operations",
        },
        {
          questionText: "What is event bubbling?",
          options: [
            "Events propagating from child to parent elements",
            "Creating new events",
            "Removing event listeners",
            "Adding multiple events"
          ],
          correctAnswer: "Events propagating from child to parent elements",
        },
        {
          questionText: "What is the difference between let and const?",
          options: [
            "let can be reassigned, const cannot",
            "let is function scoped, const is block scoped",
            "const is faster than let",
            "There is no difference"
          ],
          correctAnswer: "let can be reassigned, const cannot",
        },
        {
          questionText: "What is the purpose of the `this` keyword?",
          options: [
            "Refers to the current object context",
            "Creates a new object",
            "Defines a class",
            "Imports modules"
          ],
          correctAnswer: "Refers to the current object context",
        }
      ],
    },
    {
      title: "ReactJS Fundamentals",
      description: "Assess your knowledge of ReactJS.",
      duration: 25, // 25 minutes
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
        {
          questionText: "What is the Virtual DOM?",
          options: [
            "A lightweight copy of the actual DOM",
            "A browser feature",
            "A JavaScript library",
            "A CSS framework"
          ],
          correctAnswer: "A lightweight copy of the actual DOM",
        },
        {
          questionText: "What is the purpose of useEffect?",
          options: [
            "To handle side effects in functional components",
            "To create new components",
            "To style components",
            "To handle routing"
          ],
          correctAnswer: "To handle side effects in functional components",
        },
        {
          questionText: "What is React Context used for?",
          options: [
            "Passing data through the component tree without props",
            "Creating new components",
            "Handling HTTP requests",
            "Managing local state"
          ],
          correctAnswer: "Passing data through the component tree without props",
        },
        {
          questionText: "What is the purpose of React.memo?",
          options: [
            "To optimize performance by memoizing components",
            "To create memory in React",
            "To handle forms",
            "To manage routing"
          ],
          correctAnswer: "To optimize performance by memoizing components",
        },
        {
          questionText: "What is a controlled component in React?",
          options: [
            "A component where form data is controlled by React state",
            "A component with no state",
            "A component with no props",
            "A component that controls other components"
          ],
          correctAnswer: "A component where form data is controlled by React state",
        },
        {
          questionText: "What is the purpose of React keys?",
          options: [
            "To uniquely identify elements in lists",
            "To style components",
            "To create routes",
            "To handle state"
          ],
          correctAnswer: "To uniquely identify elements in lists",
        },
        {
          questionText: "What is the difference between state and props?",
          options: [
            "State is mutable and props are immutable",
            "Props are mutable and state is immutable",
            "Both are mutable",
            "Both are immutable"
          ],
          correctAnswer: "State is mutable and props are immutable",
        },
        {
          questionText: "What is React Fragments used for?",
          options: [
            "To group multiple elements without adding extra nodes",
            "To fragment the application",
            "To split components",
            "To create routes"
          ],
          correctAnswer: "To group multiple elements without adding extra nodes",
        },
        {
          questionText: "What is the purpose of useCallback?",
          options: [
            "To memoize functions",
            "To handle state",
            "To create effects",
            "To manage routing"
          ],
          correctAnswer: "To memoize functions",
        },
        {
          questionText: "What is the role of key prop in React lists?",
          options: [
            "To help React track which items changed",
            "To style list items",
            "To count items",
            "To sort items"
          ],
          correctAnswer: "To help React track which items changed",
        }
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
    {
      title: "Data Structures and Algorithms",
      description: "Test your knowledge of fundamental DSA concepts.",
      duration: 30, // 30 minutes
      questions: [
        {
          questionText: "What is the time complexity of binary search?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
          correctAnswer: "O(log n)",
        },
        {
          questionText: "Which data structure follows LIFO principle?",
          options: ["Queue", "Stack", "Linked List", "Array"],
          correctAnswer: "Stack",
        },
        {
          questionText: "What is the space complexity of quicksort?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
          correctAnswer: "O(log n)",
        },
        {
          questionText: "Which sorting algorithm has the best average case time complexity?",
          options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Quick Sort"],
          correctAnswer: "Quick Sort",
        },
        {
          questionText: "What is the main advantage of a hash table?",
          options: [
            "O(1) average case for insertions and lookups",
            "Always sorted data",
            "Low memory usage",
            "Sequential data access"
          ],
          correctAnswer: "O(1) average case for insertions and lookups",
        }
      ],
    },
    {
      title: "System Design Basics",
      description: "Evaluate your understanding of system design concepts.",
      duration: 25, // 25 minutes
      questions: [
        {
          questionText: "What is the purpose of a load balancer?",
          options: [
            "Distribute traffic across multiple servers",
            "Speed up database queries",
            "Cache static content",
            "Encrypt data"
          ],
          correctAnswer: "Distribute traffic across multiple servers",
        },
        {
          questionText: "What is horizontal scaling?",
          options: [
            "Adding more machines to handle load",
            "Adding more CPU/RAM to existing machine",
            "Adding more storage",
            "Adding more network bandwidth"
          ],
          correctAnswer: "Adding more machines to handle load",
        },
        {
          questionText: "What is the purpose of caching?",
          options: [
            "Improve response time and reduce database load",
            "Increase security",
            "Handle user authentication",
            "Process payments"
          ],
          correctAnswer: "Improve response time and reduce database load",
        },
        {
          questionText: "What is a microservice architecture?",
          options: [
            "Breaking application into small, independent services",
            "Using small servers",
            "Writing minimal code",
            "Using lightweight databases"
          ],
          correctAnswer: "Breaking application into small, independent services",
        },
        {
          questionText: "What is the CAP theorem?",
          options: [
            "Choose between Consistency, Availability, and Partition tolerance",
            "A way to measure CPU performance",
            "A network protocol",
            "A programming paradigm"
          ],
          correctAnswer: "Choose between Consistency, Availability, and Partition tolerance",
        }
      ],
    }
  ];

const seedDB = async () => {
  await Test.deleteMany({});
  await Test.insertMany(sampleTests);
  console.log("Database seeded!");
  mongoose.connection.close();
};

seedDB();
