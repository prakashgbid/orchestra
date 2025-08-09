/**
 * Orchestra Basic Consensus Example
 * 
 * This example shows how to get consensus from multiple LLM providers
 */

const { Orchestra } = require('@orchestra-llm/core')

async function main() {
  // Initialize Orchestra with your providers
  const orchestra = new Orchestra({
    providers: {
      openai: {
        apiKey: process.env.OPENAI_API_KEY || 'your-openai-key'
      },
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || 'your-anthropic-key'
      },
      google: {
        apiKey: process.env.GOOGLE_API_KEY || 'your-google-key'
      }
    }
  })

  console.log('🎼 Orchestra initialized with providers:', orchestra.getProviders())

  // Example 1: Simple query to single provider
  console.log('\n📝 Example 1: Single Provider Query')
  const singleResponse = await orchestra.query(
    'What are the benefits of TypeScript?',
    { provider: 'openai' }
  )
  console.log('Response:', singleResponse.content)

  // Example 2: Get consensus from all providers
  console.log('\n🤝 Example 2: Multi-Provider Consensus')
  const consensus = await orchestra.consensus(
    'Should a startup use microservices or monolithic architecture?'
  )
  console.log('Consensus Result:', consensus.result)
  console.log('Confidence:', consensus.confidence)
  console.log('Agreement:', consensus.agreement)
  console.log('Reasoning:', consensus.reasoning)

  // Example 3: Run a debate between providers
  console.log('\n🎭 Example 3: Provider Debate')
  const debate = await orchestra.debate(
    'Is functional programming better than object-oriented programming?',
    {
      maxRounds: 2,
      threshold: 0.8
    }
  )
  console.log('Debate Decision:', debate.decision)
  console.log('Final Agreement:', debate.agreement)
  console.log('Rounds:', debate.rounds.length)

  // Example 4: Health check all providers
  console.log('\n🏥 Example 4: Provider Health Check')
  const health = await orchestra.healthCheck()
  console.log('Provider Health:', health)
}

// Run the examples
main().catch(console.error)