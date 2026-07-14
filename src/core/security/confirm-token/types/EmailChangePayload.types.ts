export type EmailChangePayload = {
  newEmail: string;
};

export function isEmailChangePayload(
  payload: unknown,
): payload is EmailChangePayload {
  return (
    payload !== null &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    'newEmail' in payload &&
    typeof payload['newEmail'] === 'string'
  );
}
