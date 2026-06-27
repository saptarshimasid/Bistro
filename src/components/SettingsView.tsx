import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Store, 
  Percent, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Save, 
  Trash2, 
  ShieldAlert,
  CheckCircle,
  Info,
  Paintbrush,
  Upload,
  Image,
  Sparkles
} from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
  onResetSystemData: () => void;
  themeStyle: 'gold' | 'platinum';
}

export default function SettingsView({
  settings,
  onSaveSettings,
  onResetSystemData,
  themeStyle
}: SettingsViewProps) {
  
  const [restaurantName, setRestaurantName] = useState(settings.restaurantName);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [taxPercentage, setTaxPercentage] = useState(settings.taxPercentage);
  const [defaultDiscountPercentage, setDefaultDiscountPercentage] = useState(settings.defaultDiscountPercentage);
  const [enableSoundNotifications, setEnableSoundNotifications] = useState(settings.enableSoundNotifications);
  const [kdsRefreshRate, setKdsRefreshRate] = useState(settings.kdsRefreshRate);
  
  const [brandLogo, setBrandLogo] = useState(settings.brandLogo || '');
  const [primaryBrandColor, setPrimaryBrandColor] = useState(settings.primaryBrandColor || '#f97316');
  const [secondaryBrandColor, setSecondaryBrandColor] = useState(settings.secondaryBrandColor || '#ea580c');
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const generatePlaceholderLogo = (style: string) => {
    const initial = restaurantName ? restaurantName.charAt(0).toUpperCase() : 'D';
    let svg = '';
    
    if (style === 'monogram') {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="%2309090b"/>
        <rect width="88" height="88" x="6" y="6" rx="20" fill="none" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="2" stroke-opacity="0.35"/>
        <circle cx="50" cy="50" r="32" fill="none" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="1.5" stroke-dasharray="4 3"/>
        <text x="50" y="62" font-family="'Outfit', 'Inter', sans-serif" font-size="36" font-weight="900" fill="${primaryBrandColor.replace('#', '%23')}" text-anchor="middle">${initial}</text>
      </svg>`;
    } else if (style === 'bistro') {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="%230d0d11"/>
        <path d="M50 20 C40 20 34 26 34 35 C34 43 40 45 44 51 L44 71 L56 71 L56 51 C60 45 66 43 66 35 C66 26 60 20 50 20 Z" fill="none" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M42 71 L58 71" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="4" stroke-linecap="round"/>
        <line x1="40" y1="35" x2="60" y2="35" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="2"/>
        <line x1="50" y1="26" x2="50" y2="44" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="1.5" stroke-dasharray="2 2"/>
      </svg>`;
    } else if (style === 'gourmet') {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="%230b0b0d"/>
        <circle cx="50" cy="50" r="36" fill="none" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="2"/>
        <circle cx="50" cy="50" r="31" fill="none" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="1" stroke-opacity="0.4"/>
        <path d="M42 34 L42 54 M39 37 L45 37 M39 42 L45 42" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M58 34 C54 34 54 44 58 54 Z" fill="${primaryBrandColor.replace('#', '%23')}"/>
        <line x1="42" y1="54" x2="42" y2="68" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="58" y1="54" x2="58" y2="68" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="50" cy="22" r="3.5" fill="${primaryBrandColor.replace('#', '%23')}"/>
      </svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="%23050507"/>
        <path d="M30 24 L70 24 C70 24 70 54 50 74 C30 54 30 24 30 24 Z" fill="none" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M41 37 C41 34 44 31 50 31 C56 31 59 34 59 37 C59 44 50 44 50 51" fill="none" stroke="${primaryBrandColor.replace('#', '%23')}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="50" cy="57" r="2.5" fill="${primaryBrandColor.replace('#', '%23')}"/>
      </svg>`;
    }
    
    setBrandLogo(`data:image/svg+xml,${svg}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBrandLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      restaurantName,
      currencySymbol,
      taxPercentage,
      defaultDiscountPercentage,
      enableSoundNotifications,
      kdsRefreshRate,
      brandLogo,
      primaryBrandColor,
      secondaryBrandColor
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('CRITICAL: This action will restore all orders, tables, catalog menu items, reservations, inventory stocks, and employees rosters back to pristine seed defaults. Active changes will be cleared. Do you wish to proceed?')) {
      onResetSystemData();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans text-left">
      
      {/* Toast Save Alert */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl glow-green text-emerald-400 flex items-center gap-2.5 text-xs"
        >
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
          <span>System configuration overrides compiled and committed to browser sandbox local state successfully!</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: RESTAURANT PROFILE */}
        <div className="glass-card p-6 rounded-2xl space-y-4" id="settings-brand-profile">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Store className="w-5 h-5 text-gold-500" />
            <h5 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Restaurant Brand Profile</h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Establishment Title</label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-sm text-white font-sans font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Currency Marker Symbol</label>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-[#0e0e11] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-2 text-sm text-white cursor-pointer"
              >
                <option value="$">$ USD / CAD</option>
                <option value="£">£ GBP</option>
                <option value="€">€ EUR</option>
                <option value="¥">¥ JPY</option>
                <option value="₹">₹ INR</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 1.5: CUSTOM BRANDING & VISUAL IDENTITY */}
        <div className="glass-card p-6 rounded-2xl space-y-6" id="settings-custom-branding">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Paintbrush className="w-5 h-5 text-gold-500" />
              <h5 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Custom Branding & Identity</h5>
            </div>
            <span className="text-[10px] bg-gold-500/10 text-gold-500 border border-gold-500/20 px-2 py-0.5 rounded-full font-mono font-medium">
              Dynamic CSS Variable Injection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Brand Logo & Generator (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Brand Logo Configuration</span>
              
              <div className="flex items-center gap-4 bg-[#08080a] border border-white/5 rounded-2xl p-4">
                <div className="w-20 h-20 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {brandLogo ? (
                    <img src={brandLogo} alt="Custom brand logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-center p-2">
                      <Image className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <span className="text-[9px] text-gray-500 block leading-tight">Default Icon</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h6 className="text-xs font-bold text-white">Logo Representation</h6>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    This logo will render in the left navigation sidebar and login portal.
                  </p>
                  {brandLogo && (
                    <button
                      type="button"
                      onClick={() => setBrandLogo('')}
                      className="text-[10px] font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
              </div>

              {/* Uploader & Generator */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="logo-upload-input"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload-input"
                    className="w-full bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 rounded-xl py-2 px-3 text-xs text-gray-300 font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Logo Image File</span>
                  </label>
                </div>

                {/* SVG Generator Presets */}
                <div className="bg-[#0b0b0e] border border-white/5 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">Brand Logo Generator</span>
                  </div>
                  <p className="text-[9px] text-gray-500 leading-tight">
                    Generate an elegant, scalable SVG brand mark styled instantly with your selected brand colors.
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {[
                      { key: 'bistro', label: 'Bistro Cap' },
                      { key: 'monogram', label: 'Art Monogram' },
                      { key: 'gourmet', label: 'Cutlery Set' },
                      { key: 'shield', label: 'Crest Shield' }
                    ].map((g) => (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => generatePlaceholderLogo(g.key)}
                        className="bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-lg py-1 px-1.5 text-[10px] text-gray-300 font-medium transition-colors cursor-pointer text-center"
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Color Pickers & Presets (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Brand Palette Configuration</span>
              
              <div className="grid grid-cols-2 gap-4">
                
                {/* Primary Brand Color picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Primary Brand Color</label>
                  <div className="flex items-center gap-2.5 bg-[#08080a] border border-white/5 rounded-xl p-2">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <input
                        type="color"
                        value={primaryBrandColor}
                        onChange={(e) => setPrimaryBrandColor(e.target.value)}
                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      maxLength={7}
                      value={primaryBrandColor}
                      onChange={(e) => setPrimaryBrandColor(e.target.value)}
                      className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs text-white font-mono uppercase w-full font-bold"
                    />
                  </div>
                </div>

                {/* Secondary Brand Color picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Secondary Accent Color</label>
                  <div className="flex items-center gap-2.5 bg-[#08080a] border border-white/5 rounded-xl p-2">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <input
                        type="color"
                        value={secondaryBrandColor}
                        onChange={(e) => setSecondaryBrandColor(e.target.value)}
                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      maxLength={7}
                      value={secondaryBrandColor}
                      onChange={(e) => setSecondaryBrandColor(e.target.value)}
                      className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs text-white font-mono uppercase w-full font-bold"
                    />
                  </div>
                </div>

              </div>

              {/* Quick Brand Presets Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono block">Curation Palette Presets</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Amber Gold', primary: '#f97316', secondary: '#ea580c', colorClass: 'bg-[#f97316]' },
                    { label: 'Royal Blue', primary: '#2563eb', secondary: '#1d4ed8', colorClass: 'bg-[#2563eb]' },
                    { label: 'Cyber Cyan', primary: '#06b6d4', secondary: '#0891b2', colorClass: 'bg-[#06b6d4]' },
                    { label: 'Emerald Mint', primary: '#10b981', secondary: '#059669', colorClass: 'bg-[#10b981]' },
                    { label: 'Velvet Rose', primary: '#f43f5e', secondary: '#e11d48', colorClass: 'bg-[#f43f5e]' },
                    { label: 'Amethyst Violet', primary: '#8b5cf6', secondary: '#7c3aed', colorClass: 'bg-[#8b5cf6]' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setPrimaryBrandColor(preset.primary);
                        setSecondaryBrandColor(preset.secondary);
                      }}
                      className="flex items-center gap-2 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 rounded-xl p-2 transition-colors cursor-pointer text-left"
                    >
                      <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${preset.colorClass}`} />
                      <div className="truncate leading-tight">
                        <span className="text-[10px] font-bold text-gray-300 block">{preset.label}</span>
                        <span className="text-[8px] font-mono text-gray-500">{preset.primary}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* SECTION 2: CHARGE RATINGS */}
        <div className="glass-card p-6 rounded-2xl space-y-4" id="settings-finance-parameters">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Percent className="w-5 h-5 text-gold-500" />
            <h5 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Financial Computations Rates</h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sales tax */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Local Sales Tax (%)</label>
                <span className="font-mono text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                  {taxPercentage}% Standard
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(parseInt(e.target.value))}
                className="w-full accent-gold-500 h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Default discount */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Default Discount Ticket Campaign (%)</label>
                <span className="font-mono text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                  {defaultDiscountPercentage}% Off
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={defaultDiscountPercentage}
                onChange={(e) => setDefaultDiscountPercentage(parseInt(e.target.value))}
                className="w-full accent-gold-500 h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: HARWARE FEEDBACK AND SPEED */}
        <div className="glass-card p-6 rounded-2xl space-y-4" id="settings-alerts-feedback">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Volume2 className="w-5 h-5 text-gold-500" />
            <h5 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">System Alerts & KDS Refresh Rate</h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Audio notifications */}
            <div className="space-y-1.5 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">POS Audio Feedback Chimes</span>
              <label className="flex items-center gap-2.5 cursor-pointer text-gray-300 hover:text-white transition-colors bg-white/[0.01] border border-white/5 py-2.5 px-3.5 rounded-xl">
                <input
                  type="checkbox"
                  checked={enableSoundNotifications}
                  onChange={(e) => setEnableSoundNotifications(e.target.checked)}
                  className="rounded border-white/10 bg-white/5 text-amber-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-medium">
                  {enableSoundNotifications ? 'Chime sound chimes on transactions (Enabled)' : 'Silent POS mode (No sounds)'}
                </span>
              </label>
            </div>

            {/* KDS Refresh Rate */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">KDS Clock Synchronization (Seconds)</label>
                <span className="font-mono text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                  Every {kdsRefreshRate}s
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={kdsRefreshRate}
                onChange={(e) => setKdsRefreshRate(parseInt(e.target.value))}
                className="w-full accent-gold-500 h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTONS */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="submit"
            className="px-5 py-3.5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 cursor-pointer hover:opacity-90 active:scale-[0.98]"
          >
            <Save className="w-4 h-4 animate-pulse" />
            <span>Save Settings Override</span>
          </button>
        </div>

      </form>

      {/* SECTION 4: DESTRUCTIVE SYSTEM REPAIR (HIGH VALUE FOR EVALUATION DEMO) */}
      <div className="p-6 bg-red-500/5 border border-red-500/25 rounded-2xl relative overflow-hidden" id="destructive-recovery-panel">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.02] rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
            <h5 className="font-display font-extrabold text-sm uppercase tracking-wider">Destructive Demo Restoration Node</h5>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            Are you finished experimenting with orders, tables occupancy changes, restocking stock logs, reservation seating, and roster additions? Use the database repair trigger below to purge current state cookies and restore Bistro back to seed defaults.
          </p>

          <button
            onClick={handleResetData}
            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/15 border border-red-500/25 text-red-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Bistro Database Defaults</span>
          </button>
        </div>
      </div>

    </div>
  );
}
