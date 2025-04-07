import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";

// URL for the awesome-mcp-servers README
const MCP_SERVERS_URL = "https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/refs/heads/main/README.md";

// Type definitions
interface McpServerInfo {
  name: string;
  description: string;
  url: string;
  tags: string[];
}

// Function to fetch and parse the MCP servers README
async function fetchMcpServers(): Promise<McpServerInfo[]> {
  try {
    const response = await axios.get(MCP_SERVERS_URL);
    const content = response.data;
    return parseMcpServers(content);
  } catch (error) {
    console.error("Error fetching MCP servers:", error);
    return [];
  }
}

// Function to parse the MCP servers from the README content
function parseMcpServers(content: string): McpServerInfo[] {
  const servers: McpServerInfo[] = [];
  const lines = content.split('\n');
  
  // Regex for GitHub repository links
  const repoRegex = /\[([^\]]+)\]\(https:\/\/github\.com\/([^/)]+\/[^/)]+)/g;
  
  // Track current section
  let currentSection = "";
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for section headers
    if (line.startsWith('###')) {
      currentSection = line.replace('###', '').trim();
      continue;
    }
    
    // Look for repository links in list items
    if (line.trim().startsWith('- ')) {
      let match;
      repoRegex.lastIndex = 0; // Reset regex
      
      while ((match = repoRegex.exec(line)) !== null) {
        const [_, name, repo] = match;
        
        // Get description (text after the repo link until the next link or end of line)
        let description = "";
        const afterRepoLink = line.slice(match.index + match[0].length);
        
        if (afterRepoLink) {
          // Extract description, usually appears after "- " or after repo link
          description = afterRepoLink.replace(/^\)\s*-?\s*/, '').trim();
        }
        
        // Extract tags from line (emojis and other relevant indicators)
        const tagMatches = line.match(/[🐍📇🏎️🦀#️⃣☕☁️🏠📟🍎🪟🐧]/g) || [];
        const tags = [...new Set(tagMatches)]; // Remove duplicates
        
        // Add section as a tag
        if (currentSection) {
          tags.push(currentSection);
        }
        
        servers.push({
          name,
          description,
          url: `https://github.com/${repo}`,
          tags
        });
      }
    }
  }
  
  return servers;
}

// Create the MCP server
const server = new McpServer({
  name: "mcp-finder",
  version: "1.0.0",
});

// Register the find-mcp-servers tool
server.tool(
  "find-mcp-servers",
  "Find MCP servers from the awesome-mcp-servers list",
  {
    search: z.string().optional().describe("Text to search for in server names, descriptions, or tags"),
    tag: z.string().optional().describe("Filter servers by tag (e.g., 'Databases', '🐍', '🏠')"),
    limit: z.number().min(1).max(100).default(10).optional().describe("Maximum number of results to return"),
  },
  async ({ search, tag, limit = 10 }) => {
    // Fetch the MCP servers
    const servers = await fetchMcpServers();
    
    // Filter by search term and tag
    let filteredServers = servers;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredServers = filteredServers.filter(server => 
        server.name.toLowerCase().includes(searchLower) || 
        server.description.toLowerCase().includes(searchLower) ||
        server.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (tag) {
      const tagLower = tag.toLowerCase();
      filteredServers = filteredServers.filter(server => 
        server.tags.some(t => t.toLowerCase().includes(tagLower))
      );
    }
    
    // Limit the number of results
    const limitedServers = filteredServers.slice(0, limit);
    
    // Format the results
    const formattedResults = limitedServers.map(server => {
      return `Name: ${server.name}\nURL: ${server.url}\nTags: ${server.tags.join(', ')}\nDescription: ${server.description}\n---`;
    }).join('\n');
    
    if (limitedServers.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No MCP servers found matching the criteria.",
          },
        ],
      };
    }
    
    return {
      content: [
        {
          type: "text",
          text: `Found ${limitedServers.length} MCP servers:\n\n${formattedResults}`,
        },
      ],
    };
  },
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Finder Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
}); 