---
layout: default
title: Examples
---

# Examples

Real-world examples and patterns for using Orchestra in production.

## 📚 Table of Contents

- [Basic Usage](#basic-usage)
- [Consensus Patterns](#consensus-patterns)
- [Debate Scenarios](#debate-scenarios)
- [Production Patterns](#production-patterns)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [Integration Examples](#integration-examples)

---

## Basic Usage

### Simple Query

```javascript
import { Orchestra } from '@orchestra-llm/core'

const orchestra = new Orchestra({
  providers: {
    openai: { apiKey: process.env.OPENAI_API_KEY }
  }
})

// Single provider query
const response = await orchestra.query('What is quantum computing?')
console.log(response.content)
```

### Multiple Providers

```javascript
const orchestra = new Orchestra({
  providers: {
    openai: { apiKey: process.env.OPENAI_API_KEY },
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
    google: { apiKey: process.env.GOOGLE_API_KEY }
  }
})

// Query different providers for comparison
const responses = await Promise.all([
  orchestra.query('Explain React hooks', { provider: 'openai' }),
  orchestra.query('Explain React hooks', { provider: 'anthropic' }),
  orchestra.query('Explain React hooks', { provider: 'google' })
])

responses.forEach(r => {
  console.log(`${r.provider}: ${r.content.substring(0, 100)}...`)
})
```

---

## Consensus Patterns

### Code Review Assistant

```javascript
async function reviewCode(code: string) {
  const orchestra = new Orchestra({
    providers: {
      openai: { apiKey: process.env.OPENAI_API_KEY },
      anthropic: { apiKey: process.env.ANTHROPIC_API_KEY }
    }
  })

  const prompt = `
    Review this code for:
    1. Bugs and potential issues
    2. Security vulnerabilities
    3. Performance optimizations
    4. Best practices
    
    Code:
    ${code}
  `

  const consensus = await orchestra.consensus(prompt, {
    mode: 'weighted',
    weights: {
      openai: 1.5,     // Good at code
      anthropic: 2     // Excellent at analysis
    },
    threshold: 0.8
  })

  return {
    review: consensus.result,
    confidence: consensus.confidence,
    issues: extractIssues(consensus.result)
  }
}

function extractIssues(review: string) {
  // Parse review for specific issues
  const bugs = review.match(/bug:?\s*([^\n]+)/gi) || []
  const security = review.match(/security:?\s*([^\n]+)/gi) || []
  const performance = review.match(/performance:?\s*([^\n]+)/gi) || []
  
  return { bugs, security, performance }
}
```

### Content Moderation

```javascript
async function moderateContent(content: string) {
  const orchestra = new Orchestra({
    providers: {
      openai: { apiKey: process.env.OPENAI_API_KEY },
      anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
      google: { apiKey: process.env.GOOGLE_API_KEY }
    }
  })

  const prompt = `
    Analyze this content for:
    - Hate speech
    - Violence
    - Misinformation
    - Inappropriate content
    
    Return JSON with scores (0-1) for each category.
    
    Content: ${content}
  `

  const consensus = await orchestra.consensus(prompt, {
    mode: 'democratic',  // Equal weight for all
    minimumProviders: 3,  // Require all providers
    synthesis: 'extractive'
  })

  const scores = JSON.parse(consensus.result)
  
  return {
    safe: Object.values(scores).every(s => s < 0.3),
    scores,
    confidence: consensus.confidence
  }
}
```

### Medical Diagnosis Assistant

```javascript
async function analyzeMedicalSymptoms(symptoms: string[]) {
  const orchestra = new Orchestra({
    providers: {
      openai: { apiKey: process.env.OPENAI_API_KEY },
      anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
      google: { apiKey: process.env.GOOGLE_API_KEY }
    },
    safety: {
      enabled: true,
      filters: ['medical_advice'],
      disclaimer: 'This is not medical advice. Consult a healthcare provider.'
    }
  })

  const prompt = `
    Based on these symptoms, what are possible conditions to discuss with a doctor?
    Symptoms: ${symptoms.join(', ')}
    
    Important: This is for educational purposes only.
  `

  const consensus = await orchestra.consensus(prompt, {
    mode: 'hierarchical',
    hierarchy: {
      tier1: ['anthropic'],  // Most cautious with medical info
      tier2: ['openai', 'google']
    },
    threshold: 0.9  // High agreement required
  })

  return {
    possibleConditions: consensus.result,
    confidence: consensus.confidence,
    disclaimer: 'This is not medical advice. Please consult a healthcare provider.',
    shouldSeekCare: consensus.confidence < 0.7  // Low confidence = see doctor
  }
}
```

---

## Debate Scenarios

### Architecture Decision

```javascript
async function debateArchitecture(requirements: string) {
  const orchestra = new Orchestra({
    providers: {
      openai: { apiKey: process.env.OPENAI_API_KEY },
      anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
      google: { apiKey: process.env.GOOGLE_API_KEY }
    }
  })

  const prompt = `
    Given these requirements, should we use microservices or monolithic architecture?
    
    Requirements:
    ${requirements}
    
    Consider: scalability, complexity, team size, time to market, costs
  `

  const debate = await orchestra.debate(prompt, {
    style: 'adversarial',
    maxRounds: 4,
    threshold: 0.75
  })

  // Analyze the debate
  const analysis = {
    recommendation: debate.decision,
    consensus: debate.agreement,
    keyArguments: extractKeyPoints(debate.rounds),
    dissent: findDisagreements(debate.rounds)
  }

  return analysis
}

function extractKeyPoints(rounds: DebateRound[]) {
  return rounds.flatMap(round => 
    round.arguments.map(arg => ({
      provider: arg.provider,
      point: arg.content.substring(0, 100)
    }))
  )
}

function findDisagreements(rounds: DebateRound[]) {
  return rounds
    .filter(r => r.agreement < 0.5)
    .map(r => r.arguments)
}
```

### Investment Analysis

```javascript
async function analyzeInvestment(ticker: string, context: string) {
  const orchestra = new Orchestra({
    providers: {
      openai: { apiKey: process.env.OPENAI_API_KEY },
      anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
      google: { apiKey: process.env.GOOGLE_API_KEY }
    }
  })

  const prompt = `
    Should we invest in ${ticker}? Consider:
    ${context}
    
    Analyze: fundamentals, market trends, risks, growth potential
    Provide: recommendation with reasoning
  `

  // Run structured debate
  const debate = await orchestra.debate(prompt, {
    style: 'socratic',  // Question assumptions
    maxRounds: 5,
    providers: ['openai', 'anthropic', 'google']
  })

  // Get final consensus
  const consensus = await orchestra.consensus(
    `Based on this analysis, summarize the investment recommendation: ${debate.decision}`,
    { threshold: 0.8 }
  )

  return {
    recommendation: consensus.result,
    confidence: consensus.confidence,
    debateInsights: debate.rounds.map(r => ({
      round: r.round,
      keyPoints: r.arguments.map(a => a.content.substring(0, 200))
    })),
    risks: extractRisks(debate.decision),
    disclaimer: 'This is not financial advice'
  }
}
```

---

## Production Patterns

### API Endpoint with Caching

```javascript
import express from 'express'
import { Orchestra } from '@orchestra-llm/core'
import Redis from 'redis'

const app = express()
const redis = Redis.createClient()

const orchestra = new Orchestra({
  providers: {
    openai: { apiKey: process.env.OPENAI_API_KEY },
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY }
  },
  cache: {
    enabled: true,
    ttl: 3600  // 1 hour
  }
})

app.post('/api/consensus', async (req, res) => {
  try {
    const { prompt } = req.body
    
    // Check Redis cache
    const cached = await redis.get(`consensus:${prompt}`)
    if (cached) {
      return res.json(JSON.parse(cached))
    }
    
    // Get consensus
    const result = await orchestra.consensus(prompt, {
      timeout: 30000,
      minimumProviders: 2
    })
    
    // Cache result
    await redis.setex(
      `consensus:${prompt}`, 
      3600, 
      JSON.stringify(result)
    )
    
    res.json(result)
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    })
  }
})
```

### Queue-Based Processing

```javascript
import Bull from 'bull'
import { Orchestra } from '@orchestra-llm/core'

const consensusQueue = new Bull('consensus', {
  redis: {
    host: 'localhost',
    port: 6379
  }
})

const orchestra = new Orchestra({
  providers: {
    openai: { apiKey: process.env.OPENAI_API_KEY },
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY }
  }
})

// Process jobs
consensusQueue.process(async (job) => {
  const { prompt, options } = job.data
  
  const result = await orchestra.consensus(prompt, options)
  
  // Store result
  await saveToDatabase(result)
  
  // Send notification
  await notifyUser(job.data.userId, result)
  
  return result
})

// Add job to queue
async function requestConsensus(userId: string, prompt: string) {
  const job = await consensusQueue.add({
    userId,
    prompt,
    options: {
      mode: 'weighted',
      threshold: 0.8
    }
  })
  
  return job.id
}
```

### Streaming Response

```javascript
import { Orchestra } from '@orchestra-llm/core'

async function streamResponse(prompt: string) {
  const orchestra = new Orchestra({
    providers: {
      openai: { apiKey: process.env.OPENAI_API_KEY }
    }
  })

  const stream = await orchestra.stream(prompt, {
    provider: 'openai',
    temperature: 0.7
  })

  // Process stream
  let fullResponse = ''
  for await (const chunk of stream) {
    fullResponse += chunk.content
    
    // Send to client (e.g., via WebSocket)
    websocket.send(JSON.stringify({
      type: 'chunk',
      content: chunk.content
    }))
  }

  return fullResponse
}
```

---

## Error Handling

### Comprehensive Error Management

```javascript
class OrchestraService {
  private orchestra: Orchestra
  private logger: Logger

  constructor() {
    this.orchestra = new Orchestra({
      providers: {
        openai: { apiKey: process.env.OPENAI_API_KEY },
        anthropic: { apiKey: process.env.ANTHROPIC_API_KEY }
      }
    })
  }

  async getConsensusWithRetry(
    prompt: string, 
    maxRetries = 3
  ): Promise<ConsensusResult> {
    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.orchestra.consensus(prompt, {
          timeout: 30000,
          minimumProviders: 2
        })
      } catch (error) {
        lastError = error
        
        // Log error
        this.logger.error('Consensus failed', {
          attempt,
          error: error.message,
          code: error.code,
          provider: error.provider
        })

        // Handle specific errors
        if (error.code === 'RATE_LIMIT') {
          // Wait before retry
          await this.sleep(Math.pow(2, attempt) * 1000)
        } else if (error.code === 'PROVIDER_ERROR') {
          // Remove failed provider and retry
          this.orchestra.removeProvider(error.provider)
        } else if (error.code === 'NO_CONSENSUS') {
          // Try with lower threshold
          return await this.orchestra.consensus(prompt, {
            threshold: 0.5  // Lower threshold
          })
        }
      }
    }

    throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

### Graceful Degradation

```javascript
async function getRobustResponse(prompt: string) {
  const orchestra = new Orchestra({
    providers: {
      openai: { apiKey: process.env.OPENAI_API_KEY },
      anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
      google: { apiKey: process.env.GOOGLE_API_KEY }
    }
  })

  try {
    // Try consensus first
    return await orchestra.consensus(prompt, {
      minimumProviders: 3,
      threshold: 0.8
    })
  } catch (consensusError) {
    console.warn('Consensus failed, trying with 2 providers')
    
    try {
      // Fall back to 2 providers
      return await orchestra.consensus(prompt, {
        minimumProviders: 2,
        threshold: 0.6
      })
    } catch (partialError) {
      console.warn('Partial consensus failed, using single provider')
      
      // Last resort: single provider
      return await orchestra.query(prompt, {
        provider: 'openai'  // Most reliable
      })
    }
  }
}
```

---

## Performance Optimization

### Parallel Processing

```javascript
async function processMultipleQueries(queries: string[]) {
  const orchestra = new Orchestra({
    providers: {
      openai: { apiKey: process.env.OPENAI_API_KEY },
      anthropic: { apiKey: process.env.ANTHROPIC_API_KEY }
    }
  })

  // Process in batches for rate limiting
  const batchSize = 5
  const results = []

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize)
    
    const batchResults = await Promise.all(
      batch.map(q => orchestra.consensus(q, {
        timeout: 10000,
        mode: 'democratic'
      }))
    )
    
    results.push(...batchResults)
    
    // Rate limit protection
    if (i + batchSize < queries.length) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  return results
}
```

### Smart Caching

```javascript
import crypto from 'crypto'

class CachedOrchestra {
  private orchestra: Orchestra
  private cache: Map<string, any>
  private embeddings: Map<string, number[]>

  constructor() {
    this.orchestra = new Orchestra({
      providers: {
        openai: { apiKey: process.env.OPENAI_API_KEY }
      }
    })
    this.cache = new Map()
    this.embeddings = new Map()
  }

  async query(prompt: string, options?: any) {
    // Generate cache key
    const key = this.getCacheKey(prompt, options)
    
    // Check exact match
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }
    
    // Check semantic similarity
    const similar = await this.findSimilar(prompt)
    if (similar && similar.similarity > 0.95) {
      return similar.result
    }
    
    // Execute query
    const result = await this.orchestra.query(prompt, options)
    
    // Cache result
    this.cache.set(key, result)
    
    // Store embedding for similarity search
    const embedding = await this.getEmbedding(prompt)
    this.embeddings.set(key, embedding)
    
    return result
  }

  private getCacheKey(prompt: string, options: any): string {
    const hash = crypto.createHash('sha256')
    hash.update(prompt)
    hash.update(JSON.stringify(options || {}))
    return hash.digest('hex')
  }

  private async findSimilar(prompt: string) {
    const embedding = await this.getEmbedding(prompt)
    
    let bestMatch = null
    let bestSimilarity = 0
    
    for (const [key, cached] of this.embeddings) {
      const similarity = this.cosineSimilarity(embedding, cached)
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestMatch = key
      }
    }
    
    if (bestMatch && bestSimilarity > 0.95) {
      return {
        similarity: bestSimilarity,
        result: this.cache.get(bestMatch)
      }
    }
    
    return null
  }

  private async getEmbedding(text: string): Promise<number[]> {
    // Implementation would call embedding API
    return []
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    // Calculate cosine similarity
    return 0
  }
}
```

---

## Integration Examples

### Next.js API Route

```typescript
// pages/api/orchestra.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { Orchestra } from '@orchestra-llm/core'

const orchestra = new Orchestra({
  providers: {
    openai: { apiKey: process.env.OPENAI_API_KEY },
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY }
  }
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, mode = 'consensus' } = req.body

  try {
    let result
    
    if (mode === 'consensus') {
      result = await orchestra.consensus(prompt)
    } else if (mode === 'debate') {
      result = await orchestra.debate(prompt)
    } else {
      result = await orchestra.query(prompt)
    }
    
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    })
  }
}
```

### GraphQL Resolver

```typescript
import { Orchestra } from '@orchestra-llm/core'

