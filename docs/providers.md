---
layout: page
title: Provider Guide
permalink: /providers/
---

# Provider Guide

Complete guide to configuring and using LLM providers with Orchestra.

## 📋 Supported Providers

Orchestra supports a growing list of LLM providers:

| Provider | Status | Models | Strengths |
|----------|--------|--------|-----------|
| OpenAI | ✅ Stable | GPT-4, GPT-3.5 | Code, creative writing, general |
| Anthropic | ✅ Stable | Claude 3 Opus, Sonnet, Haiku | Analysis, safety, long context |
| Google | ✅ Stable | Gemini Pro, Ultra | Multimodal, reasoning |
| Cohere | ✅ Stable | Command, Command-R | Search, classification |
| Hugging Face | ✅ Stable | Various | Open source models |
| Azure OpenAI | ✅ Stable | GPT-4, GPT-3.5 | Enterprise, compliance |
| AWS Bedrock | 🚧 Beta | Various | Enterprise AWS integration |
| Replicate | 🚧 Beta | Various | Custom models |
| Together AI | 📋 Planned | Various | Fast inference |
| Mistral | 📋 Planned | Mistral models | European, efficient |

---

## 🔧 Provider Configuration

### OpenAI

```typescript
const orchestra = new Orchestra({
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo'
      temperature: 0.7,
      maxTokens: 2000,
      organization: 'org-...',  // Optional
      baseUrl: 'https://api.openai.com/v1', // Optional custom endpoint
      headers: {
        'OpenAI-Beta': 'assistants=v1' // Optional headers
      },
      retry: {
        attempts: 3,
        delay: 1000
      }
    }
  }
})
```

#### Available Models

- `gpt-4-turbo-preview` - Latest GPT-4 Turbo
- `gpt-4` - GPT-4 base model
- `gpt-4-32k` - GPT-4 with 32k context
- `gpt-3.5-turbo` - Fast and cost-effective
- `gpt-3.5-turbo-16k` - Extended context

#### Best Practices

```typescript
// For code generation
const codeResult = await orchestra.query(prompt, {
  provider: 'openai',
  model: 'gpt-4-turbo-preview',
  temperature: 0.2  // Lower temperature for accuracy
})

// For creative writing
const creativeResult = await orchestra.query(prompt, {
  provider: 'openai',
  model: 'gpt-4',
  temperature: 0.8,  // Higher for creativity
  topP: 0.9
})
```

---

### Anthropic (Claude)

```typescript
const orchestra = new Orchestra({
  providers: {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-opus-20240229',
      maxTokens: 4000,
      temperature: 0.7,
      anthropicVersion: '2023-06-01',
      baseUrl: 'https://api.anthropic.com',
      headers: {
        'anthropic-beta': 'messages-2023-12-15'
      }
    }
  }
})
```

#### Available Models

- `claude-3-opus-20240229` - Most capable, best for complex tasks
- `claude-3-sonnet-20240229` - Balanced performance and cost
- `claude-3-haiku-20240307` - Fastest, most cost-effective
- `claude-2.1` - Previous generation, 200K context
- `claude-instant-1.2` - Fast responses

#### Special Features

```typescript
// Long document analysis (200K tokens)
const analysis = await orchestra.query(longDocument, {
  provider: 'anthropic',
  model: 'claude-3-opus-20240229',
  maxTokens: 4000,
  system: 'You are a document analyst. Be thorough and precise.'
})

// Constitutional AI for safety
const safeResponse = await orchestra.query(prompt, {
  provider: 'anthropic',
  model: 'claude-3-sonnet-20240229',
  temperature: 0.5,
  metadata: {
    constitutional: true  // Enable extra safety checks
  }
})
```

---

### Google (Gemini)

```typescript
const orchestra = new Orchestra({
  providers: {
    google: {
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'gemini-pro',
      temperature: 0.7,
      maxOutputTokens: 2048,
      topK: 40,
      topP: 0.95,
      candidateCount: 1,
      safetySettings: [
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }
  }
})
```

#### Available Models

- `gemini-pro` - Best for text tasks
- `gemini-pro-vision` - Multimodal (text + images)
- `gemini-ultra` - Most capable (coming soon)

#### Multimodal Capabilities

```typescript
// Text + Image analysis
const visionResult = await orchestra.query({
  text: 'What is in this image?',
  images: ['base64_encoded_image_data']
}, {
  provider: 'google',
  model: 'gemini-pro-vision'
})

// With safety settings
const safeResult = await orchestra.query(prompt, {
  provider: 'google',
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_LOW_AND_ABOVE'
    }
  ]
})
```

---

### Cohere

```typescript
const orchestra = new Orchestra({
  providers: {
    cohere: {
      apiKey: process.env.COHERE_API_KEY,
      model: 'command-r',
      temperature: 0.7,
      maxTokens: 1000,
      k: 0,  // Top-k sampling
      p: 0.75,  // Top-p sampling
      frequencyPenalty: 0,
      presencePenalty: 0,
      endSequences: [],
      returnLikelihoods: 'NONE'
    }
  }
})
```

