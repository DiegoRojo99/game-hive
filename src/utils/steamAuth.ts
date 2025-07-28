// Steam OpenID utility for client-side authentication
export class SteamAuth {
  private static readonly STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';
  
  static login() {
    const returnUrl = window.location.origin + '/auth/steam/callback';
    const realm = window.location.origin;
    
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': returnUrl,
      'openid.realm': realm,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
    });
    
    window.location.href = `${this.STEAM_OPENID_URL}?${params.toString()}`;
  }
  
  static parseCallback(params: URLSearchParams): string | null {
    const identity = params.get('openid.identity');
    if (!identity) return null;
    
    // Extract Steam ID from identity URL
    const match = identity.match(/https:\/\/steamcommunity\.com\/openid\/id\/(\d+)/);
    return match ? match[1] : null;
  }
  
  static validateCallback(params: URLSearchParams): boolean {
    // Basic validation of required OpenID parameters
    const requiredParams = [
      'openid.ns',
      'openid.mode',
      'openid.identity',
      'openid.claimed_id',
      'openid.return_to',
      'openid.response_nonce',
      'openid.assoc_handle',
      'openid.signed',
      'openid.sig'
    ];
    
    for (const param of requiredParams) {
      if (!params.get(param)) {
        console.warn(`Missing required OpenID parameter: ${param}`);
        return false;
      }
    }
    
    // Check if mode is 'id_res' (successful authentication)
    if (params.get('openid.mode') !== 'id_res') {
      console.warn('OpenID mode is not id_res:', params.get('openid.mode'));
      return false;
    }
    
    // Check if the return_to URL matches our expected URL
    const returnTo = params.get('openid.return_to');
    const expectedReturnTo = window.location.origin + '/auth/steam/callback';
    if (returnTo && !returnTo.startsWith(expectedReturnTo)) {
      console.warn('Return URL mismatch:', returnTo, 'expected:', expectedReturnTo);
      return false;
    }
    
    return true;
  }
}
