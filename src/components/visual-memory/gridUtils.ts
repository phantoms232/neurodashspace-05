export interface GridCell {
  id: number;
  isActive: boolean;
  isClicked: boolean;
}

export const generateGrid = (size: number, numActive: number) => {
  const totalCells = size * size;
  const cells: GridCell[] = Array.from({ length: totalCells }, (_, i) => ({
    id: i,
    isActive: false,
    isClicked: false
  }));

  // Randomly select squares to activate
  const activeIndices: number[] = [];
  while (activeIndices.length < numActive) {
    const randomIndex = Math.floor(Math.random() * totalCells);
    if (!activeIndices.includes(randomIndex)) {
      activeIndices.push(randomIndex);
    }
  }

  activeIndices.forEach(index => {
    cells[index].isActive = true;
  });

  return { cells, activeIndices };
};