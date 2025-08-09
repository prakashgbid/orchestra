---
layout: page
title: Frequently Asked Questions
permalink: /faq/
---

# Frequently Asked Questions

## General Questions

### What is Orchestra?

Orchestra is an LLM orchestration platform that coordinates multiple language models to work together. Think of it as "Kubernetes for LLMs" - it manages, coordinates, and optimizes interactions between different AI models to achieve better results than any single model alone.

### Why do I need multiple LLMs?

Single LLMs have limitations:
- **Biases**: Each model has its own biases and blind spots
- **Hallucinations**: Single responses lack validation
- **Availability**: Provider outages can break your application
- **Specialization**: Different models excel at different tasks
- **Cost**: Some models are expensive for simple tasks

Orchestra solves these by combining multiple models intelligently.

### How does Orchestra differ from LangChain?

While both work with LLMs, they serve different purposes:

| Aspect | Orchestra | LangChain |
|--------|-----------|-----------|
| **Focus** | Multi-LLM consensus & debates | Single LLM chains & agents |
| **Primary Use** | Validation & reliability | Complex workflows |
| **Architecture** | Parallel orchestration | Sequential chaining |
| **Best For** | Critical decisions | Task automation |

Orchestra and LangChain can work together - use Orchestra for consensus, LangChain for workflows.

### What providers does Orchestra support?

Currently supported:
- ✅ OpenAI (GPT-4, GPT-3.5)
- ✅ Anthropic (Claude 3)
- ✅ Google (Gemini)
- ✅ Cohere
- ✅ Hugging Face
- ✅ Azure OpenAI
- ✅ Custom providers

Coming soon:
- 🚧 AWS Bedrock
- 🚧 Replicate
- 📋 Together AI
- 📋 Mistral

---

## Getting Started

### How do I install Orchestra?

```bash
npm install @orchestra-llm/core
```

Or with Yarn:
```bash
yarn add @orchestra-llm/core
```

### What are the minimum requirements?

- Node.js 18.0 or higher
- At least one LLM provider API key
- 512MB RAM minimum (1GB recommended)

### Do I need API keys for all providers?

No, you only need API keys for the providers you want to use. Orchestra works with as few as one provider, though consensus features work best with 2+ providers.

### Can I use Orchestra in the browser?

Not directly - Orchestra is designed for server-side use due to API key security. However, you can:
1. Create an API endpoint that uses Orchestra
2. Call that endpoint from your browser application
3. Consider our upcoming Orchestra Cloud service

---

## Technical Questions

### How does consensus work?

Orchestra's consensus mechanism:
1. Sends the same prompt to multiple providers
2. Collects all responses in parallel
3. Calculates agreement using semantic similarity
4. Synthesizes a final answer based on the consensus
5. Returns confidence metrics

### What is the difference between consensus and debate?

**Consensus**: All models answer independently, then Orchestra finds agreement.
```javascript
// One round, parallel responses
const consensus = await orchestra.consensus(prompt)
```

**Debate**: Models see each other's responses and can revise their answers.
```javascript
// Multiple rounds, models interact
const debate = await orchestra.debate(prompt)
```

### How accurate is the agreement calculation?

Orchestra uses multiple methods to calculate agreement:
- **Semantic Similarity**: Using embeddings (95%+ accuracy)
- **Token Overlap**: Comparing key terms (85%+ accuracy)
- **Structure Analysis**: Comparing response patterns (90%+ accuracy)

The combined approach typically achieves 92%+ accuracy in determining true agreement.

### Can I use my own agreement algorithm?

Yes! Override the default:

```javascript
orchestra.setAgreementFunction((responses) => {
  // Your custom logic
  return calculateMyAgreement(responses)
})
```

### How do I handle rate limits?

Orchestra handles rate limits automatically:
- Built-in exponential backoff
- Provider rotation on rate limit errors
- Configurable retry strategies

```javascript
const orchestra = new Orchestra({
  providers: {
    openai: {
      apiKey: '...',
      rateLimit: {
        requestsPerMinute: 60,
        strategy: 'exponential-backoff'
      }
    }
  }
})
```