#### Available Models

- `command-r` - Latest model, best performance
- `command` - Production model
- `command-light` - Faster, lighter model
- `command-nightly` - Experimental features

#### Specialized Features

```typescript
// Search and retrieval
const searchResult = await orchestra.query(prompt, {
  provider: 'cohere',
  model: 'command-r',
  searchQueriesOnly: true
})

// Classification
const classification = await orchestra.classify(texts, {
  provider: 'cohere',
  examples: [
    { text: 'I love this!', label: 'positive' },
    { text: 'This is terrible', label: 'negative' }
  ]
})
```

---

### Hugging Face

```typescript
const orchestra = new Orchestra({
  providers: {
    huggingface: {
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: 'meta-llama/Llama-2-70b-chat-hf',
      temperature: 0.7,
      maxNewTokens: 500,
      topP: 0.95,
      repetitionPenalty: 1.1,
      doSample: true,
      endpoint: 'inference-api'  // or 'inference-endpoints'
    }
  }
})
```

#### Popular Models

- `meta-llama/Llama-2-70b-chat-hf` - Llama 2 70B
- `mistralai/Mixtral-8x7B-Instruct-v0.1` - Mixtral MoE
- `google/flan-t5-xxl` - T5 11B
- `bigscience/bloom` - BLOOM 176B
- `EleutherAI/gpt-neox-20b` - GPT-NeoX

#### Using Custom Endpoints

```typescript
// Inference Endpoints (dedicated)
const orchestra = new Orchestra({
  providers: {
    huggingface: {
      apiKey: process.env.HUGGINGFACE_API_KEY,
      endpoint: 'https://your-endpoint.endpoints.huggingface.cloud',
      model: 'custom-model'
    }
  }
})
```

---

### Azure OpenAI

```typescript
const orchestra = new Orchestra({
  providers: {
    azure: {
      apiKey: process.env.AZURE_OPENAI_KEY,
      endpoint: 'https://your-resource.openai.azure.com',
      deploymentName: 'gpt-4-deployment',
      apiVersion: '2024-02-15-preview',
      defaultHeaders: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
      }
    }
  }
})
```

#### Enterprise Features

```typescript
// With managed identity
const orchestra = new Orchestra({
  providers: {
    azure: {
      endpoint: process.env.AZURE_ENDPOINT,
      deploymentName: 'gpt-4',
      authentication: {
        type: 'managed-identity',
        clientId: process.env.AZURE_CLIENT_ID
      }
    }
  }
})

// With content filtering
const filtered = await orchestra.query(prompt, {
  provider: 'azure',
  contentFilter: {
    hate: 'strict',
    violence: 'strict',
    sexual: 'strict',
    selfHarm: 'strict'
  }
})
```

---

## 🎯 Provider Selection Strategies

### Manual Selection

```typescript
// Explicitly choose provider
const result = await orchestra.query(prompt, {
  provider: 'anthropic'
})
```

### Automatic Selection

```typescript
// Let Orchestra choose based on task
const result = await orchestra.query(prompt, {
  autoSelect: true,
  taskType: 'code-generation',  // Orchestra picks best provider
  requirements: {
    maxLatency: 5000,  // ms
    maxCost: 0.01,     // USD
    minQuality: 0.8    // 0-1 score
  }
})
```

### Capability-Based Routing

```typescript
const orchestra = new Orchestra({
  routing: {
    rules: [
      {
        condition: { taskType: 'code' },
        provider: 'openai'
      },
      {
        condition: { taskType: 'analysis' },
        provider: 'anthropic'
      },
      {
        condition: { hasImages: true },
        provider: 'google'
      },
      {
        condition: { requiresSearch: true },
        provider: 'cohere'
      }
    ],
    fallback: 'openai'
  }
})
```

---

## 🔄 Provider Fallbacks

Configure automatic fallbacks when providers fail:

```typescript
const orchestra = new Orchestra({
  providers: {
    openai: { apiKey: '...', priority: 1 },
    anthropic: { apiKey: '...', priority: 2 },
    google: { apiKey: '...', priority: 3 }
  },
  fallback: {
    enabled: true,
    strategy: 'priority',  // or 'round-robin', 'random'
    maxAttempts: 3
  }
})

// Automatic fallback on failure
const result = await orchestra.query(prompt)
// Tries OpenAI first, then Anthropic, then Google
```

---

## 📊 Provider Comparison

### Performance Metrics

| Provider | Avg Latency | Token/sec | Context Window | Cost/1K tokens |
|----------|------------|-----------|----------------|----------------|
| GPT-4 Turbo | 2-5s | 50-70 | 128K | $0.01/$0.03 |
| Claude 3 Opus | 3-6s | 40-60 | 200K | $0.015/$0.075 |
| Gemini Pro | 1-3s | 60-80 | 32K | $0.001/$0.002 |
| GPT-3.5 Turbo | 0.5-2s | 80-100 | 16K | $0.001/$0.002 |
| Claude 3 Haiku | 0.3-1s | 100-150 | 200K | $0.00025/$0.00125 |

