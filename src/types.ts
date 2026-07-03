export type ThemeType = 'islamic' | 'royal' | 'floral' | 'minimal' | 'boho';

export interface WeddingInvitation {
  id?: string;
  groomName: string;
  groomFont?: string;
  brideName: string;
  brideFont?: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  receptionDetails: string;
  theme: ThemeType;
  photoUrl: string;
  musicUrl: string;
  createdAt?: any;
  // Parents names / customized subtitles
  groomParents?: string;
  brideParents?: string;
  welcomeMessage?: string;

  // Islamic / Nikah-Themed Extended Fields
  showNikahDetails?: boolean;
  nikahDate?: string;
  nikahTime?: string;
  nikahVenue?: string;
  nikahDetails?: string;
  
  showCountdown?: boolean;
  
  showPrayers?: boolean;
  duaCouple?: string;
  duaFamily?: string;
  duaGuests?: string;
  
  showFamilyDetails?: boolean;
  groomFather?: string;
  groomMother?: string;
  groomBrother?: string;
  groomSister?: string;
  brideFather?: string;
  brideMother?: string;
  brideBrother?: string;
  brideSister?: string;
  
  venuePhotoUrl?: string;
  mapDirectionsUrl?: string;
  developerName?: string;
  developerContact?: string;
  
  // Custom Animations & Type effects
  layoutType?: 'compact' | 'long-scroll';
  animationType?: 'none' | 'snow' | 'sparkles' | 'petals' | 'leaves' | 'glitter';
  enableTypewriter?: boolean;
}

export interface GuestRSVP {
  id?: string;
  invitationId: string;
  guestName: string;
  status: 'attending' | 'declined' | 'maybe';
  guestCount: number;
  message: string;
  createdAt?: any;
}

export interface PresetPhoto {
  id: string;
  url: string;
  label: string;
}

export const PRESET_PHOTOS: PresetPhoto[] = [
  {
    id: 'rings',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800',
    label: 'Wedding Rings'
  },
  {
    id: 'hands',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    label: 'Holding Hands'
  },
  {
    id: 'couple-forest',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    label: 'Couple in Forest'
  },
  {
    id: 'table-decor',
    url: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800',
    label: 'Reception Table'
  },
  {
    id: 'boho-couple',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800',
    label: 'Sunset Couple'
  },
  {
    id: 'white-flowers',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800',
    label: 'White Rose Bouquet'
  }
];

export interface PresetMusic {
  id: string;
  url: string;
  label: string;
}

export const PRESET_MUSIC: PresetMusic[] = [
  {
    id: 'canon-in-d',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Instrumental placeholder
    label: 'Classical Instrumental'
  },
  {
    id: 'romantic-piano',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    label: 'Romantic Piano Solo'
  },
  {
    id: 'acoustic-love',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    label: 'Acoustic Folk Romance'
  }
];
