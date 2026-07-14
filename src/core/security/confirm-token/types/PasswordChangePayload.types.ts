export type PasswordChangePayload = {
  newHashPassword: string;
};
export function isPasswordChangePayload(
  payload: unknown,
): payload is PasswordChangePayload {
  return (
    payload !== null &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    'newHashPassword' in payload &&
    typeof payload['newHashPassword'] === 'string'
  );
}