### Capability Matrix

| Capability | OpenAI | Claude | Gemini | Cohere |
|------------|--------|--------|--------|--------|
| Code Generation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Creative Writing | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Analysis | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Math/Logic | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Multimodal | ⭐⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ❌ |
| Safety | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Search/RAG | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🛠️ Custom Provider Implementation

Create your own provider:

```typescript
import { BaseProvider, ProviderConfig, Response } from '@orchestra-llm/core'

export class CustomProvider extends BaseProvider {
  private client: any

  constructor(config: ProviderConfig) {
    super(config)
    this.client = new YourAPIClient({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl
    })
  }

  async complete(prompt: string, options?: any): Promise<Response> {
    const startTime = Date.now()
    
    try {
      const response = await this.client.generate({
        prompt,
        model: this.config.model || 'default-model',
        temperature: options?.temperature || this.config.temperature,
        maxTokens: options?.maxTokens || this.config.maxTokens
      })

      return {
        content: response.text,
        provider: 'custom',
        model: response.model,
        usage: {
          promptTokens: response.usage.input,
          completionTokens: response.usage.output,
          totalTokens: response.usage.total
        },
        latency: Date.now() - startTime,
        timestamp: new Date()
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async stream(prompt: string, options?: any): AsyncIterable<any> {
    const stream = await this.client.generateStream({
      prompt,
      ...options
    })

    for await (const chunk of stream) {
      yield {
        content: chunk.text,
        provider: 'custom'
      }
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.ping()
      return true
    } catch {
      return false
    }
  }

  private handleError(error: any): Error {
    if (error.code === 'RATE_LIMIT') {
      return new RateLimitError('Rate limit exceeded', this.name)
    }
    return new ProviderError(error.message, this.name)
  }
}

// Register the custom provider
const orchestra = new Orchestra({
  providers: {
    custom: new CustomProvider({
      apiKey: process.env.CUSTOM_API_KEY,
      baseUrl: 'https://api.custom-llm.com'
    })
  }
})
```

---

## 🔐 Security Best Practices

### API Key Management

```typescript
// Use environment variables
const orchestra = new Orchestra({
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY
    }
  }
})

// Or use a key management service
import { SecretManager } from '@aws-sdk/client-secrets-manager'

const secrets = await secretManager.getSecret('orchestra-keys')
const orchestra = new Orchestra({
  providers: {
    openai: {
      apiKey: secrets.openai
    }
  }
})
```

### Request Sanitization

```typescript
const orchestra = new Orchestra({
  security: {
    sanitizeRequests: true,
    blockPatterns: [
      /api[_-]?key/i,
      /password/i,
      /secret/i
    ],
    redactResponses: true
  }
})
```

---

## 📈 Provider Monitoring

Track provider performance:

```typescript
orchestra.on('provider:response', (event) => {
  // Log to monitoring service
  monitor.track({
    provider: event.provider,
    latency: event.latency,
    tokens: event.usage.totalTokens,
    cost: calculateCost(event),
    timestamp: event.timestamp
  })
})

// Get provider statistics
const stats = orchestra.getProviderStats('openai')
console.log({
  requests: stats.totalRequests,
  avgLatency: stats.averageLatency,
  errorRate: stats.errorRate,
  totalCost: stats.totalCost
})
```

---

## 🚀 Performance Optimization

### Connection Pooling

```typescript
const orchestra = new Orchestra({
  providers: {
    openai: {
      apiKey: '...',
      connection: {
        poolSize: 10,
        keepAlive: true,
        timeout: 30000
      }
    }
  }
})
```

### Request Batching

```typescript
// Batch multiple requests to same provider
const results = await orchestra.batchQuery([
  'Query 1',
  'Query 2',
  'Query 3'
], {
  provider: 'openai',
  batchSize: 10,
  parallel: true
})
```

---

## 🔧 Troubleshooting

### Common Issues

#### Authentication Errors

```typescript
// Check API key validity
const health = await orchestra.healthCheck()
if (!health.openai) {
  console.error('OpenAI authentication failed')
}
```

#### Rate Limiting

```typescript
// Configure rate limit handling
const orchestra = new Orchestra({
  providers: {
    openai: {
      apiKey: '...',
      rateLimit: {
        requestsPerMinute: 60,
        strategy: 'exponential-backoff',
        maxRetries: 5
      }
    }
  }
})
```

#### Timeout Issues

```typescript
// Increase timeout for slow providers
const result = await orchestra.query(prompt, {
  provider: 'anthropic',
  timeout: 60000  // 60 seconds
})
```

---

## 📚 Provider Resources

- [OpenAI Documentation](https://platform.openai.com/docs)
- [Anthropic Documentation](https://docs.anthropic.com)
- [Google AI Documentation](https://ai.google.dev/docs)
- [Cohere Documentation](https://docs.cohere.com)
- [Hugging Face Documentation](https://huggingface.co/docs)

---

**Need help with providers?** Check our [FAQ](/faq) or join our [Discord community](https://discord.gg/orchestra).