
import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, PlusCircle, Trash2, Edit, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const ToDoListPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { toast } = useToast();

  // Load todos from local storage
  useEffect(() => {
    const savedTodos = localStorage.getItem('dms_todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('Failed to parse todos from localStorage', e);
      }
    }
  }, []);

  // Save todos to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('dms_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const newTodoItem: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos(prev => [newTodoItem, ...prev]);
    setNewTodo('');
    
    toast({
      title: "Todo Added",
      description: "New task has been added to your list."
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({
      title: "Todo Deleted",
      description: "Task has been removed from your list."
    });
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (!editText.trim() || !editingId) return;
    
    setTodos(prev => prev.map(todo => 
      todo.id === editingId ? { ...todo, text: editText.trim() } : todo
    ));
    
    setEditingId(null);
    setEditText('');
    
    toast({
      title: "Todo Updated",
      description: "Task has been updated successfully."
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">To-Do List</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>Manage your tasks and stay organized</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input 
              placeholder="Add a new task..." 
              value={newTodo} 
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={addTodo}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {todos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tasks yet. Add some tasks to get started!
              </p>
            ) : (
              todos.map(todo => (
                <div 
                  key={todo.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-md"
                >
                  {editingId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input 
                        value={editText} 
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div 
                        className="flex items-center flex-1 cursor-pointer"
                        onClick={() => toggleTodo(todo.id)}
                      >
                        {todo.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                        )}
                        <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {todo.text}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => startEditing(todo)}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToDoListPage;
