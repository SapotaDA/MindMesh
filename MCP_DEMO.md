# GitHub MCP Server Demo (github.com/github/github-mcp-server)

This workspace contains:
- `blackbox_mcp_settings.json` configured with server name: `github.com/github/github-mcp-server`

## Demonstrate server capabilities: tool `get_me`

### Tool
- `get_me`

### Arguments
- None (no parameters required)

### What you should see
Your authenticated GitHub profile object (e.g., `login`, `id`, etc.), returned by the MCP server.

## Another safe example: search repositories

### Tool
- `search_repositories`

### Arguments (example)
```json
{
  "query": "repo:github/github-mcp-server",
  "perPage": 3,
  "page": 1,
  "minimal_output": true
}
```

> Requires the MCP host to supply your PAT input as configured in `blackbox_mcp_settings.json`.

