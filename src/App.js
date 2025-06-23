import React, { useState, useEffect } from 'react';

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

  // Add Tailwind CSS CDN - THIS IS THE KEY ADDITION FOR UI/UX
  const tailwindScript = document.createElement('script');
  tailwindScript.src = 'https://cdn.tailwindcss.com';
  // Ensure it's added only once
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
        font-family: 'Amiri', serif; /* A common Arabic font, you might need to load it */
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

// Mock Data for the app
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
  { id: 1, url: "https://placehold.co/360x640/8BC34A/ffffff?text=Wallpaper+1", alt: "Islamic Wallpaper 1" }, // Vertical size
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
    bgImage: "https://placehold.co/600x600/4CAF50/ffffff?text=Quote+BG+1", // 1:1 aspect ratio
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
  { id: 1, name: "Al-Fatihah", english: "The Opening", verses: 7, arabic_name: "الفاتحة" },
  { id: 2, name: "Al-Baqarah", english: "The Cow", verses: 286, arabic_name: "البقرة" },
  { id: 3, name: "Al-Imran", english: "The Family of Imran", verses: 200, arabic_name: "آل عمران" },
  { id: 18, name: "Al-Kahf", english: "The Cave", verses: 110, arabic_name: "الكهف" },
  { id: 36, name: "Ya-Sin", english: "Ya-Sin", verses: 83, arabic_name: "يس" },
  { id: 55, name: "Ar-Rahman", english: "The Most Gracious", verses: 78, arabic_name: "الرحمن" },
  { id: 112, name: "Al-Ikhlas", english: "The Purity", verses: 4, arabic_name: "الإخلاص" },
  { id: 113, name: "Al-Falaq", english: "The Daybreak", verses: 5, arabic_name: "الفلق" },
  { id: 114, name: "An-Nas", english: "Mankind", verses: 6, arabic_name: "الناس" },
];

// Main App component
const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashStep, setSplashStep] = useState(0);
  // Removed showAuthScreen state as per user request
  const [currentPage, setCurrentPage] = useState('/'); // Current page after splash/auth

  // Splash screen images
  const splashImages = [
    "https://placehold.co/720x1280/10b981/ffffff?text=Welcome", // 16:9 for phone, adjust as needed
    "https://placehold.co/720x1280/059669/ffffff?text=Prayer+Times",
    "https://placehold.co/720x1280/047857/ffffff?text=Quran+%26+Duas",
    "https://placehold.co/720x1280/065F46/ffffff?text=Inspiration",
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
      // Directly go to home after splash, skipping auth screen
      setCurrentPage('/');
    }
  };

  const handleSkipSplash = () => {
    setShowSplash(false);
    // Directly go to home after splash, skipping auth screen
    setCurrentPage('/');
  };

  // Handler for navigation links
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
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Overlay for readability */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {/* No icon needed since background is an image */}
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
                onClick={handleNextSplash} // This will directly go to the main app
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

  // Removed if (showAuthScreen) block

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* Removed the header to make it seamless */}
      <main className="flex-grow pb-16"> {/* Add padding-bottom to account for fixed nav */}
        {renderPage(currentPage, handleNavLinkClick)}
      </main>

      {/* Fixed bottom navigation bar, mimicking default.vue layout */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg flex justify-around py-2 border-t border-gray-200 rounded-t-lg z-50">
        {/* NuxtLink simulation using simple buttons with styling */}
        <NavLink path="/" currentPage={currentPage} onClick={handleNavLinkClick} icon="🏠" label="Home" />
        <NavLink path="/prayer" currentPage={currentPage} onClick={handleNavLinkClick} icon="🕌" label="Prayer" />
        <NavLink path="/quran" currentPage={currentPage} onClick={handleNavLinkClick} icon="📖" label="Quran" />
        <NavLink path="/duas" currentPage={currentPage} onClick={handleNavLinkClick} icon="🤲" label="Duas" />
        <NavLink path="/more" currentPage={currentPage} onClick={handleNavLinkClick} icon="⚙️" label="More" />
      </nav>
    </div>
  );
};

// Helper component for navigation links
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

