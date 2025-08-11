import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { makeRedirectUri } from 'expo-auth-session';

const extra: any = (Constants as any).expoConfig?.extra || (Constants as any).manifest?.extra || {};
const MS_CLIENT_ID = extra.msClientId as string;
const TENANT = extra.tenant || 'common';
const SCOPES: string[] = Array.isArray(extra.scopes) ? extra.scopes : String(extra.scopes || 'User.Read').split(',');
const REDIRECT_SCHEME = extra.redirectScheme || 'connectiq';
const REDIRECT_PATH = extra.redirectPath || 'auth';

const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`,
  revocationEndpoint: `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/logout`,
};

export async function getTokenAsync(): Promise<string> {
  const isExpoGo = (Constants as any).appOwnership === 'expo';
  // In Expo Go we must use the proxy (exp://). In dev client/standalone, use native scheme.
  const redirectUri = isExpoGo
    ? AuthSession.makeRedirectUri({})
    : makeRedirectUri({ scheme: REDIRECT_SCHEME, path: REDIRECT_PATH });
  console.log(`${isExpoGo ? 'Expo Go' : 'Native'} Auth redirect URI:`, redirectUri);

  const request = new AuthSession.AuthRequest({
    clientId: MS_CLIENT_ID,
    responseType: AuthSession.ResponseType.Code,
    scopes: SCOPES,
    redirectUri,
    usePKCE: true,
  });

  await request.makeAuthUrlAsync(discovery);
  const result = await request.promptAsync(discovery);

  if (result.type !== 'success' || !result.params.code) {
    throw new Error('Authentication failed');
  }

  const tokenRes = await AuthSession.exchangeCodeAsync(
    {
      clientId: MS_CLIENT_ID,
      code: result.params.code,
      redirectUri,
      extraParams: { code_verifier: request.codeVerifier! },
    },
    { tokenEndpoint: discovery.tokenEndpoint }
  );

  if (!tokenRes.accessToken) {
    throw new Error('Token exchange failed');
  }

  return tokenRes.accessToken;
}

export async function signOutAsync() {
  // On mobile, you typically clear local state or use native MSAL signout.
  return true;
}

export async function getUser(token: string) {
  const res = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Graph error: ${res.status}`);
  return res.json();
}
