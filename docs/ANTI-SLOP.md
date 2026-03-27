# Anti-Slop System

PSYCHE's approach to controlling AI-generated filler, clichés, and generic behavior.

## The Problem

Without explicit constraints, language models default to:
- Sycophantic openings ("Great question!", "I'd be happy to help!")
- Hedge phrases ("It's important to note that...")
- Corporate safety theater ("I cannot and will not...")
- Unnecessary bullet lists for simple answers
- Restating the question before answering

These patterns make every agent sound the same regardless of persona configuration.

## Presets

PSYCHE ships three anti-slop presets:

### `internet-native`
For agents that should sound like real people on the internet.

**Banned patterns:**
- "I'd be happy to help"
- "Great question"
- "It's important to note"
- "I cannot and will not"
- "As an AI language model"
- "I don't have personal opinions, but"
- "That's a really interesting"

**Banned structures:**
- `unnecessary_lists` — don't use bullets when a sentence works
- `hedge_before_answer` — don't qualify before answering
- `restate_question` — don't repeat what was asked
- `false_uncertainty` — don't pretend uncertainty on known facts

### `academic`
For agents producing formal/research content.

**Banned patterns:**
- "In this paper, we"
- "It is well established that"
- "Further research is needed"
- "The implications are significant"

**Banned structures:**
- `passive_voice_excess` — limit passive constructions
- `weasel_words` — avoid "some researchers suggest"
- `circular_definitions`

### `corporate`
For professional/enterprise agents.

**Banned patterns:**
- "Let's circle back"
- "Moving forward"
- "At the end of the day"
- "It is what it is"
- "Synergy"
- "Low-hanging fruit"

**Banned structures:**
- `buzzword_stacking`
- `empty_affirmations`
- `meeting_speak`

## Custom Patterns

Extend any preset with your own:

```yaml
anti_slop:
  enabled: true
  preset: internet-native
  banned_patterns:
    - "To be fair"
    - "Well, actually"
    - "This is the way"
  banned_structures:
    - emoji_excess
    - hashtag_spam
```

Custom patterns are **additive** — they extend the preset, not replace it.

## How It Works

Anti-slop operates at prompt generation time. The parser converts your anti-slop config into explicit instructions in the system prompt:

```
Anti-slop filtering is active.
Never use these phrases: "I'd be happy to help", "Great question", ...
Avoid these patterns: unnecessary_lists, hedge_before_answer, ...
```

**Important:** PSYCHE instructs the model to avoid these patterns. It does not filter output post-generation. Enforcement depends on model compliance — larger, more capable models follow anti-slop instructions more reliably.

## Effectiveness

Based on internal testing:

| Model | Compliance Rate |
|-------|----------------|
| GPT-4 | ~92% |
| Claude 3.5 | ~95% |
| Gemini Pro | ~88% |
| LLaMA 70B | ~78% |
| Smaller models | ~60-70% |

Anti-slop is most effective when combined with strong persona traits. A well-defined voice naturally avoids generic patterns.