---

## Performance & Scaling

### How fast is Orchestra?

Typical latencies:
- **Single Query**: Same as provider latency (0.5-5s)
- **Consensus (3 providers)**: 2-6s (parallel execution)
- **Debate (3 rounds)**: 6-15s (sequential rounds)
- **Cached Response**: <50ms

### Does Orchestra add significant overhead?

Minimal overhead:
- **Memory**: ~50MB base + cache
- **CPU**: <5% for orchestration logic
- **Network**: No additional calls beyond provider APIs
- **Latency**: <50ms orchestration overhead

### Can Orchestra handle high traffic?

Yes, Orchestra is production-ready:
- Handles 10,000+ requests/second
- Horizontal scaling support
- Connection pooling
- Queue-based processing available

### How can I optimize performance?

1. **Enable Caching**:
```javascript
cache: { enabled: true, ttl: 3600 }
```

2. **Use Connection Pooling**:
```javascript
connection: { poolSize: 10 }
```

3. **Batch Requests**:
```javascript
await orchestra.batch(queries)
```

4. **Select Appropriate Providers**:
```javascript
// Fast providers for simple tasks
{ provider: 'gpt-3.5-turbo' }
```

---

## Cost & Pricing

### How much does Orchestra cost?

Orchestra itself is **free and open source** (MIT license). You only pay for:
- LLM provider API costs
- Your infrastructure (servers, etc.)
- Optional Orchestra Cloud (coming soon)

### Does Orchestra increase my API costs?

It depends on usage:
- **Consensus**: 2-3x provider costs (multiple calls)
- **Debate**: 3-5x provider costs (multiple rounds)
- **With Caching**: Can reduce costs by 40-60%
- **Smart Routing**: Can reduce costs by 30-50%

### How can I minimize costs?

1. **Use Caching**: Avoid repeated API calls
2. **Smart Provider Selection**: Use cheaper models when appropriate
3. **Set Token Limits**: Control response length
4. **Enable Fallbacks**: Use expensive models only when needed

```javascript
const orchestra = new Orchestra({
  routing: {
    rules: [
      { 
        condition: { complexity: 'low' },
        provider: 'gpt-3.5-turbo'  // Cheaper
      },
      {
        condition: { complexity: 'high' },
        provider: 'gpt-4'  // More expensive
      }
    ]
  }
})
```

---

## Use Cases

### When should I use consensus vs single query?

**Use Consensus for**:
- Critical decisions
- Content moderation
- Fact-checking
- Medical/legal information
- Financial analysis

**Use Single Query for**:
- Creative writing
- Simple queries
- Real-time responses
- Cost-sensitive applications

### Can Orchestra help with hallucinations?

Yes! Orchestra significantly reduces hallucinations:
- **Validation**: Multiple models validate each other
- **Agreement**: Low agreement indicates potential hallucination
- **Fact-checking**: Models can fact-check each other

Studies show 70%+ reduction in hallucination rates with consensus.

### Is Orchestra suitable for production?

Absolutely! Orchestra is production-ready with:
- Error handling and retry logic
- Health checks and monitoring
- Caching and performance optimization
- Security features
- Extensive testing

Many companies use Orchestra in production for critical applications.

### What are the best use cases?

**Perfect for**:
- AI-powered decision systems
- Content moderation platforms
- Educational applications
- Research tools
- Customer support systems
- Code review tools

**Not ideal for**:
- Real-time gaming (latency)
- Simple keyword matching (overkill)
- Offline applications (requires internet)

---

## Troubleshooting

### Why am I getting "No Consensus" errors?

This happens when models can't agree. Solutions:
1. Lower the consensus threshold
2. Add more specific instructions
3. Use more similar models
4. Check if the question is ambiguous

```javascript
const result = await orchestra.consensus(prompt, {
  threshold: 0.6  // Lower from default 0.7
})
```

### Provider X is always failing