// Function to render the correct page component based on currentPage state
const renderPage = (currentPage, handleNavLinkClick) => {
  switch (currentPage) {
    case '/':
      return <HomePage prayerTimes={mockPrayerTimes} quranVerses={mockQuranVerses} videos={mockVideos} images={mockImages} quotes={mockQuotes} />;
    case '/prayer':
      return <PrayerPage prayerTimes={mockPrayerTimes} />;
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

// --- Page Components (mimicking pages/*.vue files) ---

const HomePage = ({ prayerTimes, quranVerses, videos, images, quotes }) => {
  // Use a single state for the currently displayed prayer to cycle through all
  const [displayedPrayerIndex, setDisplayedPrayerIndex] = useState(prayerTimes.findIndex(p => p.isCurrent));

  const handleNextPrayerDisplay = () => {
    setDisplayedPrayerIndex((prevIndex) => (prevIndex + 1) % prayerTimes.length);
  };
  const handlePrevPrayerDisplay = () => {
    setDisplayedPrayerIndex((prevIndex) => (prevIndex - 1 + prayerTimes.length) % prayerTimes.length);
  };

  const currentDisplayedPrayer = prayerTimes[displayedPrayerIndex];
  const nextPrayerInSequence = prayerTimes[(displayedPrayerIndex + 1) % prayerTimes.length];

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
    // In a real app, you would fetch the image and trigger a download.
    // For this preview, we just log and use a placeholder alert.
    alert(`Downloading image: ${imageUrl}`);
    // A more robust download (client-side) would involve:
    // fetch(imageUrl)
    //   .then(response => response.blob())
    //   .then(blob => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = imageUrl.split('/').pop() || 'wallpaper.png';
    //     document.body.appendChild(a);
    //     a.click();
    //     a.remove();
    //     window.URL.revokeObjectURL(url);
    //   })
    //   .catch(error => console.error('Download failed:', error));
  };

  const handleShareQuote = (quoteText) => {
    console.log(`Simulating share for: "${quoteText}"`);
    // In a real app, you would use Navigator Share API or similar.
    alert(`Sharing quote: "${quoteText}"`);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Welcome Banner - Top of the "seamless" app */}
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
          <p className="text-lg font-semibold text-gray-700">
            Current: <span className="text-emerald-700 font-bold text-xl">{currentDisplayedPrayer.name} ({currentDisplayedPrayer.time})</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Next: {nextPrayerInSequence.name} at {nextPrayerInSequence.time}
          </p>
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
        <div className="relative overflow-hidden rounded-lg aspect-vertical w-full max-w-sm mx-auto"> {/* Enforce vertical aspect ratio */}
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
        <div className="relative w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center"> {/* Enforce 1:1 aspect ratio */}
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

const PrayerPage = ({ prayerTimes }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
      <div className="bg-white p-5 rounded-lg shadow-md text-center mb-4">
        <h1 className="text-3xl font-extrabold text-emerald-700 mb-2">Prayer Times</h1>
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
        {/* Changed to a single column flow for "line by line" presentation */}
        <div className="flex flex-col gap-3 mt-6">
          {prayerTimes.map((prayer) => (
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
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-4">Times are estimates for demonstration purposes.</p>
      </div>
    </div>
  );
};

const QuranPage = ({ surahs }) => {
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
  const [selectedAyahIndex, setSelectedAyahIndex] = useState(getSavedProgress().ayahIndex); // Store index for easier array access

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
  };

  // Simplified mock Ayahs for demonstration, to fit in a reasonable size
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
    // Add more mock Ayahs for other surahs as needed for a more complete simulation
    2: [ // Al-Baqarah (first few for example)
      { arabic: "الم", english: "Alif, Lam, Meem." },
      { arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", english: "This is the Book about which there is no doubt, a guidance for those conscious of Allah -" },
      { arabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", english: "Who believe in the unseen, establish prayer, and spend from what We have provided for them," },
    ]
  };

  // Helper to get ayah content for the selected surah
  const getAyahsForSelectedSurah = () => {
    if (!selectedSurah) return [];
    return mockAyahContent[selectedSurah.id] || [];
  };

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4 animate-fade-in">
      <div className="lg:w-1/3 bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-140px)] overflow-y-auto">
        <h2 className="text-xl font-bold text-emerald-700 mb-4 text-center">Surahs</h2>
        <ul className="space-y-2">
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

      <div className="lg:w-2/3 bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-140px)] overflow-y-auto relative">
        {selectedSurah ? (
          <div>
            <h2 className="text-2xl font-bold text-center text-emerald-700 mb-4 py-2 border-b border-gray-200">
              {selectedSurah.name} <span className="text-lg text-gray-600">({selectedSurah.english})</span>
            </h2>
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
            {/* Navigation for ayahs */}
            {selectedSurah && getAyahsForSelectedSurah().length > 0 && (
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
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            <p className="text-lg">Select a Surah from the left to view its verses.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DuasPage = ({ duas }) => {
  // Group duas by category
  const categorizedDuas = duas.reduce((acc, dua) => {
    (acc[dua.category] = acc[dua.category] || []).push(dua);
    return acc;
  }, {});

  // State to manage which categories are open/collapsed
  // Initialize all categories as open by default for visibility in preview
  const [openCategories, setOpenCategories] = useState(
    Object.keys(categorizedDuas).reduce((acc, category) => {
      acc[category] = true; // All open by default
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
      // Direct render for Donation within More page for simplicity
      // In a real app, you might have a dedicated component or modal
      alert("Navigating to Donation Page (Simulated)");
      // For this simulation, we'll just show the DonationPage directly within More
      // You would typically render a dedicated component here
      setCurrentPage('/more/donation-subpage'); // A unique path to trigger sub-content
    } else {
      alert(`Navigating to ${path.replace('/', '').replace('-', ' ')} (Simulated)`);
    }
  };

  // State to handle potential sub-navigation within More page
  const [currentPage, setCurrentPage] = useState('/more'); // Added this useState to manage sub-page within More.

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
      {/* Conditionally render main More grid or sub-page content */}
      {currentPage === '/more' && (
        <div className="bg-white p-5 rounded-lg shadow-md mb-4">
          <h1 className="text-3xl font-extrabold text-emerald-700 mb-6 text-center">More Features</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
            {moreFeatures.map((feature) => (
              <button
                key={feature.name}
                onClick={() => {
                  if (feature.path === "/donation") {
                    setCurrentPage('/more/donation-subpage'); // Change state to show DonationPage
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
      {/* Render DonationPage directly if path matches */}
      {currentPage === '/more/donation-subpage' && (
        <>
          <DonationPage />
          <button
            onClick={() => setCurrentPage('/more')} // Go back to the main More page
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
