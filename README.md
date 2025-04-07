# MCP Finder Server

A Model Context Protocol (MCP) server that allows AI models to search for other MCP server implementations listed in the [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) repository.

## Features

- Search for MCP servers by name, description, or tags
- Filter MCP servers by specific tags (e.g., programming language, OS compatibility)
- Limit the number of results returned

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

## Usage

### Build the server
```bash
npm run build
```

### Run the server
```bash
npm start
```

### Development mode
```bash
npm run dev
```

## Tool: find-mcp-servers

The server provides a single tool called `find-mcp-servers` with the following parameters:

- `search` (optional): Text to search for in server names, descriptions, or tags
- `tag` (optional): Filter servers by tag (e.g., 'Databases', '🐍', '🏠')
- `limit` (optional, default 10): Maximum number of results to return

## Tag Meanings

- 🐍 – Python codebase
- 📇 – TypeScript codebase
- 🏎️ – Go codebase
- 🦀 – Rust codebase
- #️⃣ - C# Codebase
- ☕ - Java codebase
- ☁️ - Cloud Service
- 🏠 - Local Service
- 📟 - Embedded Systems
- 🍎 – For macOS
- 🪟 – For Windows
- 🐧 - For Linux

## Example Response

```
Found 3 MCP servers:

Name: firebase/genkit
URL: https://github.com/firebase/genkit
Tags: 📇, Frameworks
Description: – Provides integration between [Genkit](https://github.com/firebase/genkit/tree/main) and the Model Context Protocol (MCP).
---
Name: lastmile-ai/mcp-agent
URL: https://github.com/lastmile-ai/mcp-agent
Tags: 🤖, 🔌, Frameworks
Description: - Build effective agents with MCP servers using simple, composable patterns.
---
Name: LiteMCP
URL: https://github.com/wong2/litemcp
Tags: 📇, Frameworks
Description: - A high-level framework for building MCP servers in JavaScript/TypeScript
---
```

## License

ISC 