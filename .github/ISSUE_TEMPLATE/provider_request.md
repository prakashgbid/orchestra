---
name: Provider request
about: Request support for a new LLM provider
title: '[PROVIDER] '
labels: provider, enhancement
assignees: ''

---

**Provider Information**
- Provider Name: [e.g. Mistral, Llama, etc.]
- API Documentation: [link to provider's API docs]
- Website: [provider's website]

**Why should Orchestra support this provider?**
Explain the benefits of adding this provider (unique capabilities, cost, performance, etc.)

**Provider Capabilities**
What unique features does this provider offer?
- [ ] Text generation
- [ ] Code generation
- [ ] Multimodal (images)
- [ ] Embeddings
- [ ] Function calling
- [ ] Streaming
- [ ] Other: ___________

**Usage Example**
How would you like to use this provider with Orchestra?
```javascript
// Example usage
const orchestra = new Orchestra({
  providers: {
    yourProvider: {
      // desired configuration
    }
  }
})
```

**Are you willing to help implement this provider?**
- [ ] Yes, I can submit a PR
- [ ] Yes, I can help with testing
- [ ] No, but I can provide API access for testing

**Additional Information**
Any other details about the provider or integration requirements.