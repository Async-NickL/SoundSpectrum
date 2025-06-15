'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Periodic Table Elements Map
const periodicElements = {
  'H': 'Hydrogen', 'He': 'Helium', 'Li': 'Lithium', 'Be': 'Beryllium', 'B': 'Boron', 
  'C': 'Carbon', 'N': 'Nitrogen', 'O': 'Oxygen', 'F': 'Fluorine', 'Ne': 'Neon',
  'Na': 'Sodium', 'Mg': 'Magnesium', 'Al': 'Aluminum', 'Si': 'Silicon', 'P': 'Phosphorus', 
  'S': 'Sulfur', 'Cl': 'Chlorine', 'Ar': 'Argon', 'K': 'Potassium', 'Ca': 'Calcium',
  'Sc': 'Scandium', 'Ti': 'Titanium', 'V': 'Vanadium', 'Cr': 'Chromium', 'Mn': 'Manganese', 
  'Fe': 'Iron', 'Co': 'Cobalt', 'Ni': 'Nickel', 'Cu': 'Copper', 'Zn': 'Zinc',
  'Ga': 'Gallium', 'Ge': 'Germanium', 'As': 'Arsenic', 'Se': 'Selenium', 'Br': 'Bromine', 
  'Kr': 'Krypton', 'Rb': 'Rubidium', 'Sr': 'Strontium', 'Y': 'Yttrium', 'Zr': 'Zirconium',
  'Nb': 'Niobium', 'Mo': 'Molybdenum', 'Tc': 'Technetium', 'Ru': 'Ruthenium', 'Rh': 'Rhodium', 
  'Pd': 'Palladium', 'Ag': 'Silver', 'Cd': 'Cadmium', 'In': 'Indium', 'Sn': 'Tin',
  'Sb': 'Antimony', 'Te': 'Tellurium', 'I': 'Iodine', 'Xe': 'Xenon', 'Cs': 'Cesium', 
  'Ba': 'Barium', 'La': 'Lanthanum', 'Ce': 'Cerium', 'Pr': 'Praseodymium', 'Nd': 'Neodymium',
  'Pm': 'Promethium', 'Sm': 'Samarium', 'Eu': 'Europium', 'Gd': 'Gadolinium', 'Tb': 'Terbium', 
  'Dy': 'Dysprosium', 'Ho': 'Holmium', 'Er': 'Erbium', 'Tm': 'Thulium', 'Yb': 'Ytterbium',
  'Lu': 'Lutetium', 'Hf': 'Hafnium', 'Ta': 'Tantalum', 'W': 'Tungsten', 'Re': 'Rhenium', 
  'Os': 'Osmium', 'Ir': 'Iridium', 'Pt': 'Platinum', 'Au': 'Gold', 'Hg': 'Mercury',
  'Tl': 'Thallium', 'Pb': 'Lead', 'Bi': 'Bismuth', 'Po': 'Polonium', 'At': 'Astatine', 
  'Rn': 'Radon', 'Fr': 'Francium', 'Ra': 'Radium', 'Ac': 'Actinium', 'Th': 'Thorium',
  'Pa': 'Protactinium', 'U': 'Uranium', 'Np': 'Neptunium', 'Pu': 'Plutonium', 'Am': 'Americium', 
  'Cm': 'Curium', 'Bk': 'Berkelium', 'Cf': 'Californium', 'Es': 'Einsteinium', 'Fm': 'Fermium',
  'Md': 'Mendelevium', 'No': 'Nobelium', 'Lr': 'Lawrencium'
};

// Mathematical symbols map
const mathSymbols = {
  'A': 'Alpha', 'E': 'Epsilon', 'G': 'Gamma', 'J': 'Joule', 'L': 'Lambda', 'M': 'Mu', 
  'Q': 'Theta', 'R': 'Rho', 'T': 'Tau', 'X': 'Chi', 'Z': 'Zeta', 'D': 'Delta',
  'Φ': 'Phi', 'Ψ': 'Psi', 'Ω': 'Omega', 'Π': 'Pi', 'Σ': 'Sigma', 'Θ': 'Theta',
  '∑': 'Sum', '∫': 'Integral', '∂': 'Partial', '∆': 'Delta', '∇': 'Nabla', '∞': 'Infinity',
  '±': 'Plus-Minus', '≈': 'Approximately', '≠': 'Not Equal', '≤': 'Less Equal', '≥': 'Greater Equal',
  '√': 'Square Root', '∝': 'Proportional', '∈': 'Element Of', '∉': 'Not Element Of', '⊂': 'Subset',
  '⊃': 'Superset', '∪': 'Union', '∩': 'Intersection', '∧': 'And', '∨': 'Or', '¬': 'Not',
  '⊕': 'XOR', '⊗': 'Tensor'
};

