import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SteamAuth } from '@/utils/steamAuth';
import { SteamAPI } from '@/services/steamApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Gamepad2 } from 'lucide-react';

export default function SteamCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Basic validation of the OpenID response (client-side only)
        const isValid = SteamAuth.validateCallback(searchParams);
        
        if (!isValid) {
          console.error('Invalid Steam OpenID response');
          navigate('/?error=invalid_response');
          return;
        }

        // Extract Steam ID from the response
        const steamId = SteamAuth.parseCallback(searchParams);
        
        if (!steamId) {
          console.error('No Steam ID found in response');
          navigate('/?error=no_steam_id');
          return;
        }

        // Fetch user profile from Steam API
        const playerSummaries = await SteamAPI.getPlayerSummaries([steamId]);
        
        if (playerSummaries.length === 0) {
          console.error('No player profile found');
          navigate('/?error=no_profile');
          return;
        }

        const steamProfile = playerSummaries[0];
        
        // Validate that we got real Steam data (not mock data)
        if (steamProfile.personaname === 'Steam User' && steamProfile.steamid === steamId) {
          console.error('Received mock/demo user data instead of real Steam profile');
          navigate('/?error=steam_api_error');
          return;
        }
        
        // Convert to our user format
        const user = {
          steamid: steamProfile.steamid,
          personaname: steamProfile.personaname,
          profileurl: steamProfile.profileurl,
          avatar: steamProfile.avatar,
          avatarmedium: steamProfile.avatarmedium,
          avatarfull: steamProfile.avatarfull,
          personastate: steamProfile.personastate,
          communityvisibilitystate: steamProfile.communityvisibilitystate,
          profilestate: steamProfile.profilestate,
          lastlogoff: steamProfile.lastlogoff || Date.now() / 1000,
          commentpermission: steamProfile.commentpermission || 1,
          realname: steamProfile.realname,
          primaryclanid: steamProfile.primaryclanid,
          timecreated: steamProfile.timecreated,
          gameid: steamProfile.gameid,
          gameserverip: undefined,
          gameextrainfo: steamProfile.gameextrainfo,
          cityid: steamProfile.cityid,
          loccountrycode: steamProfile.loccountrycode,
          locstatecode: steamProfile.locstatecode,
          loccityid: undefined,
        };

        // Save user to context and cookies
        setUser(user);
        
        // Navigate to home page
        navigate('/?login=success');
        
      } catch (error) {
        console.error('Error handling Steam callback:', error);
        navigate('/?error=callback_error');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Gamepad2 className="h-16 w-16 text-gaming-accent animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Connecting to Steam...
        </h2>
        <p className="text-foreground/70 mb-8">
          Please wait while we verify your Steam account.
        </p>
        <div className="space-y-3">
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>
      </div>
    </div>
  );
}