const orchestra = new Orchestra({
  providers: {
    openai: { apiKey: process.env.OPENAI_API_KEY },
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY }
  }
})

export const resolvers = {
  Query: {
    consensus: async (_, { prompt, options }) => {
      const result = await orchestra.consensus(prompt, options)
      return {
        id: generateId(),
        result: result.result,
        confidence: result.confidence,
        agreement: result.agreement,
        providers: result.providers
      }
    },
    
    debate: async (_, { prompt, options }) => {
      const result = await orchestra.debate(prompt, options)
      return {
        id: generateId(),
        decision: result.decision,
        rounds: result.rounds,
        agreement: result.agreement
      }
    }
  },
  
  Mutation: {
    addProvider: async (_, { name, config }) => {
      await orchestra.addProvider(name, config)
      return {
        success: true,
        providers: orchestra.getProviders()
      }
    }
  }
}
```

### React Hook

```typescript
import { useState, useCallback } from 'react'
import { Orchestra } from '@orchestra-llm/core'

const orchestra = new Orchestra({
  providers: {
    openai: { apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY }
  }
})

export function useOrchestra() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const getConsensus = useCallback(async (prompt: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const consensus = await orchestra.consensus(prompt)
      setResult(consensus)
      return consensus
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const debate = useCallback(async (prompt: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const debateResult = await orchestra.debate(prompt)
      setResult(debateResult)
      return debateResult
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    getConsensus,
    debate,
    loading,
    error,
    result
  }
}
```

---

**More examples?** Check our [GitHub repository](https://github.com/prakashgbid/orchestra/tree/main/examples) for complete, runnable examples.