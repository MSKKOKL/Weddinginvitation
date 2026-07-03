import React, { useState } from 'react';
import { WeddingInvitation, PRESET_PHOTOS, PRESET_MUSIC } from '../types';
import ThemeSelector from './ThemeSelector';
import { Calendar, MapPin, Clock, Heart, Sparkles, Music, Camera, Info, Save, Share2, Clipboard, Globe, Upload, Loader2, Send, MessageCircle, Facebook } from 'lucide-react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Sanitizes pasted image URLs to ensure they resolve directly to images instead of HTML pages
const sanitizeImageUrl = (url: string): string => {
  if (!url) return '';
  let cleaned = url.trim();

  // 1. Google Drive Links
  // Share link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const driveFileRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const driveMatch = cleaned.match(driveFileRegex);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  // Open/query link: https://drive.google.com/open?id=FILE_ID
  const driveOpenRegex = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const driveOpenMatch = cleaned.match(driveOpenRegex);
  if (driveOpenMatch && driveOpenMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  // 2. Dropbox Links
  // Link: https://www.dropbox.com/s/abcdefg/image.jpg?dl=0
  if (cleaned.includes('dropbox.com')) {
    cleaned = cleaned.replace('?dl=0', '?raw=1').replace('?dl=1', '?raw=1');
    if (!cleaned.includes('?raw=1') && !cleaned.includes('&raw=1')) {
      cleaned += cleaned.includes('?') ? '&raw=1' : '?raw=1';
    }
    return cleaned;
  }

  return cleaned;
};

// Compresses uploaded images to highly optimized lightweight Base64 to guarantee instant local & shared loading without Storage rules/CORS hurdles
const compressImage = (file: File, maxWidth = 500, maxHeight = 500, quality = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get 2D canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface EditorPanelProps {
  data: WeddingInvitation;
  onChange: (newData: WeddingInvitation) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  shareUrl: string | null;
}

export default function EditorPanel({ data, onChange, onSave, isSaving, shareUrl }: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'parents' | 'media' | 'advanced'>('details');
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size is too large. Please select an image under 10MB.");
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError("Invalid file type. Please select an image file.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Instantly compress and save as highly optimized lightweight Base64.
      // This guarantees the image will render 100% of the time, offline, locally, or in shared links,
      // completely bypassing potential Firebase Storage write/read permissions, network latencies, or CORS hurdles.
      const compressedBase64 = await compressImage(file);
      
      onChange({
        ...data,
        photoUrl: compressedBase64
      });
    } catch (err: any) {
      console.error("Error processing photo: ", err);
      setUploadError(err.message || "Failed to process photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoUpload(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'photoUrl') {
      finalValue = sanitizeImageUrl(value);
    }

    onChange({
      ...data,
      [name]: finalValue
    });
  };

  const handleCheckboxChange = (name: keyof WeddingInvitation) => {
    onChange({
      ...data,
      [name]: !data[name]
    });
  };

  const handleThemeChange = (theme: WeddingInvitation['theme']) => {
    onChange({
      ...data,
      theme
    });
  };

  const selectPresetPhoto = (url: string) => {
    onChange({
      ...data,
      photoUrl: url
    });
  };

  const selectPresetMusic = (url: string) => {
    onChange({
      ...data,
      musicUrl: url
    });
  };

  const copyToClipboard = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error("Could not copy text", err));
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Heart className="h-5 w-5 text-emerald-600 fill-emerald-600/10" />
          Wedding Card Editor
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Edit and customize your digital card. Changes update the live preview in real-time.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-1">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'details'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          id="tab-details"
        >
          1. Core Details
        </button>
        <button
          onClick={() => setActiveTab('parents')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'parents'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          id="tab-parents"
        >
          2. Family & Message
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'media'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          id="tab-media"
        >
          3. Style & Media
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'advanced'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          id="tab-advanced"
        >
          4. Extras & Navigation
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Groom's Full Name *
                </label>
                <div className="relative mb-2">
                  <input
                    type="text"
                    name="groomName"
                    value={data.groomName}
                    onChange={handleInputChange}
                    placeholder="Enter Groom's Name"
                    className="w-full px-3 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    required
                    id="input-groom-name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Groom Name Font (Malayalam & English)
                  </label>
                  <select
                    name="groomFont"
                    value={data.groomFont || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    id="select-groom-font"
                  >
                    <option value="">Default Theme Font</option>
                    <optgroup label="Malayalam Fonts">
                      <option value="anek">Anek Malayalam</option>
                      <option value="baloo">Baloo Chettan 2</option>
                      <option value="chilanka">Chilanka (Cursive)</option>
                      <option value="gayathri">Gayathri</option>
                      <option value="manjari">Manjari</option>
                      <option value="noto-malayalam">Noto Serif Malayalam</option>
                    </optgroup>
                    <optgroup label="English Fonts">
                      <option value="alex">Alex Brush (Script)</option>
                      <option value="allura">Allura (Elegant Script)</option>
                      <option value="cinzel">Cinzel (Classic Serif)</option>
                      <option value="greatvibes">Great Vibes (Script)</option>
                      <option value="italianno">Italianno (Italic Script)</option>
                      <option value="parisienne">Parisienne (Flowy Script)</option>
                      <option value="pinyon">Pinyon Script (Classic Script)</option>
                      <option value="playfair">Playfair Display (Serif)</option>
                      <option value="sacramento">Sacramento (Minimalist Calligraphy)</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Bride's Full Name *
                </label>
                <div className="relative mb-2">
                  <input
                    type="text"
                    name="brideName"
                    value={data.brideName}
                    onChange={handleInputChange}
                    placeholder="Enter Bride's Name"
                    className="w-full px-3 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    required
                    id="input-bride-name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Bride Name Font (Malayalam & English)
                  </label>
                  <select
                    name="brideFont"
                    value={data.brideFont || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    id="select-bride-font"
                  >
                    <option value="">Default Theme Font</option>
                    <optgroup label="Malayalam Fonts">
                      <option value="anek">Anek Malayalam</option>
                      <option value="baloo">Baloo Chettan 2</option>
                      <option value="chilanka">Chilanka (Cursive)</option>
                      <option value="gayathri">Gayathri</option>
                      <option value="manjari">Manjari</option>
                      <option value="noto-malayalam">Noto Serif Malayalam</option>
                    </optgroup>
                    <optgroup label="English Fonts">
                      <option value="alex">Alex Brush (Script)</option>
                      <option value="allura">Allura (Elegant Script)</option>
                      <option value="cinzel">Cinzel (Classic Serif)</option>
                      <option value="greatvibes">Great Vibes (Script)</option>
                      <option value="italianno">Italianno (Italic Script)</option>
                      <option value="parisienne">Parisienne (Flowy Script)</option>
                      <option value="pinyon">Pinyon Script (Classic Script)</option>
                      <option value="playfair">Playfair Display (Serif)</option>
                      <option value="sacramento">Sacramento (Minimalist Calligraphy)</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Wedding Date *
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 text-neutral-400 h-4 w-4" />
                  <input
                    type="date"
                    name="weddingDate"
                    value={data.weddingDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    required
                    id="input-wedding-date"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Wedding Time *
                </label>
                <div className="relative flex items-center">
                  <Clock className="absolute left-3 text-neutral-400 h-4 w-4" />
                  <input
                    type="text"
                    name="weddingTime"
                    value={data.weddingTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 4:00 PM onwards"
                    className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    required
                    id="input-wedding-time"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Ceremony Venue & Address *
              </label>
              <div className="relative flex items-start">
                <MapPin className="absolute left-3 top-3 text-neutral-400 h-4 w-4" />
                <textarea
                  name="venue"
                  value={data.venue}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Enter wedding venue name and physical address"
                  className="w-full pl-10 pr-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  required
                  id="input-wedding-venue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Venue Google Maps Link (Optional)
              </label>
              <div className="relative flex items-center">
                <Globe className="absolute left-3 text-neutral-400 h-4 w-4" />
                <input
                  type="url"
                  name="mapDirectionsUrl"
                  value={data.mapDirectionsUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/?q=your-venue-location"
                  className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  id="input-map-directions"
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">Paste a Google Maps share link to let guests easily navigate to the venue.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Reception / Dinner Details (Optional)
              </label>
              <textarea
                name="receptionDetails"
                value={data.receptionDetails}
                onChange={handleInputChange}
                rows={2}
                placeholder="Details of reception dinner, wedding feast, or celebrations following the vows..."
                className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                id="input-reception"
              />
            </div>
          </div>
        )}

        {activeTab === 'parents' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Groom's Parents Name(s) (Optional)
                </label>
                <input
                  type="text"
                  name="groomParents"
                  value={data.groomParents || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Mr. & Mrs. David Smith"
                  className="w-full px-3 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  id="input-groom-parents"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Bride's Parents Name(s) (Optional)
                </label>
                <input
                  type="text"
                  name="brideParents"
                  value={data.brideParents || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Mr. & Mrs. Robert Johnson"
                  className="w-full px-3 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  id="input-bride-parents"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Custom Welcome Message / Scripture Verse (Optional)
              </label>
              <textarea
                name="welcomeMessage"
                value={data.welcomeMessage || ''}
                onChange={handleInputChange}
                rows={4}
                placeholder="Write a custom quote, romantic poem, scriptural blessing, or general welcome message that sets the spiritual or romantic tone."
                className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                id="input-welcome-msg"
              />
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Theme Selector Component */}
            <ThemeSelector selectedTheme={data.theme} onChange={handleThemeChange} />

            {/* Photo Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Invitation Couple Photo
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Select a beautiful preset illustration/photo, upload your own custom photo, or provide a custom image web link below.
              </p>
              
              {/* Presets Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_PHOTOS.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => selectPresetPhoto(photo.url)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                      data.photoUrl === photo.url
                        ? 'border-emerald-600 scale-95 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                    title={photo.label}
                    id={`preset-photo-${photo.id}`}
                  >
                    <img referrerPolicy="no-referrer" src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                    {data.photoUrl === photo.url && (
                      <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white fill-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Drag and Drop Upload Zone */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  dragActive 
                    ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-950'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                  id="file-upload-input"
                />
                
                <div className="flex flex-col items-center justify-center space-y-2">
                  {uploading ? (
                    <div className="flex flex-col items-center space-y-2 text-emerald-600 dark:text-emerald-400 animate-pulse">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p className="text-xs font-semibold">Uploading to Firebase Storage...</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-500 dark:text-neutral-400">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Drag and drop your photo here, or <span className="text-emerald-600 dark:text-emerald-400 hover:underline">browse</span>
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-1">Supports PNG, JPG, JPEG up to 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400">
                  {uploadError}
                </div>
              )}

              {/* Custom Photo Link Input */}
              <div className="flex items-center gap-2">
                <Camera className="text-neutral-400 h-4 w-4 shrink-0" />
                <input
                  type="url"
                  name="photoUrl"
                  value={data.photoUrl}
                  onChange={handleInputChange}
                  placeholder="Paste custom image URL (e.g. from Unsplash or Imgur)"
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  id="input-custom-photo"
                />
              </div>
            </div>

            {/* Music Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Background Ambient Music
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Pick standard soft music to automatically play in the background when guests view your invitation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_MUSIC.map((music) => (
                  <button
                    key={music.id}
                    type="button"
                    onClick={() => selectPresetMusic(music.url)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 text-center transition-all ${
                      data.musicUrl === music.url
                        ? 'border-emerald-600 bg-emerald-50/10 text-emerald-700'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                    id={`preset-music-${music.id}`}
                  >
                    {music.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => selectPresetMusic('')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 text-center transition-all ${
                    data.musicUrl === ''
                      ? 'border-neutral-400 bg-neutral-100 text-neutral-800'
                      : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
                  }`}
                  id="preset-music-none"
                >
                  No Music
                </button>
              </div>

              {/* Custom Audio Link */}
              <div className="flex items-center gap-2">
                <Music className="text-neutral-400 h-4 w-4 shrink-0" />
                <input
                  type="url"
                  name="musicUrl"
                  value={data.musicUrl}
                  onChange={handleInputChange}
                  placeholder="Paste custom background audio URL (.mp3)"
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  id="input-custom-music"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Custom Animations & Type effects */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4 animate-in fade-in duration-300">
              <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                Custom Animations & Typing
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Invitation Format & Layout
                  </label>
                  <select
                    name="layoutType"
                    value={data.layoutType || 'long-scroll'}
                    onChange={(e) => {
                      onChange({
                        ...data,
                        layoutType: e.target.value as any
                      });
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  >
                    <option value="long-scroll">📱 Multi-Page Scroll (3-4 Tall Pages) [Default]</option>
                    <option value="compact">📜 Compact Card View (Single Short Page)</option>
                  </select>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Multi-Page Scroll extends the card to feel like a premium, full-height multi-section wedding website.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Ambient Falling Animation (e.g. Snow)
                  </label>
                  <select
                    name="animationType"
                    value={data.animationType || ''}
                    onChange={(e) => {
                      onChange({
                        ...data,
                        animationType: e.target.value as any
                      });
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    <option value="">✨ Match Card Theme (Default)</option>
                    <option value="none">None (Static)</option>
                    <option value="snow">Gentle Snowflakes ❄️</option>
                    <option value="sparkles">Golden Stars & Sparkles ✨</option>
                    <option value="petals">Pink Cherry Blossom Petals 🌸</option>
                    <option value="leaves">Terracotta Autumn Leaves 🍂</option>
                    <option value="glitter">Royal Golden Glitter Dust ⭐</option>
                  </select>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Adds a beautiful, fluid falling particle animation on top of the invitation card.
                  </p>
                </div>

                <div className="flex items-center justify-between p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 rounded-xl transition-all">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Enable Typewriter Effect
                    </label>
                    <p className="text-[10px] text-neutral-500">Gradually type out the couple's names upon loading</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={data.enableTypewriter !== false}
                    onChange={() => {
                      onChange({
                        ...data,
                        enableTypewriter: data.enableTypewriter === false ? true : false
                      });
                    }}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Countdown & Directions */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                Timers & Navigation
              </h3>
              
              <div className="flex items-center justify-between p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 rounded-xl transition-all">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Live Countdown Timer
                  </label>
                  <p className="text-[10px] text-neutral-500">Show days/hours/minutes left until the big day</p>
                </div>
                <input
                  type="checkbox"
                  checked={data.showCountdown !== false}
                  onChange={() => handleCheckboxChange('showCountdown')}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                  Venue Google Maps Link
                </label>
                <input
                  type="url"
                  name="mapDirectionsUrl"
                  value={data.mapDirectionsUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/?q=your-venue"
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Separate Nikah Details */}
            {data.theme === 'islamic' && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    Separate Nikah Ceremony Details
                  </h3>
                  <input
                    type="checkbox"
                    checked={data.showNikahDetails === true}
                    onChange={() => handleCheckboxChange('showNikahDetails')}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300"
                  />
                </div>

                {data.showNikahDetails === true && (
                  <div className="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                          Nikah Date
                        </label>
                        <input
                          type="date"
                          name="nikahDate"
                          value={data.nikahDate || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                          Nikah Time
                        </label>
                        <input
                          type="text"
                          name="nikahTime"
                          value={data.nikahTime || ''}
                          onChange={handleInputChange}
                          placeholder="e.g. 09:00 AM"
                          className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                        Nikah Venue Location
                      </label>
                      <input
                        type="text"
                        name="nikahVenue"
                        value={data.nikahVenue || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. Thavakkal Auditorium, Pooyikuth, Tirur"
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                        Nikah Custom Details / Blessings message
                      </label>
                      <textarea
                        name="nikahDetails"
                        value={data.nikahDetails || ''}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="The Nikah shaking of hands and official marriage registration..."
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Prayers / Duas Section */}
            {data.theme === 'islamic' && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-emerald-600" />
                    Islamic Prayers & Blessings (Duas)
                  </h3>
                  <input
                    type="checkbox"
                    checked={data.showPrayers !== false}
                    onChange={() => handleCheckboxChange('showPrayers')}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300"
                  />
                </div>

                {data.showPrayers !== false && (
                  <div className="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                        Dua for the Couple
                      </label>
                      <textarea
                        name="duaCouple"
                        value={data.duaCouple || ''}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="May Allah bless you both and unite you in goodness. (Barakallahu Lakuma)"
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                        Dua for Families
                      </label>
                      <textarea
                        name="duaFamily"
                        value={data.duaFamily || ''}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="May Allah unite our families and bless our homes with eternal peace and love."
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                        Dua for Guests
                      </label>
                      <textarea
                        name="duaGuests"
                        value={data.duaGuests || ''}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="May Allah reward you with goodness (Jazakum Allah Khair) for sharing in our joy..."
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Meet the Family Details */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                  <Info className="h-4 w-4 text-emerald-600" />
                  Detailed Family Members
                </h3>
                <input
                  type="checkbox"
                  checked={data.showFamilyDetails !== false}
                  onChange={() => handleCheckboxChange('showFamilyDetails')}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300"
                />
              </div>

              {data.showFamilyDetails !== false && (
                <div className="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="space-y-3 p-3 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Groom's Family Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500">Father's Name</label>
                        <input
                          type="text"
                          name="groomFather"
                          value={data.groomFather || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500">Mother's Name</label>
                        <input
                          type="text"
                          name="groomMother"
                          value={data.groomMother || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500">Brother's Name</label>
                        <input
                          type="text"
                          name="groomBrother"
                          value={data.groomBrother || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500">Sister's Name</label>
                        <input
                          type="text"
                          name="groomSister"
                          value={data.groomSister || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-3 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Bride's Family Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500">Father's Name</label>
                        <input
                          type="text"
                          name="brideFather"
                          value={data.brideFather || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500">Mother's Name</label>
                        <input
                          type="text"
                          name="brideMother"
                          value={data.brideMother || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500">Brother's Name</label>
                        <input
                          type="text"
                          name="brideBrother"
                          value={data.brideBrother || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500">Sister's Name</label>
                        <input
                          type="text"
                          name="brideSister"
                          value={data.brideSister || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Styled Credits Footer has been removed per creator request to keep branding fixed */}
          </div>
        )}
      </div>

      {/* Save Action */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !data.groomName || !data.brideName || !data.weddingDate || !data.venue}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
          id="btn-save-invitation"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving Invitation...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save & Generate Shareable Link
            </>
          )}
        </button>

        {/* Share Section (Shows if link is generated) */}
        {shareUrl && (() => {
          const shareText = `You are cordially invited to the wedding of ${data.groomName || "Nabeel"} & ${data.brideName || "Nasla"}! Please view our digital wedding card & RSVP here:`;
          const handleNativeShare = async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  title: `Wedding Invitation - ${data.groomName || "Nabeel"} & ${data.brideName || "Nasla"}`,
                  text: shareText,
                  url: shareUrl,
                });
              } catch (err) {
                console.log("Error sharing", err);
              }
            } else {
              copyToClipboard();
            }
          };

          return (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <Globe className="h-4 w-4" />
                Invitation Created Successfully!
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Your guest invitation card is live. Send this specific link to your friends, family, and loved ones to request RSVPs:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full text-xs px-3 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400 focus:outline-none"
                  id="share-url-input"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
                  title="Copy Link to Clipboard"
                  id="btn-copy-url"
                >
                  {copied ? <span className="text-xs px-1 font-bold">Copied!</span> : <Clipboard className="h-4 w-4" />}
                </button>
              </div>

              {/* Social Share Buttons */}
              <div className="pt-3 border-t border-emerald-200/40 dark:border-emerald-800/20 space-y-3">
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 dark:text-emerald-400 text-center">
                  Share Wedding Invitation
                </p>

                <div className="grid grid-cols-1">
                  <button
                    onClick={handleNativeShare}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99 shadow cursor-pointer"
                    id="btn-direct-share"
                  >
                    <Share2 className="h-4 w-4" />
                    Direct Share Link
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold rounded-lg inline-flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                    title="Share on WhatsApp"
                    id="link-share-whatsapp"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px]">WhatsApp</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold rounded-lg inline-flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                    title="Share on Telegram"
                    id="link-share-telegram"
                  >
                    <Send className="h-4 w-4 text-sky-500" />
                    <span className="text-[10px]">Telegram</span>
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold rounded-lg inline-flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                    title="Share on Facebook"
                    id="link-share-facebook"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <span className="text-[10px]">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
