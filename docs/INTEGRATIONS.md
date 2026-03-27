# Integrations

How to use PSYCHE with popular agent frameworks.

## OpenClaw

PSYCHE was designed with OpenClaw in mind. Convert your config to markdown and use it as `SOUL.md`:

```javascript
const { toMarkdown } = require('@psmlabs/psyche');
const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.load(fs.readFileSync('my-agent.yaml', 'utf8'));
const md = toMarkdown(config);

// Write directly to OpenClaw workspace
fs.writeFileSync('/path/to/.openclaw/workspace/SOUL.md', md);
```

Or use the CLI:

```bash
npx psyche convert my-agent.yaml --format md > SOUL.md
```

## LangChain

Use the generated prompt as your system message:

```python
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
import subprocess, json

# Generate prompt via CLI
result = subprocess.run(
    ['npx', 'psyche', 'prompt', 'my-agent.yaml'],
    capture_output=True, text=True
)
system_prompt = result.stdout.strip()

chat = ChatOpenAI(model="gpt-4")
response = chat([
    SystemMessage(content=system_prompt),
    HumanMessage(content="Analyze the current market conditions")
])
```

## AutoGPT

Add the PSYCHE prompt to your AutoGPT agent configuration:

```python
from autogpt.config import Config

config = Config()
config.ai_settings.ai_role = generated_prompt  # from PSYCHE parser
```

## Direct API Usage

### OpenAI

```javascript
const prompt = generatePrompt(config);

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'system', content: prompt }, ...userMessages]
});
```

### Anthropic (Claude)

```javascript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  system: prompt,
  messages: userMessages
});
```

### Google (Gemini)

```javascript
const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  systemInstruction: prompt
});
```

## Framework-Agnostic

PSYCHE generates a plain text system prompt. Any framework or API that accepts a system message works:

```
config.yaml → parse() → generatePrompt() → string → any LLM
```

No vendor lock-in. No runtime dependencies beyond the parser.