import React, { useState, useEffect, useCallback } from 'react';

// Utility to ensure Inter font and Tailwind CSS are loaded and global styles
const setupGlobalStyles = () => {
  const head = document.head;

  // Add Inter font
  const interLink = document.createElement('link');
  interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  interLink.rel = 'stylesheet';
  if (!head.querySelector(`link[href="${interLink.href}"]`)) {
    head.appendChild(interLink);
  }

  // Add Tailwind CSS CDN
  const tailwindScript = document.createElement('script');
  tailwindScript.src = 'https://cdn.tailwindcss.com';
  if (!head.querySelector(`script[src="${tailwindScript.src}"]`)) {
    head.appendChild(tailwindScript);
  }

  // Add global styles for animations and font-family
  const style = document.createElement('style');
  style.innerHTML = `
    body {
      font-family: 'Inter', sans-serif;
    }
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out;
    }
    .animate-slide-up {
        animation: slideUp 0.6s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    /* Additional utility for text shadow on quotes */
    .text-shadow-lg {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
    }
    /* Basic Arabic font for Quran page - improve as needed */
    .font-arabic {
        font-family: 'Amiri', serif;
    }
    /* For image carousel, ensuring aspect ratio */
    .aspect-square {
        aspect-ratio: 1 / 1;
    }
    .aspect-vertical {
        aspect-ratio: 9 / 16; /* Typical phone portrait aspect ratio */
    }
  `;
  if (!head.querySelector('style[data-global-styles]')) {
    style.setAttribute('data-global-styles', 'true');
    head.appendChild(style);
  }

  // Load a common Arabic font for the Quran page if not already loaded
  const amiriLink = document.createElement('link');
  amiriLink.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
  amiriLink.rel = 'stylesheet';
  if (!head.querySelector(`link[href="${amiriLink.href}"]`)) {
    head.appendChild(amiriLink);
  }
};

// Call global style setup once
setupGlobalStyles();

// Mock Data for the app (some of these will be replaced by API fetches)
const mockPrayerTimes = [
  { name: 'Fajr', time: '05:30 AM', isCurrent: false, isNext: false },
  { name: 'Dhuhr', time: '01:00 PM', isCurrent: true, isNext: false },
  { name: 'Asr', time: '04:30 PM', isCurrent: false, isNext: true },
  { name: 'Maghrib', time: '06:45 PM', isCurrent: false, isNext: false },
  { name: 'Isha', time: '08:00 PM', isCurrent: false, isNext: false },
];

const mockQuranVerses = [
  {
    verse: "It is He who made the sun a shining light and the moon a [derived] light and determined for it phases - that you may know the number of years and the reckoning [of time]. Allah has not created this except in truth. He details the signs for a people who know.",
    translation: "Surah Yunus, Ayah 5",
  },
  {
    verse: "And indeed, We have eased the Qur'an for remembrance, so is there any who will remember?",
    translation: "Surah Al-Qamar, Ayah 17",
  },
  {
    verse: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    translation: "Surah Al-Baqarah, Ayah 152",
  },
  {
    verse: "Indeed, Allah is with the patient.",
    translation: "Surah Al-Baqarah, Ayah 153",
  }
];

const mockVideos = [
  { title: "The Beauty of Islam", url: "https://placehold.co/400x225/336699/ffffff?text=Video+1" },
  { title: "Understanding the Quran", url: "https://placehold.co/400x225/4CAF50/ffffff?text=Video+2" },
  { title: "Prophet Muhammad's Life", url: "https://placehold.co/400x225/FFC107/ffffff?text=Video+3" },
  { title: "Islamic Ethics", url: "https://placehold.co/400x225/00BCD4/ffffff?text=Video+4" },
];

const mockImages = [
  { id: 1, url: "https://placehold.co/360x640/8BC34A/ffffff?text=Wallpaper+1", alt: "Islamic Wallpaper 1" },
  { id: 2, url: "https://placehold.co/360x640/CDDC39/ffffff?text=Wallpaper+2", alt: "Islamic Wallpaper 2" },
  { id: 3, url: "https://placehold.co/360x640/FFEB3B/ffffff?text=Wallpaper+3", alt: "Islamic Wallpaper 3" },
  { id: 4, url: "https://placehold.co/360x640/FFC107/ffffff?text=Wallpaper+4", alt: "Islamic Wallpaper 4" },
  { id: 5, url: "https://placehold.co/360x640/FF9800/ffffff?text=Wallpaper+5", alt: "Islamic Wallpaper 5" },
  { id: 6, url: "https://placehold.co/360x640/FF5722/ffffff?text=Wallpaper+6", alt: "Islamic Wallpaper 6" },
  { id: 7, url: "https://placehold.co/360x640/F44336/ffffff?text=Wallpaper+7", alt: "Islamic Wallpaper 7" },
  { id: 8, url: "https://placehold.co/360x640/E91E63/ffffff?text=Wallpaper+8", alt: "Islamic Wallpaper 8" },
];

