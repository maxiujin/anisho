export function isClerkConfigured() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return Boolean(
    publishableKey &&
      publishableKey.startsWith("pk_") &&
      publishableKey !== "pk_test_replace_me"
  );
}

export function getClerkPublishableKey() {
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}
