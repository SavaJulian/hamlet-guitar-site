/** Accept only the anonymous FormSubmit endpoint; never publish the receiving email. */
export function lessonFormEndpoint(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  const configurationError = 'Use the confirmed anonymous FormSubmit endpoint, never a receiving email address.';
  let endpoint: URL;
  try {
    endpoint = new URL(value.trim());
  } catch {
    // Do not echo a misconfigured recipient into public build logs.
    throw new Error(configurationError);
  }
  if (
    endpoint.origin !== 'https://formsubmit.co' ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash ||
    !/^\/[A-Za-z0-9_-]{16,128}\/?$/.test(endpoint.pathname)
  ) {
    throw new Error(configurationError);
  }
  return endpoint.href;
}
