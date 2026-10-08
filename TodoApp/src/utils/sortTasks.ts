import { Priority, SortMode, Task } from '../types';

const WEIGHT: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

/**
 * "Smart" score mixes priority and deadline urgency.
 *  - priority contributes 20/40/60 points
 *  - urgency contributes up to 100 points: overdue = 100, due in 24h = 50, in a week ~ 12
 * Higher score = show first. Completed tasks always sink to the bottom.
 */
export const smartScore = (t: Task, now = Date.now()): number => {
  if (t.completed) return -1;
  const hoursLeft = (new Date(t.deadline).getTime() - now) / 36e5;
  const urgency = hoursLeft <= 0 ? 100 : 100 / (1 + hoursLeft / 24);
  return WEIGHT[t.priority] * 20 + urgency;
};

export const sortTasks = (tasks: Task[], mode: SortMode): Task[] => {
  const list = [...tasks];
  const byDeadline = (a: Task, b: Task) => +new Date(a.deadline) - +new Date(b.deadline);
  list.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1; // done last
    if (mode === 'deadline') return byDeadline(a, b);
    if (mode === 'priority') return WEIGHT[b.priority] - WEIGHT[a.priority] || byDeadline(a, b);
    return smartScore(b) - smartScore(a); // smart
  });
  return list;
};