// Function to parse word into elements/symbols
const parseWordToElements = (word) => {
  const cleanWord = word.replace(/[^a-zA-Z]/g, '');
  const result = [];
  let i = 0;
  
  while (i < cleanWord.length) {
    let found = false;
    
    // Try 2-letter combination first
    if (i < cleanWord.length - 1) {
      const twoLetter = cleanWord.substring(i, i + 2);
      const capitalizedTwo = twoLetter.charAt(0).toUpperCase() + twoLetter.charAt(1).toLowerCase();
      
      if (periodicElements[capitalizedTwo]) {
        result.push({
          symbol: capitalizedTwo,
          name: periodicElements[capitalizedTwo],
          type: 'element'
        });
        i += 2;
        found = true;
      }
    }
    
    // If no 2-letter match, try single letter
    if (!found) {
      const singleLetter = cleanWord.charAt(i).toUpperCase();
      
      if (periodicElements[singleLetter]) {
        result.push({
          symbol: singleLetter,
          name: periodicElements[singleLetter],
          type: 'element'
        });
        i += 1;
        found = true;
      }
      // Check math symbols
      else if (mathSymbols[singleLetter]) {
        result.push({
          symbol: singleLetter,
          name: mathSymbols[singleLetter],
          type: 'math'
        });
        i += 1;
        found = true;
      }
      // Keep as original letter
      else {
        result.push({
          symbol: singleLetter,
          name: singleLetter,
          type: 'letter'
        });
        i += 1;
      }
    }
  }
  
  return result;
};

const Lyrics = ({ 
  lyricLine = "-", 
  animationDurationMs = 3000
}) => {
  const [displayedElements, setDisplayedElements] = useState([]);
  
  useEffect(() => {
    if (lyricLine) {
      const words = lyricLine.split(' ').filter(word => word.trim() !== '');
      const allElements = [];
      
      words.forEach((word, wordIndex) => {
        const elements = parseWordToElements(word);
        elements.forEach((element, elementIndex) => {
          allElements.push({
            ...element,
            id: `${wordIndex}-${elementIndex}`,
            wordIndex,
            originalWord: word
          });
        });
        
        // Add space between words
        if (wordIndex < words.length - 1) {
          allElements.push({
            symbol: '•',
            name: 'Space',
            type: 'separator',
            id: `sep-${wordIndex}`,
            wordIndex
          });
        }
      });
      
      setDisplayedElements(allElements);
    } else {
      setDisplayedElements([]);
    }
  }, [lyricLine]);

  const animationDuration = animationDurationMs / 1000; // Convert to seconds
  const staggerDelay = animationDuration / (displayedElements.length + 1);

  return (
    <div className="h-[calc(100vh-4rem)] p-4 md:p-8 flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl w-full h-full flex items-center">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <AnimatePresence mode="wait">
            {displayedElements.map((element, index) => (
              <motion.div
                key={`${lyricLine}-${element.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: {
                    delay: index * staggerDelay,
                    duration: 0.6,
                    ease: "easeOut"
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.9, 
                  y: -20,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="relative"
              >
                {element.type === 'separator' ? (
                  <div className="w-3 md:w-4 h-16 md:h-20 flex items-center justify-center">
                    <div className="text-white text-xl md:text-2xl opacity-30">•</div>
                  </div>
                ) : (
                  <div className="w-16 md:w-20 hover:bg-white/20 cursor-pointer h-16 md:h-20 border border-white bg-white/10 flex flex-col items-center justify-center transition-all duration-300 hover:border-gray-300">
                    <div className="text-white text-base md:text-lg font-extrabold mb-1">
                      {element.symbol}
                    </div>
                    <div className="text-white text-[10px] md:text-xs text-center px-1 leading-tight">
                      {element.name.length > 10 ? 
                        element.name.substring(0, 8) + '...' : 
                        element.name
                      }
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Lyrics;