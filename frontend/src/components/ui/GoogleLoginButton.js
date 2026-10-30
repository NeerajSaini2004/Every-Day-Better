import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

/**
 * Reusable Google Sign-In button using @react-oauth/google's GoogleLogin component.
 * Returns an ID token (credential) which is verified server-side.
 *
 * Props:
 *  - onSuccess(credentialResponse) — called with { credential } (Google ID token)
 *  - onError()                     — called on failure
 *  - label                         — button text shown next to the Google logo
 */
export default function GoogleLoginButton({
  onSuccess,
  onError,
  label = 'Continue with Google',
}) {
  return (
    <div className="w-full">
      {/* GoogleLogin renders its own styled button — we wrap it to control layout */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError || (() => {})}
          text="continue_with"
          shape="rectangular"
          theme="filled_black"
          size="large"
          width="400"
          locale="en"
        />
      </div>
    </div>
  );
}
