import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { InteractiveGame as GameType } from '../types';
import Card from './common/Card';
import Button from './common/Button';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

interface InteractiveGameProps {
  game: GameType;
  onComplete: () => void;
}

const MatchGame: React.FC<InteractiveGameProps> = ({ game, onComplete }) => {
  const [terms, setTerms] = useState<string[]>([]);
  const [definitions, setDefinitions] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [correctMatches, setCorrectMatches] = useState<Set<string>>(new Set());
  const [incorrectMatch, setIncorrectMatch] = useState<{ term: string; def: string } | null>(null);
  
  const originalPairs = useMemo(() => game.pairs || [], [game.pairs]);

  useEffect(() => {
    if (originalPairs.length > 0) {
      setTerms(shuffleArray(originalPairs.map(p => p.term)));
      setDefinitions(shuffleArray(originalPairs.map(p => p.definition)));
      setCorrectMatches(new Set());
      setSelectedTerm(null);
      setSelectedDefinition(null);
      setIncorrectMatch(null);
    }
  }, [originalPairs]);
  
  const allMatched = useMemo(() => correctMatches.size === originalPairs.length, [correctMatches, originalPairs]);

  useEffect(() => {
    if (allMatched && originalPairs.length > 0) {
      onComplete();
    }
  }, [allMatched, originalPairs.length, onComplete]);

  const handleTermClick = (term: string) => {
    setSelectedTerm(term);
    checkMatch(term, selectedDefinition);
  };
  
  const handleDefinitionClick = (definition: string) => {
    setSelectedDefinition(definition);
    checkMatch(selectedTerm, definition);
  };

  const checkMatch = (term: string | null, definition: string | null) => {
    if (term && definition) {
      const correctDefinition = originalPairs.find(p => p.term === term)?.definition;
      if (correctDefinition === definition) {
        setCorrectMatches(prev => new Set(prev).add(term));
      } else {
        setIncorrectMatch({ term, def: definition });
        setTimeout(() => setIncorrectMatch(null), 1000);
      }
      setSelectedTerm(null);
      setSelectedDefinition(null);
    }
  };
  
  if (!game.pairs) return null;

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
      <p className="text-gray-600 mb-4">{game.instruction}</p>
      {allMatched ? (
        <div className="text-center p-6 bg-green-100 rounded-lg">
          <h4 className="text-xl font-bold text-green-700">¡Excelente!</h4>
          <p className="text-green-600">Has relacionado todos los conceptos correctamente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {terms.map(term => {
              const isMatched = correctMatches.has(term);
              const isSelected = selectedTerm === term;
              const isIncorrect = incorrectMatch?.term === term;
              return (
                <button
                  key={term}
                  onClick={() => handleTermClick(term)}
                  disabled={isMatched}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200
                    ${isMatched 
                      ? 'bg-green-100 border-green-300 text-green-700 line-through' 
                      : 'bg-white border-gray-300 text-gray-800 hover:bg-orange-50 hover:border-orange-300'
                    }
                    ${isSelected ? 'bg-orange-200 border-orange-400 text-orange-800 font-semibold ring-2 ring-orange-300' : ''}
                    ${isIncorrect ? '!bg-red-100 !border-red-400 !text-red-800 animate-pulse' : ''}
                  `}
                >
                  {term}
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            {definitions.map(def => {
              const isMatched = originalPairs.some(p => p.definition === def && correctMatches.has(p.term));
              const isSelected = selectedDefinition === def;
              const isIncorrect = incorrectMatch?.def === def;
              return (
                <button
                  key={def}
                  onClick={() => handleDefinitionClick(def)}
                  disabled={isMatched}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 
                    ${isMatched 
                      ? 'bg-green-100 border-green-300 text-green-700 line-through' 
                      : 'bg-white border-gray-300 text-gray-800 hover:bg-orange-50 hover:border-orange-300'
                    }
                    ${isSelected ? 'bg-orange-200 border-orange-400 text-orange-800 font-semibold ring-2 ring-orange-300' : ''}
                    ${isIncorrect ? '!bg-red-100 !border-red-400 !text-red-800 animate-pulse' : ''}
                  `}
                >
                  {def}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  )
}

const DragDropGame: React.FC<InteractiveGameProps> = ({ game, onComplete }) => {
  const [items, setItems] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'incorrect'>('playing');
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const originalItems = useMemo(() => game.items || [], [game.items]);

  useEffect(() => {
    if (originalItems.length > 0) {
      setItems(shuffleArray(originalItems));
      setGameState('playing');
    }
  }, [originalItems]);
  
  useEffect(() => {
    if (gameState === 'correct') {
      onComplete();
    }
  }, [gameState, onComplete]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedItemIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems);
    setDraggedItemIndex(null);
  };

  const checkOrder = () => {
    const isCorrect = items.every((item, index) => item === originalItems[index]);
    setGameState(isCorrect ? 'correct' : 'incorrect');
  };

  const resetGame = () => {
    setItems(shuffleArray(originalItems));
    setGameState('playing');
  };

  if (!game.items) return null;
  
  return (
    <Card>
      <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
      <p className="text-gray-600 mb-4">{game.instruction}</p>

      {gameState === 'correct' ? (
        <div className="text-center p-6 bg-green-100 rounded-lg">
          <h4 className="text-xl font-bold text-green-700">¡Correcto!</h4>
          <p className="text-green-600">Has ordenado las fases correctamente.</p>
          <Button onClick={resetGame} variant="secondary" className="mt-4">Jugar de Nuevo</Button>
        </div>
      ) : (
        <>
          <div className="space-y-2 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px]">
            {items.map((item, index) => (
              <div
                key={item}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`p-3 rounded-lg cursor-grab active:cursor-grabbing border-2 flex items-center transition-shadow shadow-sm hover:shadow-md ${draggedItemIndex === index ? 'opacity-50' : 'bg-blue-100 text-blue-800 border-blue-200'}`}
              >
                <span className="text-blue-500 font-bold mr-3">{index + 1}.</span>
                {item}
              </div>
            ))}
          </div>
          {gameState === 'incorrect' && (
            <div className="mt-4 text-center p-3 bg-red-100 rounded-lg text-red-700 font-semibold">
              Orden incorrecto. ¡Inténtalo de nuevo!
            </div>
          )}
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={resetGame} variant="secondary">Reiniciar</Button>
            <Button onClick={checkOrder}>Verificar Orden</Button>
          </div>
        </>
      )}
    </Card>
  );
}

const MemoryGame: React.FC<InteractiveGameProps> = ({ game, onComplete }) => {
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [cards, setCards] = useState<string[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    
    const memorySets = useMemo(() => game.memorySets || [], [game.memorySets]);
    const currentSet = memorySets[currentSetIndex];

    useEffect(() => {
        if (currentSet) {
            const pairs = currentSet.pairs;
            const terms = pairs.map(p => p.term);
            const definitions = pairs.map(p => p.definition);
            setCards(shuffleArray([...terms, ...definitions]));
            setFlippedIndices([]);
            setMatchedPairs([]);
            setIsChecking(false);
        }
    }, [currentSet]);
    
    const isSetCompleted = useMemo(() => matchedPairs.length > 0 && matchedPairs.length === cards.length, [matchedPairs, cards]);
    const allSetsCompleted = useMemo(() => isSetCompleted && currentSetIndex === memorySets.length - 1, [isSetCompleted, currentSetIndex, memorySets]);

    useEffect(() => {
      if (allSetsCompleted) {
        onComplete();
      }
    }, [allSetsCompleted, onComplete]);
    
    const findPairForCard = (cardValue: string): string => {
        const pair = currentSet.pairs.find(p => p.term === cardValue);
        if (pair) return pair.definition;
        const pairDef = currentSet.pairs.find(p => p.definition === cardValue);
        if (pairDef) return pairDef.term;
        return '';
    };

    const handleCardClick = (index: number) => {
        if (isChecking || flippedIndices.length >= 2 || flippedIndices.includes(index) || matchedPairs.includes(cards[index])) {
            return;
        }

        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        if (newFlippedIndices.length === 2) {
            setIsChecking(true);
            const [firstIndex, secondIndex] = newFlippedIndices;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            const correctPair = findPairForCard(firstCard);
            if (correctPair === secondCard) {
                setTimeout(() => {
                    setMatchedPairs(prev => [...prev, firstCard, secondCard]);
                    setFlippedIndices([]);
                    setIsChecking(false);
                }, 800);
            } else {
                setTimeout(() => {
                    setFlippedIndices([]);
                    setIsChecking(false);
                }, 1500);
            }
        }
    };

    const goToNextSet = () => {
        if (currentSetIndex < memorySets.length - 1) {
            setCurrentSetIndex(prev => prev + 1);
        }
    };
    
    const resetGame = () => {
        setCurrentSetIndex(0);
    };

    if (!currentSet) return null;

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
            <p className="text-gray-600 mb-4">{game.instruction}</p>

            <div className="mb-4 p-2 bg-gray-100 rounded-md">
                <h4 className="font-bold text-center text-blue-700">{currentSet.title}</h4>
            </div>

            {allSetsCompleted ? (
                <div className="text-center p-6 bg-green-100 rounded-lg">
                    <h4 className="text-xl font-bold text-green-700">¡Juego Completado!</h4>
                    <p className="text-green-600">Has superado todos los ejercicios de memoria. ¡Gran trabajo!</p>
                    <Button onClick={resetGame} variant="secondary" className="mt-4">Jugar de Nuevo</Button>
                </div>
            ) : isSetCompleted ? (
                 <div className="text-center p-6 bg-blue-100 rounded-lg">
                    <h4 className="text-xl font-bold text-blue-700">¡Ejercicio Completado!</h4>
                    <p className="text-blue-600">Has encontrado todos los pares.</p>
                    <Button onClick={goToNextSet} className="mt-4">Siguiente Ejercicio</Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {cards.map((card, index) => {
                        const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card);
                        const isMatched = matchedPairs.includes(card);
                        return (
                            <div
                                key={index}
                                onClick={() => handleCardClick(index)}
                                className="h-36 sm:h-40 rounded-lg cursor-pointer perspective-1000"
                            >
                                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                    {/* Back of the card (visible initially) */}
                                    <div className="absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white text-4xl font-bold">
                                        ?
                                    </div>
                                    {/* Front of the card (visible after flip) */}
                                    <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-lg flex items-center justify-center text-center p-2 text-sm font-semibold
                                        ${isMatched ? 'bg-green-200 border-2 border-green-400 text-green-800' : 'bg-orange-100 border-2 border-orange-300 text-orange-800'}
                                    `}>
                                        {card}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
            `}</style>
        </Card>
    )
};

const WordSearchGame: React.FC<InteractiveGameProps> = ({ game, onComplete }) => {
    const [grid, setGrid] = useState<string[][]>([]);
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [selection, setSelection] = useState<{ r: number, c: number }[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    
    const words = useMemo(() => (game.words || []).map(w => w.toUpperCase().replace(/\s/g, '')), [game.words]);
    const GRID_SIZE = 15;
    const placedWords = useRef<Map<string, { r: number, c: number }[]>>(new Map());
    
    const allFound = useMemo(() => foundWords.size === words.length, [foundWords, words]);

    useEffect(() => {
        if (allFound && words.length > 0) {
            onComplete();
        }
    }, [allFound, words.length, onComplete]);

    const generateGrid = useCallback(() => {
        const newGrid: (string | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        placedWords.current.clear();
        
        const directions = [
            { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, // Right, Down, Diag-Down-Right
            { r: 0, c: -1 }, { r: -1, c: 0 }, { r: -1, c: -1 }, // Left, Up, Diag-Up-Left
            { r: 1, c: -1 }, { r: -1, c: 1 } // Diag-Down-Left, Diag-Up-Right
        ];

        words.forEach(word => {
            let placed = false;
            for (let i = 0; i < 100 && !placed; i++) { // 100 attempts to place a word
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const startR = Math.floor(Math.random() * GRID_SIZE);
                const startC = Math.floor(Math.random() * GRID_SIZE);

                const endR = startR + (word.length - 1) * dir.r;
                const endC = startC + (word.length - 1) * dir.c;

                if (endR >= 0 && endR < GRID_SIZE && endC >= 0 && endC < GRID_SIZE) {
                    let canPlace = true;
                    const wordPath = [];
                    for (let j = 0; j < word.length; j++) {
                        const r = startR + j * dir.r;
                        const c = startC + j * dir.c;
                        wordPath.push({ r, c });
                        if (newGrid[r][c] && newGrid[r][c] !== word[j]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let j = 0; j < word.length; j++) {
                            const r = startR + j * dir.r;
                            const c = startC + j * dir.c;
                            newGrid[r][c] = word[j];
                        }
                        placedWords.current.set(word, wordPath);
                        placed = true;
                    }
                }
            }
        });
        
        const finalGrid = newGrid.map(row => row.map(cell => cell || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]));
        setGrid(finalGrid);
        setFoundWords(new Set());
    }, [words]);

    useEffect(() => {
        generateGrid();
    }, [generateGrid]);

    const getLine = (start: {r: number, c: number}, end: {r: number, c: number}) => {
        const line: {r: number, c: number}[] = [];
        const dr = Math.sign(end.r - start.r);
        const dc = Math.sign(end.c - start.c);
        
        if (dr === 0 && dc === 0) return [start];
        if (dr !== 0 && dc !== 0 && Math.abs(end.r-start.r) !== Math.abs(end.c-start.c)) return [start]; // Not a straight line, revert to start

        let {r, c} = start;
        while(r !== end.r + dr || c !== end.c + dc) {
            line.push({r, c});
            if(r === end.r && c === end.c) break;
            r += dr;
            c += dc;
        }
        return line;
    }
    
    const handleMouseDown = (r: number, c: number) => {
        setIsSelecting(true);
        setSelection([{r, c}]);
    };
    
    const handleMouseEnter = (r: number, c: number) => {
        if (!isSelecting) return;
        setSelection(prev => getLine(prev[0], {r, c}));
    };
    
    const handleMouseUp = () => {
        if (!isSelecting) return;
        
        const selectedWord = selection.map(({r, c}) => grid[r][c]).join('');
        const reversedSelectedWord = selectedWord.split('').reverse().join('');
        
        const wordToFind = words.find(w => w === selectedWord || w === reversedSelectedWord);

        if (wordToFind && !foundWords.has(wordToFind)) {
            setFoundWords(prev => new Set(prev).add(wordToFind));
        }

        setIsSelecting(false);
        setSelection([]);
    };
    
    const isCellSelected = (r: number, c: number) => selection.some(sel => sel.r === r && sel.c === c);
    const isCellFound = (r: number, c: number) => {
        for (const word of foundWords) {
            if (placedWords.current.get(word)?.some(pos => pos.r === r && pos.c === c)) {
                return true;
            }
        }
        return false;
    }

    if (grid.length === 0) return <div>Cargando sopa de letras...</div>;

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
            <p className="text-gray-600 mb-4">{game.instruction}</p>

            {allFound ? (
                 <div className="text-center p-6 bg-green-100 rounded-lg">
                    <h4 className="text-xl font-bold text-green-700">¡Felicidades!</h4>
                    <p className="text-green-600">Has encontrado todas las palabras.</p>
                    <Button onClick={generateGrid} variant="secondary" className="mt-4">Jugar de Nuevo</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    <div className="md:col-span-2 bg-blue-50 p-2 rounded-lg aspect-square select-none">
                        <div className={`grid grid-cols-15 gap-1`}>
                            {grid.map((row, r) => 
                                row.map((cell, c) => (
                                    <div 
                                        key={`${r}-${c}`}
                                        onMouseDown={() => handleMouseDown(r, c)}
                                        onMouseEnter={() => handleMouseEnter(r, c)}
                                        className={`w-full aspect-square flex items-center justify-center font-bold text-sm sm:text-base rounded-md transition-colors duration-150
                                            ${isCellSelected(r, c) ? 'bg-orange-400 text-white' : 
                                            isCellFound(r, c) ? 'bg-green-400 text-white' : 
                                            'bg-white text-gray-700 hover:bg-orange-200'}`}
                                    >
                                        {cell}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-gray-800 border-b pb-2">Palabras a buscar:</h4>
                        <ul className="space-y-1">
                            {words.map(word => (
                                <li key={word} className={`text-gray-600 font-medium transition-all duration-300 ${foundWords.has(word) ? 'line-through text-green-600' : ''}`}>
                                    {word.charAt(0) + word.slice(1).toLowerCase()}
                                </li>
                            ))}
                        </ul>
                         <Button onClick={generateGrid} variant="secondary" className="mt-4 w-full">Reiniciar</Button>
                    </div>
                </div>
            )}
             <style>{`.grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); }`}</style>
        </Card>
    );
};

const EscapeRoomGame: React.FC<InteractiveGameProps> = ({ game, onComplete }) => {
    const [gameState, setGameState] = useState<'intro' | 'puzzles' | 'escaped'>('intro');
    const [solvedPuzzles, setSolvedPuzzles] = useState<Set<number>>(new Set());
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [code, setCode] = useState(['', '', '', '']);
    const [feedback, setFeedback] = useState('');
    const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const puzzles = useMemo(() => game.escapeRoomPuzzles || [], [game.escapeRoomPuzzles]);
    const solution = useMemo(() => game.escapeRoomSolution || '', [game.escapeRoomSolution]);

    useEffect(() => {
        if (gameState === 'escaped') {
            onComplete();
        }
    }, [gameState, onComplete]);

    if (puzzles.length === 0 || !solution) return null;

    const handlePuzzleAnswer = (puzzleId: number, selectedOptionId: number) => {
        setSelectedAnswers(prev => ({ ...prev, [puzzleId]: selectedOptionId }));
        const puzzle = puzzles.find(p => p.id === puzzleId);
        if (puzzle && puzzle.correctOptionId === selectedOptionId) {
            setSolvedPuzzles(prev => new Set(prev).add(puzzleId));
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newCode = [...code];
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === '') {
            newCode[index] = value;
            setCode(newCode);
            // Move to next input
            if (value !== '' && index < code.length - 1) {
                codeInputsRef.current[index + 1]?.focus();
            }
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && code[index] === '' && index > 0) {
            codeInputsRef.current[index - 1]?.focus();
        }
    };

    const checkFinalCode = () => {
        const enteredCode = code.join('');
        if (enteredCode === solution) {
            setGameState('escaped');
        } else {
            setFeedback('Código incorrecto. ¡Sigue intentando!');
            setTimeout(() => setFeedback(''), 2000);
        }
    };

    if (gameState === 'intro') {
        return (
            <Card className="text-center">
                 <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                 <p className="text-gray-600 my-4">{game.instruction}</p>
                 <Button onClick={() => setGameState('puzzles')}>Comenzar el Desafío</Button>
            </Card>
        );
    }
    
    if (gameState === 'escaped') {
         return (
            <Card className="text-center bg-green-50 border-t-4 border-green-500">
                 <h3 className="text-2xl font-bold text-green-700">¡Has Escapado!</h3>
                 <p className="text-gray-700 my-4">¡Felicidades! Usaste tu conocimiento sobre las herramientas SARLAFT para resolver los acertijos y encontrar la salida. Has demostrado ser un analista muy capaz.</p>
                 <Button onClick={() => {
                     setGameState('intro');
                     setSolvedPuzzles(new Set());
                     setSelectedAnswers({});
                     setCode(['', '', '', '']);
                 }} variant="secondary">Jugar de Nuevo</Button>
            </Card>
        );
    }

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
            <p className="text-gray-600 mb-6">Resuelve cada acertijo. Las respuestas correctas revelarán los dígitos del código de escape.</p>
            
            <div className="space-y-6">
                {puzzles.map(puzzle => {
                    const isSolved = solvedPuzzles.has(puzzle.id);
                    const selected = selectedAnswers[puzzle.id];
                    return (
                        <div key={puzzle.id} className={`p-4 rounded-lg border-2 transition-all ${isSolved ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                            <h4 className="font-bold text-gray-800">{puzzle.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 mb-3">{puzzle.prompt}</p>
                            <div className="space-y-2">
                                {puzzle.options.map(option => {
                                    const isSelected = selected === option.id;
                                    const isCorrect = isSolved && isSelected;
                                    const isIncorrect = !isSolved && isSelected;
                                    return (
                                        <button 
                                            key={option.id}
                                            onClick={() => handlePuzzleAnswer(puzzle.id, option.id)}
                                            disabled={isSolved}
                                            className={`w-full text-left p-2 rounded-md border text-sm transition-colors disabled:cursor-not-allowed
                                                ${isCorrect ? 'bg-green-200 border-green-400 font-semibold text-green-800' : ''}
                                                ${isIncorrect ? 'bg-red-200 border-red-400 font-semibold text-red-800' : ''}
                                                ${!isSelected ? 'bg-white hover:bg-orange-50 border-gray-300 text-gray-800' : ''}
                                            `}
                                        >
                                            {option.text}
                                        </button>
                                    );
                                })}
                            </div>
                            {isSolved && (
                                <div className="mt-3 p-2 bg-green-200 text-green-800 font-bold rounded-md text-center">
                                    {puzzle.solutionHint}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-300 text-center">
                <h4 className="text-lg font-bold">Introduce el Código de Escape</h4>
                <div className="flex justify-center gap-2 sm:gap-4 my-4">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { if (el) codeInputsRef.current[index] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleCodeChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-14 sm:w-16 sm:h-20 text-center text-3xl sm:text-4xl font-bold rounded-md border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                    ))}
                </div>
                {feedback && <p className="text-red-600 font-semibold mb-2">{feedback}</p>}
                <Button onClick={checkFinalCode} disabled={solvedPuzzles.size < puzzles.length}>
                    Intentar Escapar
                </Button>
            </div>
        </Card>
    );
};

const CrosswordGame: React.FC<InteractiveGameProps> = ({ game, onComplete }) => {
    const puzzles = useMemo(() => game.crosswordPuzzles || [], [game.crosswordPuzzles]);
    const inputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());

    const { width, height, cellMap, puzzleStartCells } = useMemo(() => {
        let w = 0;
        let h = 0;
        type CellData = { puzzles: { id: number; direction: 'across' | 'down' }[]; answer: string; number?: number };
        const map = new Map<string, CellData>();
        const psc = new Map<number, {x: number, y: number}>();

        puzzles.forEach(p => {
            psc.set(p.id, p.position);
            for (let i = 0; i < p.answer.length; i++) {
                const x = p.position.x + (p.direction === 'across' ? i : 0);
                const y = p.position.y + (p.direction === 'down' ? i : 0);
                
                w = Math.max(w, x + 1);
                h = Math.max(h, y + 1);

                const key = `${y}-${x}`;
                
                // Get or create cell data
                let cellData = map.get(key);
                if (!cellData) {
                    cellData = {
                        puzzles: [],
                        answer: p.answer[i],
                    };
                    map.set(key, cellData);
                }
                
                // Add puzzle info to the cell
                cellData.puzzles.push({ id: p.id, direction: p.direction });
                
                // Set cell number if it's the start of a word
                if (i === 0) {
                    // This could overwrite if two words start at the same cell, which is a flaw in crossword design but we handle it.
                    cellData.number = p.id;
                }
            }
        });
        return { width: w, height: h, cellMap: map, puzzleStartCells: psc };
    }, [puzzles]);
    
    const [userInput, setUserInput] = useState<Record<string, string>>({});
    const [activeCell, setActiveCell] = useState<{ x: number; y: number } | null>(null);
    const [activeDirection, setActiveDirection] = useState<'across' | 'down'>('across');
    const [isSolved, setIsSolved] = useState(false);
    const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});

    useEffect(() => {
        if (isSolved) {
            onComplete();
        }
    }, [isSolved, onComplete]);

    const activePuzzle = useMemo(() => {
        if (!activeCell) return null;
        const cellData = cellMap.get(`${activeCell.y}-${activeCell.x}`);
        if (!cellData) return null;

        const puzzleInfo = cellData.puzzles.find(p => p.direction === activeDirection) || cellData.puzzles[0];
        if (!puzzleInfo) return null;
        return puzzles.find(p => p.id === puzzleInfo.id);
    }, [activeCell, activeDirection, puzzles, cellMap]);

    const handleCellClick = (x: number, y: number) => {
        const key = `${y}-${x}`;
        if (!cellMap.has(key)) return;

        if (activeCell?.x === x && activeCell?.y === y) {
            const cellData = cellMap.get(key)!;
            if (cellData.puzzles.length > 1) {
                const newDirection = activeDirection === 'across' ? 'down' : 'across';
                if (cellData.puzzles.some(p => p.direction === newDirection)) {
                    setActiveDirection(newDirection);
                }
            }
        } else {
            setActiveCell({ x, y });
            const cellData = cellMap.get(key)!;
            if (!cellData.puzzles.some(p => p.direction === activeDirection)) {
                setActiveDirection(cellData.puzzles[0].direction);
            }
        }
        inputRefs.current.get(key)?.focus();
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, x: number, y: number) => {
        const value = e.target.value.toUpperCase().slice(-1);
        setUserInput(prev => ({ ...prev, [`${y}-${x}`]: value }));

        if (value && activePuzzle) {
            let nextX = x;
            let nextY = y;
            if (activeDirection === 'across') {
                nextX = x + 1;
            } else {
                nextY = y + 1;
            }
            const nextKey = `${nextY}-${nextX}`;
            if(cellMap.has(nextKey)) {
                inputRefs.current.get(nextKey)?.focus();
                setActiveCell({ x: nextX, y: nextY });
            }
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, x: number, y: number) => {
        let nextX = x;
        let nextY = y;
        let moved = false;
        
        switch (e.key) {
            case 'ArrowRight': nextX++; moved = true; break;
            case 'ArrowLeft': nextX--; moved = true; break;
            case 'ArrowDown': nextY++; moved = true; break;
            case 'ArrowUp': nextY--; moved = true; break;
            case 'Backspace':
                if (!userInput[`${y}-${x}`] || userInput[`${y}-${x}`] === '') {
                    if (activeDirection === 'across') nextX--;
                    else nextY--;
                    moved = true;
                }
                break;
            default: return;
        }
        
        if (moved) {
            const nextKey = `${nextY}-${nextX}`;
            if (cellMap.has(nextKey)) {
                 e.preventDefault();
                 inputRefs.current.get(nextKey)?.focus();
                 handleCellClick(nextX, nextY);
            }
        }
    };

    const checkAnswers = () => {
        const newFeedback: Record<string, 'correct' | 'incorrect'> = {};
        let allCorrect = true;
        for (const [key, cellData] of cellMap.entries()) {
            if (userInput[key] && userInput[key] === cellData.answer) {
                newFeedback[key] = 'correct';
            } else {
                newFeedback[key] = 'incorrect';
                allCorrect = false;
            }
        }
        setFeedback(newFeedback);
        if (allCorrect) {
            setIsSolved(true);
        }
    };

    const resetGame = () => {
        setUserInput({});
        setFeedback({});
        setIsSolved(false);
        setActiveCell(null);
    }
    
    if (isSolved) {
        return (
            <Card>
                <div className="text-center p-6 bg-green-100 rounded-lg">
                    <h4 className="text-xl font-bold text-green-700">¡Crucigrama Completado!</h4>
                    <p className="text-green-600">¡Excelente! Has demostrado tu conocimiento de la Debida Diligencia.</p>
                    <Button onClick={resetGame} variant="secondary" className="mt-4">Jugar de Nuevo</Button>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
            <p className="text-gray-600 mb-4">{game.instruction}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="overflow-auto">
                    <div className="grid gap-px bg-slate-400 w-max p-1 rounded-md" style={{ gridTemplateColumns: `repeat(${width}, 2rem)` }}>
                        {Array.from({ length: height }).map((_, y) => 
                            Array.from({ length: width }).map((_, x) => {
                                const key = `${y}-${x}`;
                                const cellData = cellMap.get(key);
                                if (!cellData) {
                                    return <div key={key} className="w-8 h-8 bg-slate-200" />;
                                }
                                
                                const isActive = activePuzzle && cellData.puzzles.some(p => p.id === activePuzzle.id && p.direction === activeDirection);
                                const fb = feedback[key];

                                return (
                                    <div key={key} className="relative w-8 h-8 bg-white">
                                        {cellData.number && <span className="absolute top-0 left-0.5 text-[0.6rem] font-bold text-slate-500">{cellData.number}</span>}
                                        <input
                                            // FIX: The ref callback should not return a value. Wrapped in braces to fix the type error.
                                            ref={ref => { inputRefs.current.set(key, ref); }}
                                            type="text"
                                            maxLength={1}
                                            onClick={() => handleCellClick(x, y)}
                                            onChange={(e) => handleInputChange(e, x, y)}
                                            onKeyDown={(e) => handleKeyDown(e, x, y)}
                                            value={userInput[key] || ''}
                                            className={`w-full h-full border text-center font-bold uppercase rounded-sm
                                                ${isActive ? 'bg-orange-100 border-orange-400' : 'border-slate-300'}
                                                ${fb === 'correct' ? 'bg-green-200 text-green-800' : ''}
                                                ${fb === 'incorrect' ? 'bg-red-200 text-red-800' : ''}
                                            `}
                                        />
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-slate-700">Horizontales</h4>
                        <ul className="text-sm space-y-1 mt-1">
                        {puzzles.filter(p => p.direction === 'across').map(p => (
                            <li key={p.id} onClick={() => handleCellClick(p.position.x, p.position.y)} className={`cursor-pointer p-1 rounded ${activePuzzle?.id === p.id ? 'bg-orange-100' : ''}`}><strong>{p.id}.</strong> {p.clue}</li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700">Verticales</h4>
                        <ul className="text-sm space-y-1 mt-1">
                        {puzzles.filter(p => p.direction === 'down').map(p => (
                            <li key={p.id} onClick={() => handleCellClick(p.position.x, p.position.y)} className={`cursor-pointer p-1 rounded ${activePuzzle?.id === p.id ? 'bg-orange-100' : ''}`}><strong>{p.id}.</strong> {p.clue}</li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <Button onClick={resetGame} variant="secondary">Reiniciar</Button>
                <Button onClick={checkAnswers}>Verificar Respuestas</Button>
            </div>
        </Card>
    );
};

const DecisionSimulatorGame: React.FC<InteractiveGameProps> = ({ game, onComplete }) => {
    const scenarios = useMemo(() => game.decisionScenarios || [], [game.decisionScenarios]);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showConsequence, setShowConsequence] = useState(false);

    if (scenarios.length === 0) return null;

    const currentScenario = scenarios[currentScenarioIndex];
    const isLastScenario = currentScenarioIndex === scenarios.length - 1;
    const allCompleted = useMemo(() => isLastScenario && showConsequence, [isLastScenario, showConsequence]);

    useEffect(() => {
        if (allCompleted) {
            onComplete();
        }
    }, [allCompleted, onComplete]);

    const handleOptionSelect = (optionId: number) => {
        if (showConsequence) return;
        setSelectedOption(optionId);
        setShowConsequence(true);
    };

    const handleNext = () => {
        if (!isLastScenario) {
            setCurrentScenarioIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowConsequence(false);
        }
    };

    const resetGame = () => {
        setCurrentScenarioIndex(0);
        setSelectedOption(null);
        setShowConsequence(false);
    };

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
            {!allCompleted && <p className="text-gray-600 mb-4">{game.instruction}</p>}

            {allCompleted ? (
                 <div className="text-center p-6 bg-green-100 rounded-lg animate-fade-in">
                    <h4 className="text-2xl font-bold text-green-700">¡Simulación Completada!</h4>
                    <p className="text-green-600 mt-2">Has enfrentado decisiones críticas y visto sus consecuencias. Este conocimiento es clave para proteger a tu entidad y a ti mismo.</p>
                    <Button onClick={resetGame} variant="secondary" className="mt-4">Jugar de Nuevo</Button>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-400">
                        <h4 className="font-bold text-gray-800">{currentScenario.title} ({currentScenarioIndex + 1}/{scenarios.length})</h4>
                        <p className="mt-2 text-gray-700">{currentScenario.prompt}</p>
                    </div>

                    <div className="mt-4 space-y-3">
                        {currentScenario.options.map(option => {
                            const isSelected = selectedOption === option.id;
                            let buttonClass = 'bg-white hover:bg-gray-100 text-gray-800';

                            if(showConsequence) {
                                if (option.isCorrect) {
                                    buttonClass = 'bg-green-100 border-green-500 text-green-800 font-semibold';
                                } else if (isSelected) {
                                    buttonClass = 'bg-red-100 border-red-500 text-red-800 font-semibold';
                                }
                            } else if (isSelected) {
                                buttonClass = 'bg-sky-100 border-sky-500 text-sky-800';
                            }

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option.id)}
                                    disabled={showConsequence}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${buttonClass}`}
                                >
                                    {option.text}
                                </button>
                            )
                        })}
                    </div>

                    {showConsequence && selectedOption !== null && (
                        <div className="mt-6 p-4 rounded-lg animate-fade-in bg-opacity-50
                            ${currentScenario.options.find(o => o.id === selectedOption)?.isCorrect ? 'bg-green-100' : 'bg-red-100'}">
                            <p className="text-gray-800">{currentScenario.options.find(o => o.id === selectedOption)?.consequence}</p>
                        </div>
                    )}

                    <div className="mt-6 text-right">
                        <Button onClick={handleNext} disabled={!showConsequence || isLastScenario}>Siguiente Decisión</Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

const TimedQuizGame: React.FC<InteractiveGameProps> = ({ game, onComplete }) => {
    const questions = useMemo(() => game.timedQuizQuestions || [], [game.timedQuizQuestions]);
    const timeLimit = useMemo(() => game.timeLimit || 15, [game.timeLimit]);

    const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'finished'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'finished') {
            onComplete();
        }
    }, [gameState, onComplete]);

    useEffect(() => {
        if (timeLeft <= 0 && gameState === 'playing') {
            if (timerRef.current) clearInterval(timerRef.current);
            setFeedback("¡Se acabó el tiempo! La respuesta correcta era: " + questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctOptionIndex]);
            setGameState('feedback');
        }
    }, [timeLeft, gameState, questions, currentQuestionIndex]);

    const handleAnswer = (selectedIndex: number) => {
        if (gameState !== 'playing') return;
        if (timerRef.current) clearInterval(timerRef.current);

        const currentQuestion = questions[currentQuestionIndex];
        if (selectedIndex === currentQuestion.correctOptionIndex) {
            setScore(prev => prev + 1);
            setFeedback('');
            goToNext();
        } else {
            setFeedback(currentQuestion.feedback);
            setGameState('feedback');
        }
    };

    const goToNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTimeLeft(timeLimit);
            setGameState('playing');
            setFeedback('');
        } else {
            setGameState('finished');
        }
    };

    const startGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimeLeft(timeLimit);
        setFeedback('');
        setGameState('playing');
    };

    const getTimerColor = () => {
        const percentage = (timeLeft / timeLimit) * 100;
        if (percentage > 50) return 'bg-green-500';
        if (percentage > 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    
    if (questions.length === 0) return null;

    if (gameState === 'intro') {
        return (
            <Card className="text-center">
                 <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                 <p className="text-gray-600 my-4">{game.instruction}</p>
                 <Button onClick={startGame}>¡Empezar!</Button>
            </Card>
        );
    }
    
    if (gameState === 'finished') {
        return (
            <Card className="text-center">
                 <h3 className="text-xl font-semibold mb-2">¡Rally Completado!</h3>
                 <p className="text-gray-600 my-4">Tu puntaje final es:</p>
                 <p className="text-5xl font-bold text-sky-600 my-4">{score} / {questions.length}</p>
                 <Button onClick={startGame} variant="secondary">Jugar de Nuevo</Button>
            </Card>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
            
            <div className="my-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-1000 linear ${getTimerColor()}`}
                        style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
                    ></div>
                </div>
                <p className="text-center text-sm font-bold mt-1 text-gray-600">{timeLeft} segundos restantes</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-800 text-lg">{currentQuestion.question}</p>
            </div>

            <div className="mt-4 space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <Button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        variant="secondary"
                        className="w-full text-left p-3 !text-base"
                        disabled={gameState === 'feedback'}
                    >
                       {option}
                    </Button>
                ))}
            </div>

            {gameState === 'feedback' && (
                <div className="mt-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 animate-fade-in">
                    <p className="font-bold text-red-700">Retroalimentación:</p>
                    <p className="text-red-600">{feedback}</p>
                    <div className="text-right mt-2">
                        <Button onClick={goToNext}>Continuar</Button>
                    </div>
                </div>
            )}
        </Card>
    );
};


const InteractiveGame: React.FC<InteractiveGameProps> = ({ game, onComplete }) => {
  switch (game.type) {
    case 'match':
      return <MatchGame game={game} onComplete={onComplete} />;
    case 'drag_drop':
      return <DragDropGame game={game} onComplete={onComplete} />;
    case 'memory':
      return <MemoryGame game={game} onComplete={onComplete} />;
    case 'word_search':
        return <WordSearchGame game={game} onComplete={onComplete} />;
    case 'escape_room':
        return <EscapeRoomGame game={game} onComplete={onComplete} />;
    case 'crossword':
        return <CrosswordGame game={game} onComplete={onComplete} />;
    case 'decision_simulator':
        return <DecisionSimulatorGame game={game} onComplete={onComplete} />;
    case 'timed_quiz':
        return <TimedQuizGame game={game} onComplete={onComplete} />;
    case 'quiz': // Fallthrough for unimplemented
    default:
      return (
        <Card>
          <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
          <p className="text-gray-600">Este tipo de juego interactivo ({game.type}) es una idea para desarrollo futuro.</p>
        </Card>
      );
  }
};

export default InteractiveGame;