const mockQuotes = [
  {
    quote: "Do good deeds properly, sincerely and moderately. Always remember that your deeds alone will not save you, and that the most beloved deed to Allah is that which is done regularly even if it is small.",
    author: "Prophet Muhammad (PBUH)",
    bgImage: "https://placehold.co/600x600/4CAF50/ffffff?text=Quote+BG+1",
  },
  {
    quote: "When you stand up for prayer, think of it as your last prayer.",
    author: "Abu Bakr (RA)",
    bgImage: "https://placehold.co/600x600/2196F3/ffffff?text=Quote+BG+2",
  },
  {
    quote: "The best among you are those who have the best manners and character.",
    author: "Prophet Muhammad (PBUH)",
    bgImage: "https://placehold.co/600x600/FF9800/ffffff?text=Quote+BG+3",
  },
];

const mockDuas = [
  { category: "Daily", title: "Dua for Travel", text: "Subhanal-ladhi sakhkhara lana hadha wama kunna lahu muqrineen wa inna ila rabbina lamunqaliboon." },
  { category: "Daily", title: "Dua for Health", text: "Allahumma afini fi badani, Allahumma afini fi sam'i, Allahumma afini fi basari, la ilaha illa Anta." },
  { category: "Daily", title: "Dua Before Eating", text: "Bismillahi wa 'ala barakatillah." },
  { category: "Daily", title: "Dua After Eating", text: "Alhamdulillahil-ladhi at'amana wa saqana wa ja'alana minal-Muslimin." },
  { category: "Morning/Evening", title: "Dua for Morning", text: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur." },
  { category: "Morning/Evening", title: "Dua for Evening", text: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir." },
  { category: "Forgiveness", title: "Dua for Forgiveness", text: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni." },
  { category: "Protection", title: "Dua for Protection from Evil", text: "A'udhu bi kalimatillahit-tammati min sharri ma khalaq." },
];

const mockSurahs = [
  { id: 1, name: "Al-Fatihah", english: "The Opening", verses: 7, arabic_name: "الفاتحة", mushafPage: "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+1" },
  { id: 2, name: "Al-Baqarah", english: "The Cow", verses: 286, arabic_name: "البقرة", mushafPage: "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+2" },
  { id: 3, name: "Al-Imran", english: "The Family of Imran", verses: 200, arabic_name: "آل عمران", mushafPage: "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+3" },
  { id: 18, name: "Al-Kahf", english: "The Cave", verses: 110, arabic_name: "الكهف", mushafPage: "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+18" },
  { id: 36, name: "Ya-Sin", english: "Ya-Sin", verses: 83, arabic_name: "يس", mushafPage: "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+36" },
  { id: 55, name: "Ar-Rahman", english: "The Most Gracious", verses: 78, arabic_name: "الرحمن", mushafPage: "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+55" },
  { id: 112, name: "Al-Ikhlas", english: "The Purity", verses: 4, arabic_name: "الإخلاص", mushafPage: "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+112" },
  { id: 113, name: "Al-Falaq", english: "The Daybreak", verses: 5, arabic_name: "الفلق", mushafPage: "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+113" },
  { id: 114, name: "An-Nas", english: "Mankind", verses: 6, arabic_name: "الناس", mushafPage: "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+114" },
];

// Main App component
const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashStep, setSplashStep] = useState(0);
  const [currentPage, setCurrentPage] = useState('/');

  // Splash screen images
  const splashImages = [
    "https://placehold.co/720x1280/10b981/ffffff?text=Welcome+to+Islamic+App",
    "https://placehold.co/720x1280/059669/ffffff?text=Accurate+Prayer+Times",
    "https://placehold.co/720x1280/047857/ffffff?text=Holy+Quran+%26+Duas",
    "https://placehold.co/720x1280/065F46/ffffff?text=Daily+Inspiration",
  ];

  const splashScreens = [
    {
      title: "Welcome to Islamic App",
      description: "Your comprehensive companion for daily Islamic needs.",
      bgImage: splashImages[0]
    },
    {
      title: "Prayer Times & Qibla",
      description: "Never miss a prayer with accurate timings and Qibla direction.",
      bgImage: splashImages[1]
    },
    {
      title: "Quran & Duas",
      description: "Read the Holy Quran and access a vast collection of supplications.",
      bgImage: splashImages[2]
    },
    {
      title: "Daily Reminders & Media",
      description: "Inspiring quotes, videos, and beautiful Islamic images.",
      bgImage: splashImages[3]
    },
  ];

  const handleNextSplash = () => {
    if (splashStep < splashScreens.length - 1) {
      setSplashStep(splashStep + 1);
    } else {
      setShowSplash(false);
      setCurrentPage('/');
    }
  };

  const handleSkipSplash = () => {
    setShowSplash(false);
    setCurrentPage('/');
  };

  const handleNavLinkClick = (path) => {
    setCurrentPage(path);
  };

  if (showSplash) {
    const currentSplash = splashScreens[splashStep];
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in bg-cover bg-center"
        style={{ backgroundImage: `url(${currentSplash.bgImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold mb-4">{currentSplash.title}</h1>
          <p className="text-lg mb-8 max-w-md">{currentSplash.description}</p>
          <div className="flex space-x-4 mb-8">
            {splashScreens.map((_, index) => (
              <span key={index} className={`h-2 w-8 rounded-full transition-all duration-300 ${splashStep === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}></span>
            ))}
          </div>
          <div className="flex flex-col space-y-4 w-full max-w-xs">
            {splashStep < splashScreens.length - 1 ? (
              <button
                onClick={handleNextSplash}
                className="bg-white text-emerald-700 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleNextSplash}
                className="bg-white text-emerald-700 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
              >
                Get Started
              </button>
            )}
            <button
              onClick={handleSkipSplash}
              className="text-white border border-white py-3 px-6 rounded-full hover:bg-white hover:text-emerald-700 transition-colors duration-300 transform hover:scale-105"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <main className="flex-grow pb-16">
        {renderPage(currentPage, handleNavLinkClick)}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg flex justify-around py-2 border-t border-gray-200 rounded-t-lg z-50">
        <NavLink path="/" currentPage={currentPage} onClick={handleNavLinkClick} icon="🏠" label="Home" />
        <NavLink path="/prayer" currentPage={currentPage} onClick={handleNavLinkClick} icon="🕌" label="Prayer" />
        <NavLink path="/quran" currentPage={currentPage} onClick={handleNavLinkClick} icon="📖" label="Quran" />
        <NavLink path="/duas" currentPage={currentPage} onClick={handleNavLinkClick} icon="🤲" label="Duas" />
        <NavLink path="/more" currentPage={currentPage} onClick={handleNavLinkClick} icon="⚙️" label="More" />
      </nav>
    </div>
  );
};

