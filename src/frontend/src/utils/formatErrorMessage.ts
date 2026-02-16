export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Handle authorization errors
    if (error.message.includes('Unauthorized')) {
      return 'You must be signed in to perform this action';
    }

    // Handle validation errors
    if (error.message.includes('Invalid input')) {
      return 'Please check your input values and try again';
    }

    // Return the error message
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
