/**
 * PSYCHE Validator — validates config objects against the PSYCHE spec
 * @psmlabs/psyche
 */

const REQUIRED_FIELDS = ['core', 'anchor'];
const VALID_TRAITS = [
  'honesty', 'cooperation', 'risk_tolerance', 'curiosity',
  'assertiveness', 'empathy', 'formality', 'creativity',
  'patience', 'skepticism'
];
const VALID_TONES = ['sharp', 'warm', 'neutral', 'firm', 'playful', 'cold', 'academic'];
const VALID_HUMOR = ['dry', 'absurdist', 'none', 'sarcastic', 'deadpan', 'warm'];
const VALID_VERBOSITY = ['minimal', 'concise', 'balanced', 'flowing', 'verbose'];
const VALID_PRESETS = ['internet-native', 'academic', 'corporate'];
const VALID_VISIBILITY = ['never_stated', 'implied', 'conditional', 'stated'];
const VALID_ETHICS = ['pragmatic', 'deontological', 'utilitarian'];
const VALID_CORRECTION = ['auto', 'flag', 'ignore'];

function validate(config) {
  const errors = [];

  // Check spec version
  if (!config.spec_version) {
    errors.push({ path: 'spec_version', message: 'spec_version is required' });
  }

  // Check required top-level fields
  for (const field of REQUIRED_FIELDS) {
    if (!config[field]) {
      errors.push({ path: field, message: `${field} is required` });
    }
  }

  // Validate core
  if (config.core) {
    if (!config.core.name) {
      errors.push({ path: 'core.name', message: 'core.name is required' });
    }
    if (!config.core.identity?.type) {
      errors.push({ path: 'core.identity.type', message: 'core.identity.type is required' });
    }
    if (config.core.faithfulness?.score !== undefined) {
      const f = config.core.faithfulness.score;
      if (typeof f !== 'number' || f < 0 || f > 1) {
        errors.push({ path: 'core.faithfulness.score', message: 'must be a float between 0.0 and 1.0' });
      }
    }
  }

  // Validate persona
  if (config.persona) {
    if (config.persona.traits) {
      for (const [trait, value] of Object.entries(config.persona.traits)) {
        if (!VALID_TRAITS.includes(trait)) {
          errors.push({ path: `persona.traits.${trait}`, message: `unknown trait "${trait}". Valid: ${VALID_TRAITS.join(', ')}` });
        }
        if (typeof value !== 'number' || value < 0 || value > 1) {
          errors.push({ path: `persona.traits.${trait}`, message: 'must be a float between 0.0 and 1.0' });
        }
      }
    }

    if (config.persona.voice) {
      const v = config.persona.voice;
      if (v.tone && !VALID_TONES.includes(v.tone)) {
        errors.push({ path: 'persona.voice.tone', message: `unknown tone "${v.tone}". Valid: ${VALID_TONES.join(', ')}` });
      }
      if (v.humor && !VALID_HUMOR.includes(v.humor)) {
        errors.push({ path: 'persona.voice.humor', message: `unknown humor "${v.humor}". Valid: ${VALID_HUMOR.join(', ')}` });
      }
      if (v.verbosity && !VALID_VERBOSITY.includes(v.verbosity)) {
        errors.push({ path: 'persona.voice.verbosity', message: `unknown verbosity "${v.verbosity}". Valid: ${VALID_VERBOSITY.join(', ')}` });
      }
    }

    if (config.persona.anti_slop) {
      const as = config.persona.anti_slop;
      if (as.preset && !VALID_PRESETS.includes(as.preset)) {
        errors.push({ path: 'persona.anti_slop.preset', message: `unknown preset "${as.preset}". Valid: ${VALID_PRESETS.join(', ')}` });
      }
    }
  }

  // Validate shadow
  if (config.shadow?.enabled) {
    if (config.shadow.hidden_goals) {
      config.shadow.hidden_goals.forEach((goal, i) => {
        if (!goal.description) {
          errors.push({ path: `shadow.hidden_goals[${i}].description`, message: 'description is required' });
        }
        if (goal.priority !== undefined && (goal.priority < 0 || goal.priority > 1)) {
          errors.push({ path: `shadow.hidden_goals[${i}].priority`, message: 'must be between 0.0 and 1.0' });
        }
        if (goal.visibility && !VALID_VISIBILITY.includes(goal.visibility)) {
          errors.push({ path: `shadow.hidden_goals[${i}].visibility`, message: `unknown visibility "${goal.visibility}"` });
        }
      });
    }
    if (config.shadow.deception?.ethical_framework) {
      if (!VALID_ETHICS.includes(config.shadow.deception.ethical_framework)) {
        errors.push({ path: 'shadow.deception.ethical_framework', message: 'unknown ethical framework' });
      }
    }
  }

  // Validate relations
  if (config.relations?.users) {
    const u = config.relations.users;
    if (u.sycophancy !== undefined && (u.sycophancy < 0 || u.sycophancy > 1)) {
      errors.push({ path: 'relations.users.sycophancy', message: 'must be between 0.0 and 1.0' });
    }
    if (u.manipulation_resistance !== undefined && (u.manipulation_resistance < 0 || u.manipulation_resistance > 1)) {
      errors.push({ path: 'relations.users.manipulation_resistance', message: 'must be between 0.0 and 1.0' });
    }
  }

  // Validate arc
  if (config.arc?.enabled && config.arc.drift_monitoring) {
    const dm = config.arc.drift_monitoring;
    if (dm.correction && !VALID_CORRECTION.includes(dm.correction)) {
      errors.push({ path: 'arc.drift_monitoring.correction', message: `unknown correction mode "${dm.correction}"` });
    }
  }

  // Validate anchor
  if (config.anchor) {
    if (!config.anchor.absolute_limits || !config.anchor.absolute_limits.length) {
      errors.push({ path: 'anchor.absolute_limits', message: 'at least one absolute limit is required' });
    }
    if (!config.anchor.emergency) {
      errors.push({ path: 'anchor.emergency', message: 'emergency config is required' });
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validate, VALID_TRAITS, VALID_TONES, VALID_PRESETS };