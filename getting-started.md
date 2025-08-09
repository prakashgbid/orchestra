---
layout: default
title: Getting Started with Orchestra
---

# Getting Started with Orchestra

Welcome to Orchestra! This guide will help you get up and running with multi-LLM orchestration in minutes.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** 18.0 or higher
- **NPM** or **Yarn** package manager
- **API Keys** from at least one LLM provider:
  - [OpenAI API Key](https://platform.openai.com/api-keys)
  - [Anthropic API Key](https://console.anthropic.com/settings/keys)
  - [Google AI API Key](https://makersuite.google.com/app/apikey)

## 🚀 Installation

### Using NPM

```bash
npm install @orchestra-llm/core
```

### Using Yarn

```bash
yarn add @orchestra-llm/core
```

### Using PNPM

```bash
pnpm add @orchestra-llm/core
```

## 🔧 Basic Configuration

### 1. Set Up Environment Variables

Create a `.env` file in your project root:

```bash
# LLM Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...

# Optional: Orchestra Configuration
ORCHESTRA_DEFAULT_PROVIDER=openai
ORCHESTRA_CONSENSUS_THRESHOLD=0.7
ORCHESTRA_MAX_DEBATE_ROUNDS=3
ORCHESTRA_CACHE_ENABLED=true
```

### 2. Initialize Orchestra

Create your first Orchestra instance:

```javascript
import { Orchestra } from '@orchestra-llm/core'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initialize Orchestra with providers
const orchestra = new Orchestra({
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4-turbo-preview', // Optional: specify model
      temperature: 0.7 // Optional: set temperature
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-opus-20240229'
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'gemini-pro'
    }
  },
  // Optional: Global configuration
  defaultProvider: 'openai',
  consensusThreshold: 0.7,
  maxDebateRounds: 3,
  cache: {
    enabled: true,
    ttl: 3600 // Cache for 1 hour
  }
})

console.log('Orchestra initialized with providers:', orchestra.getProviders())
```

## 💻 Your First Orchestration

### Simple Query

Query a single provider:

```javascript
const response = await orchestra.query(
  'Explain quantum computing in simple terms',
  { provider: 'openai' }
)

console.log(response.content)
console.log(`Response from: ${response.provider}`)
console.log(`Latency: ${response.latency}ms`)
```

### Building Consensus

Get agreement from multiple models:

```javascript
const consensus = await orchestra.consensus(
  'What are the best practices for API security?'
)

console.log('Consensus Result:', consensus.result)
console.log('Confidence Level:', consensus.confidence)
console.log('Agreement Score:', consensus.agreement)
console.log('Participating Models:', consensus.providers)
console.log('Reasoning:', consensus.reasoning)
```

### Running a Debate

Let models debate complex topics:

```javascript
const debate = await orchestra.debate(
  'Should startups use microservices or monolithic architecture?',
  {
    maxRounds: 3,
    threshold: 0.8,
    providers: ['openai', 'anthropic', 'google']
  }
)

console.log('Final Decision:', debate.decision)
console.log('Agreement Level:', debate.agreement)
console.log('Number of Rounds:', debate.rounds.length)

// Examine the debate process
debate.rounds.forEach((round, index) => {
  console.log(`\nRound ${index + 1}:`)
  round.arguments.forEach(arg => {
    console.log(`${arg.provider}: ${arg.content.substring(0, 100)}...`)
  })
  console.log(`Agreement: ${round.agreement}`)
})
```

## 🎯 Common Use Cases

### 1. Code Review Assistant

```javascript
async function reviewCode(code) {
  const review = await orchestra.consensus(
    `Review this code for bugs, security issues, and best practices:\n\n${code}`,
    {
      providers: ['openai', 'anthropic'],
      mode: 'weighted' // Give more weight to specialized models
    }
  )
  
  return review.result
}
```

### 2. Content Generation with Validation

```javascript
async function generateArticle(topic) {
  // Generate initial content
  const draft = await orchestra.query(
    `Write a 500-word article about ${topic}`,
    { provider: 'openai' }
  )
  
  // Validate and improve through consensus
  const improved = await orchestra.consensus(
    `Improve this article, checking for accuracy and clarity:\n\n${draft.content}`
  )
  
  return improved.result
}
```

### 3. Decision Support System

```javascript
async function makeDecision(question, context) {
  // Run a structured debate
  const debate = await orchestra.debate(
    `${question}\n\nContext: ${context}`,
    {
      maxRounds: 4,
      threshold: 0.75,
      providers: ['openai', 'anthropic', 'google']
    }
  )
  
  return {
    recommendation: debate.decision,
    confidence: debate.agreement,
    analysis: debate.rounds
  }
}
```

## 🔌 Adding Custom Providers

Orchestra supports custom provider implementations:

```javascript
import { Orchestra, BaseProvider } from '@orchestra-llm/core'

// Create a custom provider
class CustomProvider extends BaseProvider {
  async complete(prompt, options) {
    // Your implementation here
    const response = await this.callYourAPI(prompt)
    return {
      content: response.text,
      usage: {
        promptTokens: response.prompt_tokens,
        completionTokens: response.completion_tokens
      }
    }
  }
  
  async healthCheck() {
    // Check if your API is available
    return true
  }
}

// Register the custom provider
await orchestra.addProvider('custom', {
  provider: new CustomProvider(),
  apiKey: 'your-api-key'
})
```

## ⚙️ Advanced Configuration

### Setting Provider Weights

```javascript
const orchestra = new Orchestra({
  providers: {
    openai: { 
      apiKey: process.env.OPENAI_API_KEY,
      weight: 2 // Double weight in consensus
    },
    anthropic: { 
      apiKey: process.env.ANTHROPIC_API_KEY,
      weight: 1.5
    },
    google: { 
      apiKey: process.env.GOOGLE_API_KEY,
      weight: 1
    }
  }
})
```

### Configuring Retry Logic

```javascript
const orchestra = new Orchestra({
  providers: {
    openai: { 
      apiKey: process.env.OPENAI_API_KEY,
      retry: {
        attempts: 3,
        delay: 1000, // ms
        backoff: 2 // exponential backoff multiplier
      }
    }
  }
})
```

### Custom Consensus Strategies

```javascript
const consensus = await orchestra.consensus(prompt, {
  mode: 'weighted', // 'democratic', 'weighted', 'hierarchical'
  weights: {
    openai: 2,
    anthropic: 1.5,
    google: 1
  },
  minimumProviders: 2, // Require at least 2 providers
  timeout: 30000 // 30 second timeout
})
```

## 🏃 Performance Optimization

### Enable Caching

```javascript
const orchestra = new Orchestra({
  cache: {
    enabled: true,
    ttl: 3600, // seconds
    maxSize: 100, // maximum cached items
    keyGenerator: (prompt, options) => {
      // Custom cache key generation
      return `${prompt}-${JSON.stringify(options)}`
    }
  }
})
```

### Parallel Processing

```javascript
// Process multiple prompts in parallel
const prompts = [
  'Question 1',
  'Question 2',
  'Question 3'
]

const results = await Promise.all(
  prompts.map(prompt => orchestra.consensus(prompt))
)
```

### Stream Responses

```javascript
// Stream responses for real-time output
const stream = await orchestra.stream(
  'Write a long story...',
  { provider: 'openai' }
)

for await (const chunk of stream) {
  process.stdout.write(chunk.content)
}
```

## 🐛 Error Handling

```javascript
try {
  const result = await orchestra.consensus('Your prompt')
} catch (error) {
  if (error.code === 'PROVIDER_ERROR') {
    console.error('Provider failed:', error.provider)
  } else if (error.code === 'TIMEOUT') {
    console.error('Request timed out')
  } else if (error.code === 'NO_CONSENSUS') {
    console.error('Models could not reach agreement')
  }
}
```

## 📊 Monitoring & Analytics

```javascript
// Listen to Orchestra events
orchestra.on('consensus:start', (event) => {
  console.log('Starting consensus:', event)
})

orchestra.on('consensus:complete', (result) => {
  console.log('Consensus reached:', result)
})

orchestra.on('provider:error', (error) => {
  console.error('Provider error:', error)
})

// Get usage statistics
const stats = orchestra.getStats()
console.log('Total requests:', stats.totalRequests)
console.log('Average latency:', stats.averageLatency)
console.log('Provider usage:', stats.providerUsage)
```

## 🔍 Debugging

Enable debug mode for detailed logging:

```javascript
const orchestra = new Orchestra({
  debug: true,
  logLevel: 'verbose' // 'error', 'warn', 'info', 'verbose'
})

// Or set via environment variable
process.env.ORCHESTRA_DEBUG = 'true'
```

## 📚 Next Steps

Now that you have Orchestra running, explore:

- [**Core Concepts**](/concepts) - Deep dive into consensus and debates
- [**API Reference**](/api) - Complete API documentation
- [**Provider Guide**](/providers) - Configure specific providers
- [**Examples**](/examples) - Real-world usage patterns
- [**Architecture**](/architecture) - Technical deep dive

## 💡 Tips & Best Practices

1. **Start Simple**: Begin with single queries before moving to consensus
2. **Test Providers**: Verify API keys with health checks
3. **Monitor Costs**: Track token usage across providers
4. **Cache Wisely**: Cache expensive consensus operations
5. **Handle Failures**: Always implement error handling
6. **Set Timeouts**: Prevent hanging requests
7. **Use Appropriate Models**: Match model capabilities to tasks

## 🆘 Getting Help

- **Documentation**: [Full docs](/)
- **GitHub Issues**: [Report bugs](https://github.com/prakashgbid/orchestra/issues)
- **Discord**: [Join community](https://discord.gg/orchestra)
- **Stack Overflow**: Tag with `orchestra-llm`

---

**Ready to orchestrate?** You now have everything you need to build intelligent multi-model applications!