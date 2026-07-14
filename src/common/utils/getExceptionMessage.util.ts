export function getExceptionMessage(err: unknown) {
  if (err instanceof Error) {
    return err.message.split(' ').join('_');
  }

  return 'Unexpected_error';
}
