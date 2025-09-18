
import React, { useState, useMemo, useEffect, useRef } from 'react';
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
}

const MatchGame: React.FC<InteractiveGameProps> = ({ game }) => {
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
  
  const allMatched = correctMatches.size === originalPairs.length;
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

const DragDropGame: React.FC<InteractiveGameProps> = ({ game }) => {
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

const MemoryGame: React.FC<InteractiveGameProps> = ({ game }) => {
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

    const isSetCompleted = matchedPairs.length > 0 && matchedPairs.length === cards.length;
    const allSetsCompleted = isSetCompleted && currentSetIndex === memorySets.length - 1;

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

const WordSearchGame: React.FC<InteractiveGameProps> = ({ game }) => {
    const [grid, setGrid] = useState<string[][]>([]);
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [selection, setSelection] = useState<{ r: number, c: number }[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    
    const words = useMemo(() => (game.words || []).map(w => w.toUpperCase().replace(/\s/g, '')), [game.words]);
    const GRID_SIZE = 15;
    const placedWords = useRef<Map<string, { r: number, c: number }[]>>(new Map());

    const generateGrid = () => {
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
    };

    useEffect(() => {
        generateGrid();
    }, [words]);

    const getLine = (start: {r: number, c: number}, end: {r: number, c: number}) => {
        const line: {r: number, c: number}[] = [];
        const dr = Math.sign(end.r - start.r);
        const dc = Math.sign(end.c - start.c);
        
        if (dr === 0 && dc === 0) return [start];
        if (dr !== 0 && dc !== 0 && Math.abs(end.r-start.r) !== Math.abs(end.c-start.c)) return []; // Not a straight line

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
    
    const allFound = foundWords.size === words.length;
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

const EscapeRoomGame: React.FC<InteractiveGameProps> = ({ game }) => {
    const [gameState, setGameState] = useState<'intro' | 'puzzles' | 'escaped'>('intro');
    const [solvedPuzzles, setSolvedPuzzles] = useState<Set<number>>(new Set());
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [code, setCode] = useState(['', '', '', '']);
    const [feedback, setFeedback] = useState('');
    const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const puzzles = useMemo(() => game.escapeRoomPuzzles || [], [game.escapeRoomPuzzles]);
    const solution = useMemo(() => game.escapeRoomSolution || '', [game.escapeRoomSolution]);

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

const InteractiveGame: React.FC<InteractiveGameProps> = ({ game }) => {
  switch (game.type) {
    case 'match':
      return <MatchGame game={game} />;
    case 'drag_drop':
      return <DragDropGame game={game} />;
    case 'memory':
      return <MemoryGame game={game} />;
    case 'word_search':
        return <WordSearchGame game={game} />;
    case 'escape_room':
        return <EscapeRoomGame game={game} />;
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