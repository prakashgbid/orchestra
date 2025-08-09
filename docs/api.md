---
layout: default
title: API Reference
---

# API Reference

Complete API documentation for Orchestra with TypeScript types and detailed examples.

## Table of Contents

- [Orchestra Class](#orchestra-class)
- [Methods](#methods)
- [Types](#types)
- [Events](#events)
- [Providers](#providers)
- [Errors](#errors)

---

## Orchestra Class

The main orchestration class that coordinates multiple LLM providers.

### Constructor

```typescript
new Orchestra(config: OrchestraConfig)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| config | `OrchestraConfig` | Yes | Configuration object for Orchestra |

#### Example

```typescript
import { Orchestra } from '@orchestra-llm/core'

const orchestra = new Orchestra({
  providers: {
    openai: { apiKey: 'sk-...' },
    anthropic: { apiKey: 'sk-ant-...' }
  },
  defaultProvider: 'openai',
  consensusThreshold: 0.7,
  maxDebateRounds: 3
})
```

---

## Methods

### query()

Query a single provider.

```typescript
async query(
  prompt: string, 
  options?: QueryOptions
): Promise<Response>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| prompt | `string` | Yes | The prompt to send to the provider |
| options | `QueryOptions` | No | Query configuration options |

#### Returns

`Promise<Response>` - The provider's response

#### Example

```typescript
const response = await orchestra.query(
  'Explain quantum computing',
  { 
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 500
  }
)
```

---

### consensus()

Build consensus from multiple providers.

```typescript
async consensus(
  prompt: string,
  options?: ConsensusOptions
): Promise<ConsensusResult>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| prompt | `string` | Yes | The prompt for consensus building |
| options | `ConsensusOptions` | No | Consensus configuration |

#### Returns

`Promise<ConsensusResult>` - Consensus result with agreement metrics

#### Example

```typescript
const consensus = await orchestra.consensus(
  'What is the best database for a startup?',
  {
    providers: ['openai', 'anthropic', 'google'],
    mode: 'weighted',
    threshold: 0.75
  }
)
```

---

### debate()

Run a structured debate between providers.

```typescript
async debate(
  prompt: string,
  options?: DebateOptions
): Promise<DebateResult>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| prompt | `string` | Yes | The topic for debate |
| options | `DebateOptions` | No | Debate configuration |

#### Returns

`Promise<DebateResult>` - Debate outcome with rounds and decision

#### Example

```typescript
const debate = await orchestra.debate(
  'Microservices vs Monolithic architecture',
  {
    maxRounds: 3,
    threshold: 0.8,
    style: 'adversarial'
  }
)
```

---

### addProvider()

Dynamically add a new provider.

```typescript
async addProvider(
  name: string,
  config: ProviderConfig
): Promise<void>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | `string` | Yes | Unique provider identifier |
| config | `ProviderConfig` | No | Provider configuration |

#### Example

```typescript
await orchestra.addProvider('custom', {
  apiKey: 'custom-key',
  baseUrl: 'https://api.custom-llm.com',
  model: 'custom-model-v1'
})
```

---

### removeProvider()

Remove a provider from the registry.

```typescript
removeProvider(name: string): void
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | `string` | Yes | Provider identifier to remove |

#### Example

```typescript
orchestra.removeProvider('custom')
```

---

### getProviders()

Get list of available providers.

```typescript
getProviders(): string[]
```

#### Returns

`string[]` - Array of provider names

#### Example

```typescript
const providers = orchestra.getProviders()
// ['openai', 'anthropic', 'google']
```

---

### healthCheck()

Check health status of all providers.

```typescript
async healthCheck(): Promise<Record<string, boolean>>
```

#### Returns

`Promise<Record<string, boolean>>` - Health status for each provider

#### Example

```typescript
const health = await orchestra.healthCheck()
// { openai: true, anthropic: true, google: false }
```

---

### batch()

Process multiple queries in parallel.

```typescript
async batch(
  queries: BatchQuery[]
): Promise<BatchResult[]>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| queries | `BatchQuery[]` | Yes | Array of queries to process |

#### Example

```typescript
const results = await orchestra.batch([
  { prompt: 'Query 1', options: { provider: 'openai' } },
  { prompt: 'Query 2', options: { provider: 'anthropic' } }
])
```

---

### stream()

Stream responses in real-time.

```typescript
async stream(
  prompt: string,
  options?: StreamOptions
): Promise<AsyncIterable<StreamChunk>>
```

#### Returns

`AsyncIterable<StreamChunk>` - Async iterator of response chunks

#### Example

```typescript
const stream = await orchestra.stream('Write a story...')

for await (const chunk of stream) {
  process.stdout.write(chunk.content)
}
```

---

## Types

### OrchestraConfig

Main configuration object.

```typescript
interface OrchestraConfig {
  providers: Record<string, ProviderConfig>
  defaultProvider?: string
  consensusThreshold?: number
  maxDebateRounds?: number
  cache?: CacheConfig
  safety?: SafetyConfig
  debug?: boolean
  logLevel?: 'error' | 'warn' | 'info' | 'verbose'
}
```

### ProviderConfig

Provider configuration.

```typescript
interface ProviderConfig {
  apiKey: string
  baseUrl?: string
  model?: string
  temperature?: number
  maxTokens?: number
  timeout?: number
  retry?: RetryConfig
  weight?: number
  headers?: Record<string, string>
}
```

### QueryOptions

Options for single queries.

```typescript
interface QueryOptions {
  provider?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stopSequences?: string[]
  timeout?: number
  stream?: boolean
}
```

### ConsensusOptions

Options for consensus building.

```typescript
interface ConsensusOptions {
  providers?: string[]
  mode?: 'democratic' | 'weighted' | 'hierarchical'
  weights?: Record<string, number>
  threshold?: number
  minimumProviders?: number
  timeout?: number
  synthesis?: 'extractive' | 'abstractive' | 'hybrid'
}
```

### DebateOptions

Options for debates.

```typescript
interface DebateOptions {
  providers?: string[]
  maxRounds?: number
  threshold?: number
  style?: 'socratic' | 'adversarial' | 'collaborative'
  synthesizer?: string
  timeout?: number
}
```

### Response

Provider response object.

```typescript
interface Response {
  content: string
  provider: string
  model?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  latency: number
  timestamp: Date
  metadata?: Record<string, any>
}
```

### ConsensusResult

Result from consensus building.

```typescript
interface ConsensusResult {
  result: string
  confidence: number
  agreement: number
  providers: string[]
  reasoning: string
  responses: Response[]
  dissent?: {
    provider: string
    reason: string
  }[]
  metadata: {
    duration: number
    rounds: number
    synthesis: string
  }
}
```

### DebateResult

Result from debates.

```typescript
interface DebateResult {
  decision: string
  rounds: DebateRound[]
  agreement: number
  participants: string[]
  confidence: number
  summary: string
  metadata: {
    duration: number
    totalRounds: number
    convergenceRound: number
  }
}
```

### DebateRound

Individual debate round.

```typescript
interface DebateRound {
  round: number
  arguments: Response[]
  agreement: number
  synthesis?: string
  convergence: boolean
}
```

### CacheConfig

Cache configuration.

```typescript
interface CacheConfig {
  enabled: boolean
  ttl?: number
  maxSize?: number
  strategy?: 'lru' | 'lfu' | 'ttl'
  semanticMatch?: boolean
  embedding?: string
  threshold?: number
}
```

### SafetyConfig

Safety configuration.

```typescript
interface SafetyConfig {
  enabled: boolean
  filters?: string[]
  threshold?: 'strict' | 'moderate' | 'relaxed'
  fallback?: 'refuse' | 'sanitize' | 'warn'
  customFilters?: SafetyFilter[]
}
```

### RetryConfig

Retry configuration.

```typescript
interface RetryConfig {
  attempts: number
  delay: number
  backoff?: number
  maxDelay?: number
  onRetry?: (error: Error, attempt: number) => void
}
```

---

## Events

Orchestra emits events during operation.

### Event Types

```typescript
type OrchestraEvent = 
  | 'initialized'
  | 'consensus:start'
  | 'consensus:progress'
  | 'consensus:complete'
  | 'debate:start'
  | 'debate:round'
  | 'debate:complete'
  | 'provider:added'
  | 'provider:removed'
  | 'provider:error'
  | 'provider:response'
  | 'cache:hit'
  | 'cache:miss'
```

### Event Listeners

```typescript
orchestra.on('consensus:start', (event: ConsensusStartEvent) => {
  console.log('Consensus started:', event)
})

orchestra.on('provider:error', (error: ProviderErrorEvent) => {
  console.error('Provider error:', error)
})

orchestra.on('debate:round', (round: DebateRoundEvent) => {
  console.log('Debate round:', round)
})
```

### Event Objects

```typescript
interface ConsensusStartEvent {
  prompt: string
  providers: string[]
  options: ConsensusOptions
  timestamp: Date
}

interface ProviderErrorEvent {
  provider: string
  error: Error
  prompt: string
  timestamp: Date
}

interface DebateRoundEvent {
  round: number
  agreement: number
  arguments: Response[]
  timestamp: Date
}
```

---

## Providers

### Built-in Providers

Orchestra supports these providers out of the box:

| Provider | Class | Models |
|----------|-------|--------|
| OpenAI | `OpenAIProvider` | GPT-4, GPT-3.5 |
| Anthropic | `AnthropicProvider` | Claude 3 Opus, Sonnet, Haiku |
| Google | `GoogleProvider` | Gemini Pro, Gemini Ultra |
| Cohere | `CohereProvider` | Command, Command-R |
| Hugging Face | `HuggingFaceProvider` | Various open models |

### Custom Provider Implementation

```typescript
import { BaseProvider } from '@orchestra-llm/core'

export class CustomProvider extends BaseProvider {
  constructor(config: ProviderConfig) {
    super(config)
  }

  async complete(prompt: string, options?: QueryOptions): Promise<Response> {
    // Your implementation
    const response = await this.callAPI(prompt, options)
    
    return {
      content: response.text,
      provider: 'custom',
      model: this.config.model,
      usage: {
        promptTokens: response.usage.input,
        completionTokens: response.usage.output,
        totalTokens: response.usage.total
      },
      latency: response.latency,
      timestamp: new Date()
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.callAPI('test', { maxTokens: 1 })
      return true
    } catch {
      return false
    }
  }
}
```

---

## Errors

### Error Types

```typescript
class OrchestraError extends Error {
  code: string
  provider?: string
  details?: any
}

class ProviderError extends OrchestraError {
  code: 'PROVIDER_ERROR'
  provider: string
}

class ConsensusError extends OrchestraError {
  code: 'NO_CONSENSUS'
  agreement: number
  responses: Response[]
}

class TimeoutError extends OrchestraError {
  code: 'TIMEOUT'
  duration: number
}

class ValidationError extends OrchestraError {
  code: 'VALIDATION_ERROR'
  field: string
  value: any
}
```

### Error Handling

```typescript
try {
  const result = await orchestra.consensus(prompt)
} catch (error) {
  if (error instanceof ProviderError) {
    console.error(`Provider ${error.provider} failed:`, error.message)
  } else if (error instanceof ConsensusError) {
    console.error('No consensus reached:', error.agreement)
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out after:', error.duration)
  } else {
    console.error('Unknown error:', error)
  }
}
```

---

## Advanced Usage

### Middleware

```typescript
orchestra.use({
  name: 'logging-middleware',
  before: async (context) => {
    console.log('Request:', context.prompt)
  },
  after: async (context, result) => {
    console.log('Response:', result)
    return result
  },
  onError: async (context, error) => {
    console.error('Error:', error)
    throw error
  }
})
```

### Custom Agreement Function

```typescript
orchestra.setAgreementFunction((responses: Response[]) => {
  // Custom agreement calculation
  const vectors = responses.map(r => embed(r.content))
  const similarity = cosineSimilarity(vectors)
  return similarity
})
```

### Custom Synthesis Function

```typescript
orchestra.setSynthesisFunction((responses: Response[], agreement: number) => {
  // Custom synthesis logic
  if (agreement > 0.9) {
    return responses[0].content // High agreement, use first
  } else {
    return mergeResponses(responses) // Low agreement, merge all
  }
})
```

---

## TypeScript Support

Orchestra is written in TypeScript and provides full type definitions.

```typescript
import { 
  Orchestra, 
  OrchestraConfig,
  ConsensusResult,
  DebateResult,
  Response 
} from '@orchestra-llm/core'

// Full type safety and IntelliSense
const config: OrchestraConfig = {
  providers: {
    openai: { apiKey: process.env.OPENAI_KEY! }
  }
}

const orchestra = new Orchestra(config)

// TypeScript knows the return types
const consensus: ConsensusResult = await orchestra.consensus('...')
const debate: DebateResult = await orchestra.debate('...')
```

---

## Rate Limiting

Orchestra handles rate limiting automatically:

```typescript
const orchestra = new Orchestra({
  providers: {
    openai: {
      apiKey: 'sk-...',
      rateLimit: {
        requestsPerMinute: 60,
        tokensPerMinute: 90000,
        strategy: 'sliding-window' // or 'fixed-window'
      }
    }
  }
})
```

---

## Telemetry

Track usage and performance:

```typescript
const stats = orchestra.getStats()

console.log({
  totalRequests: stats.totalRequests,
  averageLatency: stats.averageLatency,
  cacheHitRate: stats.cacheHitRate,
  providerUsage: stats.providerUsage,
  tokenUsage: stats.tokenUsage,
  costs: stats.costs
})
```

---

**Need more details?** Check out our [examples](/examples) or join our [Discord community](https://discord.gg/orchestra).