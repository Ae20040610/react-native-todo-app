import { Router, Response } from 'express';
import Task from '../models/Task';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth); // every task route needs a logged-in user

const PRIORITIES = ['low', 'medium', 'high'];
// Fields a client is allowed to change on update
const EDITABLE = ['title', 'description', 'dateTime', 'deadline', 'priority', 'category', 'completed'];

// GET /api/tasks - all tasks of the current user
router.get('/', async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(tasks);
});

// POST /api/tasks - create a task
router.post('/', async (req: AuthRequest, res: Response) => {
  const { title, description, dateTime, deadline, priority, category } = req.body;
  if (!title || !String(title).trim()) {
    res.status(400).json({ message: 'Title is required' });
    return;
  }
  if (!dateTime || !deadline || isNaN(Date.parse(dateTime)) || isNaN(Date.parse(deadline))) {
    res.status(400).json({ message: 'Valid date-time and deadline are required' });
    return;
  }
  if (new Date(deadline) < new Date(dateTime)) {
    res.status(400).json({ message: 'Deadline cannot be before the task date-time' });
    return;
  }
  if (priority && !PRIORITIES.includes(priority)) {
    res.status(400).json({ message: 'Invalid priority' });
    return;
  }
  const task = await Task.create({
    user: req.userId, title, description, dateTime, deadline, priority, category,
  });
  res.status(201).json(task);
});

// PATCH /api/tasks/:id - update fields (e.g. mark completed)
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const updates: Record<string, unknown> = {};
  EDITABLE.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, updates, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch {
    res.status(400).json({ message: 'Invalid task id or data' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ id: req.params.id });
  } catch {
    res.status(400).json({ message: 'Invalid task id' });
  }
});

export default router;
