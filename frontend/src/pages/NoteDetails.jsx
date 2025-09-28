import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Pencil, Calendar, Clock, Loader2, Trash2 } from 'lucide-react';
import noteService, { ApiError } from '../services/noteService';
import { useAuth } from '../contexts/AuthContext';

const formatDateTime = (value) => {
  if (!value) {
    return '';
  }

  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch (error) {
    return value;
  }
};

const NoteDetails = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchNote = useCallback(async () => {
  setIsLoading(true);
  setError('');
  setDeleteError('');

    try {
      const data = await noteService.getNote(id);
      setNote(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      setError(err?.message || 'Unable to load the note.');
    } finally {
      setIsLoading(false);
    }
  }, [id, logout, navigate]);

  useEffect(() => {
    if (user) {
      fetchNote();
    }
  }, [user, fetchNote]);

  const fromPath = location.state?.from;

  const handleBack = () => {
    if (typeof fromPath === 'string') {
      navigate(fromPath);
    } else {
      navigate(-1);
    }
  };

  const handleEdit = () => {
    navigate(`/notes/${id}/edit`, { state: { from: fromPath ?? location.pathname } });
  };

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this note? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeleteError('');
    setIsDeleting(true);

    try {
      await noteService.deleteNote(id);
      const destination = typeof fromPath === 'string' ? fromPath : '/notes';
      navigate(destination, {
        replace: true,
        state: {
          noteDeleted: {
            id,
            title: note?.title || 'Untitled note'
          }
        }
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      setDeleteError(err?.message || 'Unable to delete the note.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <Link
              to={`/notes/${id}/edit`}
              state={{ from: fromPath ?? location.pathname }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mb-3" />
              Loading note...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-600">
              {error}
            </div>
          ) : note ? (
            <div className="space-y-6">
              {deleteError && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                  {deleteError}
                </div>
              )}
              <header className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 break-words">{note.title}</h1>
                <p className="text-gray-500">{note.user?.fullName ?? note.user?.email ?? ''}</p>
              </header>

              <section className="grid sm:grid-cols-2 gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Created: {formatDateTime(note.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span>Last updated: {formatDateTime(note.updatedAt)}</span>
                </div>
              </section>

              <article className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-800 text-base leading-relaxed bg-gray-50 rounded-2xl p-6">{note.content}</pre>
              </article>
            </div>
          ) : (
            <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-6 text-yellow-700">
              Note not found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