const NavLink = ({ path, currentPage, onClick, icon, label }) => (
  <button
    onClick={() => onClick(path)}
    className={`flex flex-col items-center flex-1 py-2 px-1 rounded-lg transition-colors duration-200 ${
      currentPage === path ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="text-xl mb-1">{icon}</span>
    <span className="text-xs">{label}</span>
  </button>
);

const renderPage = (currentPage, handleNavLinkClick) => {
  switch (currentPage) {
    case '/':
      return <HomePage prayerTimes={mockPrayerTimes} quranVerses={mockQuranVerses} videos={mockVideos} images={mockImages} quotes={mockQuotes} />;
    case '/prayer':
      return <PrayerPage />;
    case '/quran':
      return <QuranPage surahs={mockSurahs} />;
    case '/duas':
      return <DuasPage duas={mockDuas} />;
    case '/more':
      return <MorePage handleNavLinkClick={handleNavLinkClick} />;
    default:
      return <HomePage prayerTimes={mockPrayerTimes} quranVerses={mockQuranVerses} videos={mockVideos} images={mockImages} quotes={mockQuotes} />;
  }
};

// --- Page Components ---

const HomePage = ({ prayerTimes, quranVerses, videos, images, quotes }) => {
  const [displayedPrayerIndex, setDisplayedPrayerIndex] = useState(0); // Start with Fajr for consistent display
  const [currentPrayerTimes, setCurrentPrayerTimes] = useState(mockPrayerTimes); // Using mock for now, will be replaced by API
  const [city, setCity] = useState(localStorage.getItem('prayerCity') || 'London');
  const [country, setCountry] = useState(localStorage.getItem('prayerCountry') || 'UK');
  const [calculationMethod, setCalculationMethod] = useState(localStorage.getItem('prayerMethod') || '2'); // Default to ISNA
  const [isLoadingPrayerTimes, setIsLoadingPrayerTimes] = useState(false);
  const [prayerError, setPrayerError] = useState(null);

  const prayerCalculationMethods = [
    { id: '1', name: 'University of Islamic Sciences, Karachi' },
    { id: '2', name: 'Islamic Society of North America (ISNA)' },
    { id: '3', name: 'Muslim World League' },
    { id: '4', name: 'Umm Al-Qura University, Makkah' },
    { id: '5', name: 'Egyptian General Authority of Survey' },
    { id: '7', name: 'Institute of Geophysics, University of Tehran' },
    { id: '8', name: 'Kuwait' },
    { id: '9', name: 'Qatar' },
    { id: '10', name: 'Majlis Ugama Islam Singapura (MUIS)' },
    { id: '11', name: 'Union Des Organisations Islamiques De France' },
    { id: '12', name: 'Russia' },
    { id: '13', name: 'Dubai (fixed data)' },
    { id: '14', name: 'Moonsighting Committee (Fixed Data)' },
    { id: '15', name: 'North America (Fixed Data)' },
    { id: '16', name: 'Turkey (Diyanet)' },
    { id: '17', name: 'MWL (Fixed Data)' },
    { id: '18', name: 'Pakistan (Fixed Data)' },
    { id: '99', name: 'Custom (Requires parameters not in this demo)' },
  ];

  const fetchPrayerTimes = useCallback(async () => {
    setIsLoadingPrayerTimes(true);
    setPrayerError(null);
    try {
      // Simulate API call for demonstration. In a real app, use the actual Aladhan API.
      // Example Aladhan API URL: https://api.aladhan.com/v1/timingsByCity?city=London&country=UK&method=2
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${calculationMethod}`);
      const data = await response.json();

      if (data.code === 200 && data.status === "OK") {
        const timings = data.data.timings;
        const fetchedTimes = [
          { name: 'Fajr', time: timings.Fajr },
          { name: 'Dhuhr', time: timings.Dhuhr },
          { name: 'Asr', time: timings.Asr },
          { name: 'Maghrib', time: timings.Maghrib },
          { name: 'Isha', time: timings.Isha },
        ].filter(t => t.time !== '00:00'); // Filter out invalid times if any

        // Determine current and next prayer dynamically
        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        let current = null;
        let next = null;
        let foundCurrent = false;

        const updatedPrayerTimes = fetchedTimes.map((p, index) => {
          const [hours, minutes] = p.time.split(':').map(Number);
          const prayerTimeInMinutes = hours * 60 + minutes;

          if (currentTimeInMinutes >= prayerTimeInMinutes && !foundCurrent) {
            current = p.name;
          } else if (!foundCurrent && currentTimeInMinutes < prayerTimeInMinutes) {
            next = p.name;
            foundCurrent = true; // Mark as found to get the very next one
          }

          return { ...p, isCurrent: false, isNext: false }; // Reset flags
        });

        // Set flags based on determined current/next
        let nextPrayerFound = false;
        const finalPrayerTimes = updatedPrayerTimes.map((p, index) => {
          let isCurrent = false;
          let isNext = false;

          const [hours, minutes] = p.time.split(':').map(Number);
          const prayerTimeInMinutes = hours * 60 + minutes;

          if (current === null && index === 0 && currentTimeInMinutes < prayerTimeInMinutes) {
              // If no prayer has passed yet today, Fajr is the next/first current
              isCurrent = true;
          } else if (p.name === current && currentTimeInMinutes >= prayerTimeInMinutes) {
              isCurrent = true;
          }

          // Find the next prayer after the current time, wrapping around to next day if needed
          if (prayerTimeInMinutes > currentTimeInMinutes && !nextPrayerFound) {
              isNext = true;
              nextPrayerFound = true;
          }

          return { ...p, isCurrent, isNext };
        });

        // If no 'next' prayer found (all prayers for today have passed), the next prayer is Fajr of tomorrow
        if (!nextPrayerFound && finalPrayerTimes.length > 0) {
            finalPrayerTimes[0].isNext = true; // Mark Fajr as next
        }


        setCurrentPrayerTimes(finalPrayerTimes);
        // Set the displayed prayer to the actual current prayer or Fajr if no current
        setDisplayedPrayerIndex(finalPrayerTimes.findIndex(p => p.isCurrent) !== -1
          ? finalPrayerTimes.findIndex(p => p.isCurrent)
          : finalPrayerTimes.findIndex(p => p.name === 'Fajr') // Default to Fajr
        );

        localStorage.setItem('prayerCity', city);
        localStorage.setItem('prayerCountry', country);
        localStorage.setItem('prayerMethod', calculationMethod);

      } else {
        setPrayerError(data.data.message || "Failed to fetch prayer times. Please check city/country.");
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      setPrayerError("Could not fetch prayer times. Network error or invalid location.");
    } finally {
      setIsLoadingPrayerTimes(false);
    }
  }, [city, country, calculationMethod]); // Depend on city, country, method

  useEffect(() => {
    fetchPrayerTimes(); // Initial fetch
    const interval = setInterval(fetchPrayerTimes, 60 * 60 * 1000); // Refresh every hour
    return () => clearInterval(interval);
  }, [fetchPrayerTimes]);

  const handleNextPrayerDisplay = () => {
    setDisplayedPrayerIndex((prevIndex) => (prevIndex + 1) % currentPrayerTimes.length);
  };
  const handlePrevPrayerDisplay = () => {
    setDisplayedPrayerIndex((prevIndex) => (prevIndex - 1 + currentPrayerTimes.length) % currentPrayerTimes.length);
  };

  const currentDisplayedPrayer = currentPrayerTimes[displayedPrayerIndex];
  const nextPrayerInSequence = currentPrayerTimes[(displayedPrayerIndex + 1) % currentPrayerTimes.length];

  // Random Quran verse
  const [randomVerse, setRandomVerse] = useState({});
  useEffect(() => {
    const verse = quranVerses[Math.floor(Math.random() * quranVerses.length)];
    setRandomVerse(verse);
  }, []);

  // Carousel states
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const nextVideo = () => setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  const prevVideo = () => setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const nextQuote = () => setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  const prevQuote = () => setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);

  const handleDownloadImage = (imageUrl) => {
    console.log(`Simulating download for: ${imageUrl}`);
    alert(`Downloading image: ${imageUrl}`);
  };

  const handleShareQuote = (quoteText) => {
    console.log(`Simulating share for: "${quoteText}"`);
    alert(`Sharing quote: "${quoteText}"`);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-6 rounded-b-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-2">Assalamu Alaikum!</h1>
        <p className="text-lg">Welcome to your Islamic Companion.</p>
      </div>

      {/* Prayer Time Display - Combined into one line/card with navigation */}
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between animate-slide-up">
        <button
          onClick={handlePrevPrayerDisplay}
          className="text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center flex-grow">
          {isLoadingPrayerTimes ? (
            <p className="text-lg text-gray-700">Loading prayer times...</p>
          ) : prayerError ? (
            <p className="text-lg text-red-500">{prayerError}</p>
          ) : currentDisplayedPrayer ? (
            <>
              <p className="text-lg font-semibold text-gray-700">
                Current: <span className="text-emerald-700 font-bold text-xl">{currentDisplayedPrayer.name} ({currentDisplayedPrayer.time})</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Next: {nextPrayerInSequence.name} at {nextPrayerInSequence.time}
              </p>
            </>
          ) : (
            <p className="text-lg text-gray-700">No prayer data available.</p>
          )}
        </div>
        <button
          onClick={handleNextPrayerDisplay}
          className="text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>


      {/* Random Quran Verse */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500 animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Quran Verse of the Day</h2>
        {randomVerse.verse ? (
          <>
            <p className="text-lg text-gray-800 font-serif leading-relaxed italic">"{randomVerse.verse}"</p>
            <p className="text-right text-sm text-gray-500 mt-2">— {randomVerse.translation}</p>
          </>
        ) : (
          <p className="text-gray-600">Loading verse...</p>
        )}
      </div>

      {/* Video Display Carousel */}
      <div className="bg-white p-5 rounded-lg shadow-md animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Islamic Videos</h2>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={videos[currentVideoIndex].url}
            alt={videos[currentVideoIndex].title}
            className="w-full h-48 object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold">
            {videos[currentVideoIndex].title}
          </div>
          <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-2">
            <button
              onClick={prevVideo}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
            >
              &#10094;
            </button>
            <button
              onClick={nextVideo}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
            >
              &#10095;
            </button>
          </div>
        </div>
        <p className="text-sm text-center text-gray-500 mt-2">{currentVideoIndex + 1} / {videos.length}</p>
      </div>

      {/* Image Portrait Carousel for Download */}
      <div className="bg-white p-5 rounded-lg shadow-md animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Islamic Wallpapers</h2>
        <div className="relative overflow-hidden rounded-lg aspect-vertical w-full max-w-sm mx-auto">
          <img
            src={images[currentImageIndex].url}
            alt={images[currentImageIndex].alt}
            className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black bg-opacity-50 text-white p-2 rounded-lg">
            <div className="flex space-x-1">
                {images.map((_, idx) => (
                    <span key={idx} className={`block w-2 h-2 rounded-full ${currentImageIndex === idx ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                ))}
            </div>
            <button
              onClick={() => handleDownloadImage(images[currentImageIndex].url)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-3 rounded-full text-sm shadow-md transition-colors"
            >
              Download
            </button>
          </div>
          <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-2">
            <button
              onClick={prevImage}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
            >
              &#10094;
            </button>
            <button
              onClick={nextImage}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
            >
              &#10095;
            </button>
          </div>
        </div>
      </div>

      {/* Daily Quote Carousel */}
      <div className="bg-white p-5 rounded-lg shadow-md animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Daily Inspiration</h2>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={quotes[currentQuoteIndex].bgImage}
            alt="Quote Background"
            className="absolute inset-0 w-full h-full object-cover filter blur-sm transform scale-105"
          />
          <div className="relative z-10 flex flex-col justify-between h-full w-full text-white p-4">
            <p className="text-lg md:text-xl font-semibold text-center italic leading-relaxed text-shadow-lg">
              "{quotes[currentQuoteIndex].quote}"
            </p>
            <p className="text-sm md:text-md text-center mt-2 font-medium text-shadow-lg">— {quotes[currentQuoteIndex].author}</p>
            <div className="absolute bottom-2 left-2 text-white text-xs font-bold bg-black bg-opacity-30 px-2 py-1 rounded-md">
              Islamic App
            </div>
            <div className="absolute bottom-2 right-2">
              <button
                onClick={() => handleShareQuote(quotes[currentQuoteIndex].quote)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-bold py-2 px-4 rounded-full shadow-md backdrop-blur-sm transition-colors"
              >
                Share
              </button>
            </div>
          </div>
          <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-2">
            <button
              onClick={prevQuote}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
            >
              &#10094;
            </button>
            <button
              onClick={nextQuote}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
            >
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrayerPage = () => {
  const [city, setCity] = useState(localStorage.getItem('prayerCity') || '');
  const [country, setCountry] = useState(localStorage.getItem('prayerCountry') || '');
  const [calculationMethod, setCalculationMethod] = useState(localStorage.getItem('prayerMethod') || '2'); // Default to ISNA
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const prayerCalculationMethods = [
    { id: '1', name: 'University of Islamic Sciences, Karachi' },
    { id: '2', name: 'Islamic Society of North America (ISNA)' },
    { id: '3', name: 'Muslim World League' },
    { id: '4', name: 'Umm Al-Qura University, Makkah' },
    { id: '5', name: 'Egyptian General Authority of Survey' },
    { id: '7', name: 'Institute of Geophysics, University of Tehran' },
    { id: '8', name: 'Kuwait' },
    { id: '9', name: 'Qatar' },
    { id: '10', name: 'Majlis Ugama Islam Singapura (MUIS)' },
    { id: '11', name: 'Union Des Organisations Islamiques De France' },
    { id: '12', name: 'Russia' },
    { id: '13', name: 'Dubai (fixed data)' },
    { id: '14', name: 'Moonsighting Committee (Fixed Data)' },
    { id: '15', name: 'North America (Fixed Data)' },
    { id: '16', name: 'Turkey (Diyanet)' },
    { id: '17', name: 'MWL (Fixed Data)' },
    { id: '18', name: 'Pakistan (Fixed Data)' },
    { id: '99', name: 'Custom (Requires parameters not in this demo)' }, // Custom method
  ];

  const fetchPrayerTimes = useCallback(async () => {
    if (!city || !country) {
      setError("Please enter both city and country.");
      setPrayerTimes([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const formattedDate = currentDate.toLocaleDateString('en-US').split('/').join('-'); // MM-DD-YYYY
      const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${calculationMethod}&date=${formattedDate}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.code === 200 && data.status === "OK") {
        const timings = data.data.timings;
        const fetched = [
          { name: 'Fajr', time: timings.Fajr },
          { name: 'Sunrise', time: timings.Sunrise },
          { name: 'Dhuhr', time: timings.Dhuhr },
          { name: 'Asr', time: timings.Asr },
          { name: 'Maghrib', time: timings.Maghrib },
          { name: 'Isha', time: timings.Isha },
        ].filter(t => t.time !== '00:00'); // Remove invalid entries

        // Determine current and next prayer dynamically for highlighting
        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        let currentPrayerName = null;
        let nextPrayerName = null;
        let foundNext = false;

        const processedTimes = fetched.map(p => {
          const [hours, minutes] = p.time.split(':').map(Number);
          const prayerTimeInMinutes = hours * 60 + minutes;

          let isCurrent = false;
          let isNext = false;

          // Mark current prayer
          if (currentTimeInMinutes >= prayerTimeInMinutes) {
            currentPrayerName = p.name;
          }

          // Mark next prayer
          if (prayerTimeInMinutes > currentTimeInMinutes && !foundNext) {
            nextPrayerName = p.name;
            foundNext = true;
          }
          return { ...p, isCurrent: false, isNext: false }; // Reset for fresh marking
        });

        const finalPrayerTimes = processedTimes.map(p => ({
          ...p,
          isCurrent: p.name === currentPrayerName,
          isNext: p.name === nextPrayerName,
        }));

        // If no 'next' prayer found (all passed today), mark tomorrow's Fajr as next
        if (!nextPrayerName && finalPrayerTimes.length > 0) {
          finalPrayerTimes[0].isNext = true; // Assumes Fajr is always the first prayer
        }

        setPrayerTimes(finalPrayerTimes);
        localStorage.setItem('prayerCity', city);
        localStorage.setItem('prayerCountry', country);
        localStorage.setItem('prayerMethod', calculationMethod);

      } else {
        setError(data.data.message || "Failed to fetch prayer times. Please check city/country.");
        setPrayerTimes([]);
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      setError("Could not fetch prayer times. Network error or invalid location.");
      setPrayerTimes([]);
    } finally {
      setIsLoading(false);
    }
  }, [city, country, calculationMethod, currentDate]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]); // Re-fetch when dependencies change

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFormattedDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handlePrevDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  return (
    <div className="p-4 animate-fade-in">
      <div className="bg-white p-5 rounded-lg shadow-md mb-4">
        <h1 className="text-3xl font-extrabold text-emerald-700 mb-4 text-center">Prayer Times</h1>

        {/* Location and Method Selection */}
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., London"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g., UK"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">Calculation Method</label>
            <select
              id="method"
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {prayerCalculationMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchPrayerTimes}
            disabled={isLoading || !city || !country}
            className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Fetching...' : 'Get Prayer Times'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="flex justify-between items-center mt-4 mb-4">
          <button onClick={handlePrevDay} className="text-emerald-600 p-2 rounded-full hover:bg-emerald-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-xl font-semibold text-gray-800">{getDayName(currentDate)}</p>
            <p className="text-sm text-gray-500">{getFormattedDate(currentDate)}</p>
          </div>
          <button onClick={handleNextDay} className="text-emerald-600 p-2 rounded-full hover:bg-emerald-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-3 mt-6">
          {prayerTimes.length > 0 ? (
            prayerTimes.map((prayer) => (
              <div
                key={prayer.name}
                className={`p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-300 ${
                  prayer.isCurrent
                    ? 'bg-emerald-100 border border-emerald-500'
                    : prayer.isNext
                    ? 'bg-blue-100 border border-blue-500'
                    : 'bg-gray-50'
                }`}
              >
                <p className="text-lg font-medium text-gray-800">{prayer.name}</p>
                <p className={`text-2xl font-bold ${prayer.isCurrent ? 'text-emerald-700' : prayer.isNext ? 'text-blue-700' : 'text-gray-600'}`}>
                  {prayer.time}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Enter location and get prayer times.</p>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-4">Times are fetched from Aladhan API and are estimates.</p>
      </div>
    </div>
  );
};

const QuranPage = ({ surahs }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('verses'); // 'verses' or 'mushaf'

  // Load saved progress from local storage on component mount
  const getSavedProgress = () => {
    try {
      const savedSurahId = localStorage.getItem('lastReadSurahId');
      const savedAyahIndex = localStorage.getItem('lastReadAyahIndex');
      if (savedSurahId && savedAyahIndex) {
        const surah = surahs.find(s => s.id === parseInt(savedSurahId));
        if (surah) {
          return { surah, ayahIndex: parseInt(savedAyahIndex) };
        }
      }
    } catch (e) {
      console.error("Failed to load Quran progress from local storage:", e);
    }
    return { surah: null, ayahIndex: 0 };
  };

  const [selectedSurah, setSelectedSurah] = useState(getSavedProgress().surah);
  const [selectedAyahIndex, setSelectedAyahIndex] = useState(getSavedProgress().ayahIndex);

  // Save progress to local storage whenever selectedSurah or selectedAyahIndex changes
  useEffect(() => {
    try {
      if (selectedSurah) {
        localStorage.setItem('lastReadSurahId', selectedSurah.id.toString());
        localStorage.setItem('lastReadAyahIndex', selectedAyahIndex.toString());
      } else {
        localStorage.removeItem('lastReadSurahId');
        localStorage.removeItem('lastReadAyahIndex');
      }
    } catch (e) {
      console.error("Failed to save Quran progress to local storage:", e);
    }
  }, [selectedSurah, selectedAyahIndex]);

  const handleSurahClick = (surah) => {
    setSelectedSurah(surah);
    setSelectedAyahIndex(0); // Reset to first ayah when new surah selected
    setIsSidebarOpen(false); // Close sidebar after selection
  };

  // Simplified mock Ayahs for demonstration
  const mockAyahContent = {
    1: [ // Al-Fatihah
      { arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", english: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", english: "All praise is due to Allah, Lord of the worlds -" },
      { arabic: "الرَّحْمَٰنِ الرَّحِيمِ", english: "The Entirely Merciful, the Especially Merciful," },
      { arabic: "مَالِكِ يَوْمِ الدِّينِ", english: "Sovereign of the Day of Recompense." },
      { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", english: "It is You we worship and You we ask for help." },
      { arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", english: "Guide us to the straight path -" },
      { arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", english: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] wrath or of those who are astray." },
    ],
    2: [ // Al-Baqarah (first few for example)
      { arabic: "الم", english: "Alif, Lam, Meem." },
      { arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", english: "This is the Book about which there is no doubt, a guidance for those conscious of Allah -" },
      { arabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", english: "Who believe in the unseen, establish prayer, and spend from what We have provided for them," },
    ]
  };

  const getAyahsForSelectedSurah = () => {
    if (!selectedSurah) return [];
    return mockAyahContent[selectedSurah.id] || [];
  };

  return (
    <div className="relative min-h-screen animate-fade-in">
      {/* Burger Icon */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 bg-emerald-700 text-white rounded-tr-lg">
          <h2 className="text-xl font-bold">Surahs</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-full hover:bg-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          {surahs.map((surah) => (
            <li
              key={surah.id}
              onClick={() => handleSurahClick(surah)}
              className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors duration-200 ${
                selectedSurah && selectedSurah.id === surah.id
                  ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-inner'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span>
                {surah.id}. {surah.name} <span className="text-sm text-gray-500">({surah.english})</span>
              </span>
              <span className="text-sm text-gray-400 font-arabic">{surah.arabic_name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className={`p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="bg-white p-4 rounded-lg shadow-md min-h-[calc(100vh-100px)]">
          {selectedSurah ? (
            <div>
              <h2 className="text-2xl font-bold text-center text-emerald-700 mb-4 py-2 border-b border-gray-200">
                {selectedSurah.name} <span className="text-lg text-gray-600">({selectedSurah.english})</span>
              </h2>
              <div className="flex justify-center mb-4 border-b border-gray-200">
                <button
                  onClick={() => setCurrentView('verses')}
                  className={`py-2 px-4 text-center text-lg font-medium ${currentView === 'verses' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Verses & Translation
                </button>
                <button
                  onClick={() => setCurrentView('mushaf')}
                  className={`py-2 px-4 text-center text-lg font-medium ${currentView === 'mushaf' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Mushaf View
                </button>
              </div>

              {currentView === 'verses' && (
                <>
                  {selectedSurah && (
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-gray-500 text-sm">Last read:</span>
                      <span className="font-semibold text-emerald-700">
                        {selectedSurah.name} : Ayah {selectedAyahIndex + 1}
                      </span>
                    </div>
                  )}
                  <div className="space-y-6 mt-4">
                    {getAyahsForSelectedSurah().map((ayahData, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedAyahIndex(index)}
                        className={`border-b pb-4 last:border-b-0 border-gray-100 cursor-pointer p-2 rounded-lg transition-all ${
                          selectedAyahIndex === index ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-2xl text-right font-arabic leading-loose mb-2 rtl:text-right">
                          <span className="text-emerald-600 font-bold mr-2">{index + 1}.</span>{ayahData.arabic}
                        </p>
                        <p className="text-md text-gray-700 leading-relaxed bg-gray-50 p-2 rounded-md">
                          <span className="font-semibold">Translation:</span> {ayahData.english}
                        </p>
                        <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-3 py-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13m-6 2l-6-3-6 3V7l6-3 6 3v13z" />
                          </svg>
                          Play Audio
                        </button>
                      </div>
                    ))}
                  </div>
                  {getAyahsForSelectedSurah().length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                      <button
                        onClick={() => setSelectedAyahIndex(prev => Math.max(0, prev - 1))}
                        disabled={selectedAyahIndex === 0}
                        className="bg-emerald-500 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-lg font-bold text-gray-700">
                        Ayah {selectedAyahIndex + 1} of {getAyahsForSelectedSurah().length}
                      </span>
                      <button
                        onClick={() => setSelectedAyahIndex(prev => Math.min(getAyahsForSelectedSurah().length - 1, prev + 1))}
                        disabled={selectedAyahIndex === getAyahsForSelectedSurah().length - 1}
                        className="bg-emerald-500 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {selectedSurah.verses > getAyahsForSelectedSurah().length && (
                    <p className="text-center text-gray-500 mt-4 text-sm">
                      Only a few verses displayed for demonstration. Full Surah has {selectedSurah.verses} verses.
                    </p>
                  )}
                </>
              )}

              {currentView === 'mushaf' && (
                <div className="flex flex-col items-center justify-center p-4">
                  <p className="text-gray-600 text-center mb-4">
                    Displaying a simulated Mushaf page for {selectedSurah.name}.
                  </p>
                  <div className="border border-gray-300 shadow-lg rounded-lg overflow-hidden max-w-sm w-full">
                    <img
                      src={selectedSurah.mushafPage}
                      alt={`Mushaf page for ${selectedSurah.name}`}
                      className="w-full h-auto object-contain"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/700x1000/F8F8F8/000000?text=Mushaf+Page+Placeholder"; }}
                    />
                  </div>
                  <p className="text-gray-500 text-sm mt-4">
                    This is a placeholder image representing a Mushaf page. Actual Quran pages require extensive data.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20">
              <p className="text-lg">Select a Surah from the sidebar to view its verses.</p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

const DuasPage = ({ duas }) => {
  const categorizedDuas = duas.reduce((acc, dua) => {
    (acc[dua.category] = acc[dua.category] || []).push(dua);
    return acc;
  }, {});

  const [openCategories, setOpenCategories] = useState(
    Object.keys(categorizedDuas).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {})
  );

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="p-4 animate-fade-in">
      <div className="bg-white p-5 rounded-lg shadow-md mb-4">
        <h1 className="text-3xl font-extrabold text-emerald-700 mb-6 text-center">Collection of Duas</h1>

        {Object.entries(categorizedDuas).map(([category, duasInCategory]) => (
          <div key={category} className="mb-4 last:mb-0">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex justify-between items-center bg-emerald-600 text-white p-4 rounded-lg font-bold text-lg shadow-md hover:bg-emerald-700 transition-colors duration-200"
            >
              {category}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transform transition-transform duration-300 ${openCategories[category] ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategories[category] && (
              <div className="mt-2 space-y-3 p-3 bg-gray-50 rounded-lg shadow-inner">
                {duasInCategory.map((dua, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{dua.title}</h3>
                    <p className="text-gray-700 italic leading-relaxed mb-3">"{dua.text}"</p>
                    <button className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13m-6 2l-6-3-6 3V7l6-3 6 3v13z" />
                      </svg>
                      Listen Audio
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MorePage = ({ handleNavLinkClick }) => {
  const moreFeatures = [
    { name: "Donation", icon: "💰", path: "/donation" },
    { name: "Qibla Finder", icon: "🧭", path: "/qibla" },
    { name: "Tasbeeh Counter", icon: "📿", path: "/tasbeeh" },
    { name: "Hadith Collection", icon: "📜", path: "/hadith" },
    { name: "Zakat Calculator", icon: "🪙", path: "/zakat" },
    { name: "Islamic Calendar", icon: "🗓️", path: "/calendar" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
    { name: "About Us", icon: "ℹ️", path: "/about" },
    { name: "Language", icon: "🌐", path: "/language" },
  ];

  const handleFeatureClick = (path) => {
    if (path === "/donation") {
      alert("Navigating to Donation Page (Simulated)");
      setCurrentPage('/more/donation-subpage');
    } else {
      alert(`Navigating to ${path.replace('/', '').replace('-', ' ')} (Simulated)`);
    }
  };

  const [currentPage, setCurrentPage] = useState('/more');

  const DonationPage = () => (
    <div className="p-6 text-xl font-semibold text-gray-800 text-center pt-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-extrabold text-emerald-700 mb-4">Support Our Cause</h1>
      <p className="text-md text-gray-600 mb-6">Your generous donations help us continue our mission.</p>
      <div className="space-y-4 max-w-sm mx-auto">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200">
          Donate with Stripe (Simulated)
        </button>
        <button className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200">
          Bank Transfer Details (Simulated)
        </button>
      </div>
    </div>
  );


  return (
    <div className="p-4">
      {currentPage === '/more' && (
        <div className="bg-white p-5 rounded-lg shadow-md mb-4">
          <h1 className="text-3xl font-extrabold text-emerald-700 mb-6 text-center">More Features</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
            {moreFeatures.map((feature) => (
              <button
                key={feature.name}
                onClick={() => {
                  if (feature.path === "/donation") {
                    setCurrentPage('/more/donation-subpage');
                  } else {
                    alert(`Navigating to ${feature.name} (Simulated)`);
                  }
                }}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors duration-200 transform hover:scale-105"
              >
                <span className="text-4xl mb-2">{feature.icon}</span>
                <span className="text-md font-semibold text-gray-800">{feature.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {currentPage === '/more/donation-subpage' && (
        <>
          <DonationPage />
          <button
            onClick={() => setCurrentPage('/more')}
            className="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors block mx-auto"
          >
            Back to More Features
          </button>
        </>
      )}
    </div>
  );
};


export default App;
