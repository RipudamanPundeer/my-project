import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Button, Container, Alert, Form, Card } from 'react-bootstrap';

// Boilerplate templates for different languages
const TEMPLATES = {
  javascript: `// JavaScript (Node.js)
function main() {
    // Your code here
    console.log("Hello, World!");
}

main();`,
  python: `# Python
def main():
    # Your code here
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
  java: `// Java
public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
  cpp: `// C++
#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
  csharp: `// C#
using System;

class Program {
    static void Main(string[] args) {
        // Your code here
        Console.WriteLine("Hello, World!");
    }
}`,
  ruby: `# Ruby
def main
    # Your code here
    puts "Hello, World!"
end

main`,
  go: `// Go
package main

import "fmt"

func main() {
    // Your code here
    fmt.Println("Hello, World!")
}`
};

function CodeTest() {
  const [code, setCode] = useState(TEMPLATES.javascript);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(TEMPLATES[newLanguage]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/execute', { 
        code,
        language,
        input
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error executing code: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>&nbsp;</h1>
        <h2>Code Editor</h2>
        <p className="lead">Write, test, and debug your code in real-time</p>
      </div>

      <Container>
        <Card className="custom-card mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Select 
                value={language} 
                onChange={handleLanguageChange}
                className="w-auto"
                style={{ minWidth: '200px' }}
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
              </Form.Select>
              <Button 
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Running...' : 'Run Code'}
              </Button>
            </div>
            
            <div style={{ border: '1px solid #ccc', borderRadius: '4px', marginBottom: '1rem' }}>
              <Editor
                height="400px"
                defaultLanguage={language}
                value={code}
                onChange={(value) => setCode(value)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'all',
                  formatOnPaste: false,
                  formatOnType: false,
                  autoIndent: 'advanced',
                  tabSize: 4,
                  detectIndentation: true,
                  useTabStops: true,
                  insertSpaces: true
                }}
              />
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Input (stdin)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your program input here..."
                style={{ fontFamily: 'monospace' }}
              />
              <Form.Text className="text-muted">
                For programs that require input, enter the values here. Each line will be treated as a separate input.
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>

        {output && (
          <Card className="custom-card">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">Output</h5>
            </Card.Header>
            <Card.Body>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '4px',
                margin: 0,
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {output}
              </pre>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default CodeTest;