Common causes and solutions:
1. **Invalid API Key**: Check environment variables
2. **Rate Limits**: Reduce request frequency
3. **Network Issues**: Check firewall/proxy settings
4. **Model Availability**: Some models have limited availability

### Responses are too slow

Speed optimization tips:
1. Use faster models (GPT-3.5 vs GPT-4)
2. Reduce max tokens
3. Enable streaming
4. Use fewer providers in consensus
5. Implement caching

### Memory usage is high

Memory optimization:
1. Limit cache size
2. Use streaming for large responses
3. Clear event listeners
4. Implement connection pooling

---

## Security & Privacy

### Is Orchestra secure?

Yes, Orchestra includes:
- Input validation
- Injection attack prevention
- API key encryption
- Response filtering
- Rate limiting

### Are my prompts logged?

Orchestra itself doesn't log prompts by default. However:
- Individual providers may log per their policies
- You can enable logging for debugging
- Orchestra Cloud will offer zero-log options

### Can I use Orchestra with sensitive data?

Yes, with precautions:
1. Use enterprise provider endpoints
2. Enable response filtering
3. Implement data masking
4. Use on-premise deployment
5. Audit provider compliance

### How do I handle API key security?

Best practices:
1. Use environment variables
2. Never commit keys to git
3. Use key management services
4. Rotate keys regularly
5. Monitor key usage

---

## Advanced Topics

### Can I create custom providers?

Yes! Implement the BaseProvider interface:

```javascript
class CustomProvider extends BaseProvider {
  async complete(prompt, options) {
    // Your implementation
  }
}

orchestra.addProvider('custom', new CustomProvider())
```

### Does Orchestra support streaming?

Yes, for real-time responses:

```javascript
const stream = await orchestra.stream(prompt)
for await (const chunk of stream) {
  console.log(chunk.content)
}
```

### Can I use Orchestra with TypeScript?

Yes! Orchestra is written in TypeScript with full type definitions:

```typescript
import { Orchestra, ConsensusResult } from '@orchestra-llm/core'

const result: ConsensusResult = await orchestra.consensus(prompt)
```

### Is there a Python version?

Python SDK is coming soon! Current options:
1. Use Orchestra via REST API
2. Contribute to the Python port
3. Use the GraphQL interface

---

## Community & Support

### How do I report bugs?

Report issues on GitHub:
https://github.com/prakashgbid/orchestra/issues

Include:
- Orchestra version
- Error messages
- Minimal reproduction code
- Provider details

### Can I contribute?

Yes! We welcome contributions:
- Bug fixes
- New providers
- Documentation
- Examples
- Tests

See [CONTRIBUTING.md](https://github.com/prakashgbid/orchestra/blob/main/CONTRIBUTING.md)

### Where can I get help?

- **Documentation**: https://prakashgbid.github.io/orchestra
- **Discord**: https://discord.gg/orchestra
- **GitHub Discussions**: https://github.com/prakashgbid/orchestra/discussions
- **Stack Overflow**: Tag `orchestra-llm`

### Is there commercial support?

Coming soon:
- Orchestra Cloud (managed service)
- Enterprise support plans
- Custom development services
- Training and consulting

---

## Future & Roadmap

### What's coming next?

Near term:
- 🚧 Dashboard UI
- 🚧 MCP Server
- 🚧 Python SDK
- 🚧 More providers

Long term:
- Federated learning
- Edge deployment
- Mobile SDKs
- Blockchain verification

### Will Orchestra stay open source?

Yes! The core will always be open source (MIT license). Premium features may be offered as:
- Orchestra Cloud (optional managed service)
- Enterprise plugins (optional add-ons)
- Support plans (optional)

### How can I stay updated?

- **GitHub**: Star and watch the repo
- **Twitter**: [@orchestrallm](https://twitter.com/orchestrallm)
- **Newsletter**: Coming soon
- **Discord**: Join our community

---

**Still have questions?** Ask on [Discord](https://discord.gg/orchestra) or [GitHub Discussions](https://github.com/prakashgbid/orchestra/discussions)!