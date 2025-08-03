import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTodos = query({
  args: {
    priority: v.optional(v.union(v.literal("urgent"), v.literal("high"), v.literal("medium"), v.literal("low"))),
    category: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    sortBy: v.optional(v.union(v.literal("priority"), v.literal("dueDate"), v.literal("createdAt"))),
  },
  handler: async (ctx, args) => {
    // Get all todos first
    let todos = await ctx.db.query("todos").order("desc").collect();
    
    // Apply filters
    if (args.priority !== undefined) {
      todos = todos.filter(todo => todo.priority === args.priority);
    }
    
    if (args.category !== undefined) {
      todos = todos.filter(todo => todo.category === args.category);
    }
    
    // Filter by completion status
    if (args.completed !== undefined) {
      todos = todos.filter(todo => todo.isCompleted === args.completed);
    }
    
    // Sort todos
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    
    todos.sort((a, b) => {
      if (args.sortBy === "priority") {
        const aPriority = a.priority || "medium";
        const bPriority = b.priority || "medium";
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      } else if (args.sortBy === "dueDate") {
        const aCreated = a.createdAt || 0;
        const bCreated = b.createdAt || 0;
        if (!a.dueDate && !b.dueDate) return bCreated - aCreated;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate - b.dueDate;
      } else {
        const aCreated = a.createdAt || 0;
        const bCreated = b.createdAt || 0;
        return bCreated - aCreated;
      }
    });
    
    return todos;
  },
});

export const getTodosByCategory = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    const categories: Record<string, typeof todos> = {};
    
    todos.forEach(todo => {
      const category = todo.category || "personal";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(todo);
    });
    
    return categories;
  },
});

export const getProductivityStats = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;
    
    const todayStart = now - (now % dayMs);
    const weekStart = now - weekMs;
    
    const todayCompleted = todos.filter(todo => 
      todo.isCompleted && todo.completedAt && todo.completedAt >= todayStart
    ).length;
    
    const weekCompleted = todos.filter(todo => 
      todo.isCompleted && todo.completedAt && todo.completedAt >= weekStart
    ).length;
    
    const totalCompleted = todos.filter(todo => todo.isCompleted).length;
    const totalActive = todos.filter(todo => !todo.isCompleted).length;
    
    return {
      todayCompleted,
      weekCompleted,
      totalCompleted,
      totalActive,
      totalTodos: todos.length,
      completionRate: todos.length > 0 ? totalCompleted / todos.length : 0,
    };
  },
});

export const addTodo = mutation({
  args: { 
    text: v.string(),
    priority: v.optional(v.union(v.literal("urgent"), v.literal("high"), v.literal("medium"), v.literal("low"))),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
    estimatedDuration: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
      priority: args.priority || "medium",
      category: args.category || "personal",
      tags: args.tags || [],
      dueDate: args.dueDate,
      estimatedDuration: args.estimatedDuration,
      actualDuration: undefined,
      createdAt: Date.now(),
      completedAt: undefined,
      notes: args.notes,
    });

    return todoId;
  },
});

export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new ConvexError("Todo not found");

    const isCompleting = !todo.isCompleted;
    await ctx.db.patch(args.id, {
      isCompleted: isCompleting,
      completedAt: isCompleting ? Date.now() : undefined,
    });
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("urgent"), v.literal("high"), v.literal("medium"), v.literal("low"))),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
    estimatedDuration: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updateData: any = {};
    if (args.text !== undefined) updateData.text = args.text;
    if (args.priority !== undefined) updateData.priority = args.priority;
    if (args.category !== undefined) updateData.category = args.category;
    if (args.tags !== undefined) updateData.tags = args.tags;
    if (args.dueDate !== undefined) updateData.dueDate = args.dueDate;
    if (args.estimatedDuration !== undefined) updateData.estimatedDuration = args.estimatedDuration;
    if (args.notes !== undefined) updateData.notes = args.notes;

    await ctx.db.patch(args.id, updateData);
  },
});

export const clearAllTodos = mutation({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();

    // Delete all todos
    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }

    return { deletedCount: todos.length };
  },
});