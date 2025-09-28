import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Plus, NotebookPen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CreateNote from '../components/CreateNote';
import noteService, { ApiError } from '../services/noteService';

const NotesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const createNoteRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const loadNotes = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await noteService.getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      setError(err?.message || 'Unable to load notes.');
    } finally {
      setIsLoading(false);
    }
  }, [logout, navigate, user]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (location.state?.noteDeleted) {
      const { title } = location.state.noteDeleted;
      const message = title ? `Deleted "${title}" successfully.` : 'Note deleted successfully.';
      setStatusMessage(message);
      const timer = setTimeout(() => setStatusMessage(''), 4000);
      navigate(location.pathname, { replace: true });
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [location.pathname, location.state, navigate]);

  const handleCreateNote = useCallback(
    async ({ title, content }) => {
      setError('');
      try {
        const createdNote = await noteService.createNote({ title, content });
        setNotes((prev) => [createdNote, ...prev]);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          navigate('/login');
          throw new Error('Your session has expired. Please sign in again.');
        }

        const message = err?.message || 'Unable to create note right now.';
        setError(message);
        throw new Error(message);
      }
    },
    [logout, navigate]
  );

  const openCreateModal = () => {
    createNoteRef.current?.open();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col gap-4 bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <NotebookPen className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Notes</h1>
              <p className="text-sm text-gray-600">Browse, open, or create notes in one place.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openCreateModal}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New Note
            </button>
            <CreateNote
              ref={createNoteRef}
              onCreateNote={handleCreateNote}
              showDefaultTrigger={false}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </header>

        {statusMessage && (
          <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600 shadow-sm">
            {statusMessage}
          </div>
        )}

        <section className="bg-white rounded-3xl shadow-xl p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mb-3" />
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-500">
              No notes created yet
            </div>
          ) : (
            <ol className="space-y-4 list-decimal list-inside text-left">
              {notes.map((note) => (
                <li key={note.id} className="group">
                  <Link
                    to={`/notes/${note.id}`}
                    state={{ from: '/notes' }}
                    className="flex items-center justify-between rounded-2xl border border-transparent px-5 py-4 transition-all duration-200 group-hover:border-blue-100 group-hover:bg-blue-50"
                  >
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {note.title || 'Untitled note'}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {note.content?.split('\n')[0] || 'Tap to view details'}
                      </p>
                    </div>
                    <span className="text-sm text-blue-500 font-medium ml-4">View</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
};

export default NotesPage;
