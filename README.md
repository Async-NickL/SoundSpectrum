# SoundSpectrum 🎵

A unique Next.js application that transforms music lyrics into scientific visualizations using periodic table elements and mathematical symbols. Experience your favorite songs in a whole new way - through the lens of chemistry and mathematics!

## Core Concept 🧪

SoundSpectrum takes your favorite songs and transforms them into an educational and visually stunning experience by:
- Converting lyrics into periodic table elements
- Using mathematical symbols as fallback
- Synchronizing the transformed lyrics with music playback
- Creating a unique blend of music, chemistry, and mathematics

### Example Transformation
```
Original: "Hello world"
Becomes: "He-Li-O W-O-Rn-Ld"
(Helium, Lithium, Oxygen, Tungsten, Oxygen, Roentgenium, etc.)
```

## Features ✨

- **Music Search**: Search and play any song instantly
- **Scientific Transformation**: Automatic conversion of lyrics to chemical elements
- **Mathematical Fallback**: Smart system that uses mathematical symbols when elements aren't available
- **Real-time Synchronization**: Perfectly timed display of transformed lyrics with music
- **Interactive Learning**: Learn about chemical elements while enjoying music
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark Mode**: Eye-friendly dark theme by default

## Tech Stack 🛠

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **API Integration**: YouTube V3 API
- **State Management**: React Hooks
- **UI Components**: Aceternity UI

## Getting Started 🚀

1. Clone the repository:
```bash
git clone https://github.com/Async-NickL/SoundSpectrum.git
cd SoundSpectrum
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your YouTube API key:
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure 📁

```
SoundSpectrum/
├── app/
│   ├── components/     # Reusable UI components
│   ├── search/        # Search functionality
│   ├── layout.js      # Root layout
│   └── page.js        # Home page
├── public/            # Static assets
└── styles/           # Global styles
```

## How It Works 🔬

1. **Input**: User searches for a song
2. **Music Retrieval**: App fetches and plays the selected song
3. **Lyrics Processing**: Timestamped lyrics are retrieved
4. **Elemental Transformation**: Each word is converted to periodic table elements
5. **Fallback System**: Mathematical symbols are used when elements aren't available
6. **Synchronized Display**: Transformed lyrics appear in real-time with the music

## Acknowledgments 🙏

- YouTube V3 API for music search functionality
- [LRCLIB](https://lrclib.net/) for lyrics data
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- [Aceternity UI](https://ui.aceternity.com/) for ui components

## Contact 📧

Nikhil Kole - [LinkedIn](https://www.linkedin.com/in/nikhil-kole/)