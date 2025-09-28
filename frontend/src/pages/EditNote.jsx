import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import noteService, { ApiError } from '../services/noteService';
import { useAuth } from '../contexts/AuthContext';

const EditNote = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from;

  const [formState, setFormState] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const loadNote = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await noteService.getNote(id);
      setFormState({ title: data.title ?? '', content: data.content ?? '' });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      setError(err?.message || 'Unable to load note for editing.');
    } finally {
      setIsLoading(false);
    }
  }, [id, logout, navigate]);

  useEffect(() => {
    if (user) {
      loadNote();
    }
  }, [user, loadNote]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = formState.title.trim();
    const trimmedContent = formState.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Both title and content are required.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await noteService.updateNote(id, {
        title: trimmedTitle,
        content: trimmedContent
      });
      setSuccess('Note updated successfully.');
      navigate(`/notes/${id}`, { state: { from: fromPath ?? `/notes/${id}` } });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      setError(err?.message || 'Unable to save note.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (typeof fromPath === 'string') {
      navigate(fromPath);
    } else {
      navigate(`/notes/${id}`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mb-3" />
              Loading note...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter note title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  name="content"
                  value={formState.content}
                  onChange={handleChange}
                  rows={10}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Write your note here"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600">
                  {success}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditNote;
