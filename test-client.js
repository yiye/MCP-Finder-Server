#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

// Start the MCP server as a child process
const server = spawn('node', ['dist/index.js']);

// Set up readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize server
console.log('Starting MCP Finder Server...');
console.log('You can test the server with commands like:');
console.log('> {"jsonrpc":"2.0","id":1,"method":"mcp.discover"}');
console.log('> {"jsonrpc":"2.0","id":2,"method":"mcp.describe"}');
console.log('> {"jsonrpc":"2.0","id":3,"method":"find-mcp-servers","params":{"search":"typescript"}}');
console.log('> {"jsonrpc":"2.0","id":4,"method":"find-mcp-servers","params":{"tag":"Databases"}}');
console.log('> {"jsonrpc":"2.0","id":5,"method":"find-mcp-servers","params":{"limit":3}}');
console.log('Type "exit" to quit');
console.log('---');

// Handle server stdout (responses)
server.stdout.on('data', (data) => {
  console.log(`Server response: ${data}`);
});

// Handle server stderr (logs)
server.stderr.on('data', (data) => {
  console.error(`Server log: ${data}`);
});

// Handle errors
server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
});

// Handle exit
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  rl.close();
});

// Read user input and send to server
rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Shutting down...');
    server.kill();
    rl.close();
    return;
  }

  try {
    // Validate JSON
    JSON.parse(input);
    server.stdin.write(input + '\n');
  } catch (e) {
    console.error('Invalid JSON input. Please try again.');
  }
});

// Handle CTRL+C
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.kill();
  rl.close();
}); 