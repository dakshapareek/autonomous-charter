# MCP Setup Guide for Investment Research

## Overview

We'll use MCP (Model Context Protocol) to fetch real-time market data. This gives us the +1 bonus point and demonstrates meaningful capability extension.

## Option 1: Alpha Vantage MCP Server (Recommended)

Alpha Vantage provides free stock market data with a generous API limit.

### Step 1: Get Alpha Vantage API Key
1. Go to: https://www.alphavantage.co/support/#api-key
2. Enter your email
3. Get your free API key (supports 25 requests/day on free tier)

### Step 2: Install MCP Server

Create or update your MCP configuration file at `~/.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "alpha-vantage": {
      "command": "uvx",
      "args": ["mcp-server-fetch"],
      "env": {
        "ALPHA_VANTAGE_API_KEY": "YOUR_API_KEY_HERE"
      },
      "disabled": false,
      "autoApprove": ["fetch"]
    }
  }
}
```

### Step 3: Test MCP Connection

Once configured, test with a simple fetch:
- Ticker: AAPL
- Endpoint: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY`

## Option 2: Yahoo Finance (Free, No API Key)

Yahoo Finance provides free data without API keys, but less structured.

### Using mcp-server-fetch

```json
{
  "mcpServers": {
    "yahoo-finance": {
      "command": "uvx",
      "args": ["mcp-server-fetch"],
      "disabled": false,
      "autoApprove": ["fetch"]
    }
  }
}
```

### Yahoo Finance Endpoints
- Quote: `https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}`
- News: `https://query2.finance.yahoo.com/v1/finance/search?q={TICKER}`

## Option 3: Custom MCP Server (Advanced)

If you want more control, create a custom MCP server that wraps multiple financial APIs.

## Testing Your MCP Setup

### Test 1: Fetch Stock Quote
```javascript
// In your Node.js backend
const response = await mcpClient.callTool('fetch', {
  url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY'
});
```

### Test 2: Parse Response
```javascript
const data = JSON.parse(response);
const quote = data['Global Quote'];
console.log({
  symbol: quote['01. symbol'],
  price: quote['05. price'],
  change: quote['09. change'],
  changePercent: quote['10. change percent']
});
```

## Data We Need

For each stock, fetch:
1. **Current Price** - Real-time or 15-min delayed
2. **Market Cap** - Company valuation
3. **P/E Ratio** - Price to earnings
4. **52-Week Range** - High and low
5. **Volume** - Trading volume
6. **Change %** - Daily change

## Rate Limits & Caching

### Alpha Vantage Free Tier
- 25 requests per day
- 5 API calls per minute

### Strategy
1. Cache responses for 15 minutes
2. Implement request queue
3. Show cached data timestamp to user

## Next Steps

1. Choose your MCP option (recommend Alpha Vantage)
2. Get API key
3. Configure MCP settings
4. Test with sample ticker
5. Move to Phase 2: Market Data Fetcher implementation

## Troubleshooting

### MCP Server Not Connecting
- Check if `uv` and `uvx` are installed
- Verify API key is correct
- Check MCP server logs in Kiro

### API Rate Limit Exceeded
- Implement caching
- Use free tier wisely during development
- Consider upgrading for production

### Invalid Ticker Symbol
- Validate ticker format before API call
- Handle 404 errors gracefully
- Suggest similar tickers
