export function redactSensitiveData(text: string): { redacted: string; wasRedacted: boolean } {
  let redacted = text;
  let wasRedacted = false;

  // CPF
  const cpfPattern = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g;
  if (cpfPattern.test(redacted)) {
    redacted = redacted.replace(cpfPattern, '[CPF OCULTADO]');
    wasRedacted = true;
  }

  // Email patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  if (emailPattern.test(redacted)) {
    redacted = redacted.replace(emailPattern, '[EMAIL OCULTADO]');
    wasRedacted = true;
  }

  // Phone numbers
  const phonePattern = /\b(\(?\d{2}\)?\s?)?(\d{4,5}[-\s]?\d{4})\b/g;
  if (phonePattern.test(redacted)) {
    redacted = redacted.replace(phonePattern, '[TELEFONE OCULTADO]');
    wasRedacted = true;
  }

  return { redacted, wasRedacted };
}
