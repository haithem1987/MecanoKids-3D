import { describe, expect, it } from 'vitest';

// Pure helpers that mirror the undo stack logic used in App.tsx
function push(stack: string[][], current: string[]): string[][] {
  return [...stack, [...current]];
}

function undo(stack: string[][]): { stack: string[][]; restored: string[] } | null {
  if (stack.length === 0) return null;
  return { stack: stack.slice(0, -1), restored: stack[stack.length - 1] };
}

describe('undoStack', () => {
  it('push stores a snapshot of the current state', () => {
    const s = push([], ['a']);
    expect(s).toEqual([['a']]);
  });

  it('undo returns the last snapshot and shrinks the stack', () => {
    let stack = push([], []);
    stack = push(stack, ['a']);
    stack = push(stack, ['a', 'b']);
    const r1 = undo(stack)!;
    expect(r1.restored).toEqual(['a', 'b']);
    expect(r1.stack).toHaveLength(2);
    const r2 = undo(r1.stack)!;
    expect(r2.restored).toEqual(['a']);
    const r3 = undo(r2.stack)!;
    expect(r3.restored).toEqual([]);
    expect(undo(r3.stack)).toBeNull();
  });

  it('undo returns null on empty stack', () => {
    expect(undo([])).toBeNull();
  });

  it('push does not mutate the original array', () => {
    const original: string[][] = [];
    const next = push(original, ['x']);
    expect(original).toHaveLength(0);
    expect(next).toHaveLength(1);
  });

  it('snapshot is independent from the source array', () => {
    const current = ['a', 'b'];
    const stack = push([], current);
    current.push('c');
    expect(stack[0]).toEqual(['a', 'b']);
  });
});
