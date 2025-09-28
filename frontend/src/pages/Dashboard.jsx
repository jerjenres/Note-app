import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  NotebookPen,
  Plus,
  Search,
  Settings,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CreateNote from '../components/CreateNote';
import NotesNav from '../components/NotesNav';
import noteService, { ApiError } from '../services/noteService';

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getLatestTimestamp = (note) => {
  if (!note) {
    return null;
  }

  const updated = parseDate(note.updatedAt);
  const created = parseDate(note.createdAt);

  if (updated && created) {
    return updated > created ? updated : created;
  }

  return updated || created;
};

const sortNotesByRecentActivity = (notes) =>
  [...notes].sort((a, b) => {
    const timestampA = getLatestTimestamp(a)?.getTime() ?? 0;
    const timestampB = getLatestTimestamp(b)?.getTime() ?? 0;
    return timestampB - timestampA;
  });

const isWithinLastDays = (date, days) => {
  if (!date) {
    return false;
  }

  const now = new Date();
  const threshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return date >= threshold;
};

const pluralize = (value, unit) => `${value} ${unit}${value === 1 ? '' : 's'} ago`;

const formatRelativeTime = (targetDate, baseDate = new Date()) => {
  if (!targetDate) {
    return '';
  }

  const diffMs = baseDate.getTime() - targetDate.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return 'Just now';
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return pluralize(diffMinutes, 'minute');
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return pluralize(diffHours, 'hour');
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return pluralize(diffDays, 'day');
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) {
    return pluralize(diffWeeks, 'week');
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return pluralize(diffMonths, 'month');
  }

  const diffYears = Math.floor(diffDays / 365);
  return pluralize(Math.max(diffYears, 1), 'year');
};

const formatExactDate = (date) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);

const calculateStats = (notes) => {
  if (!Array.isArray(notes) || notes.length === 0) {
    return {
      total: 0,
      thisWeek: 0,
      lastActivityLabel: 'No activity yet',
      lastActivityExact: null
    };
  }

  let thisWeek = 0;
  let latestActivity = null;

  notes.forEach((note) => {
    const createdDate = parseDate(note?.createdAt);
    if (createdDate && isWithinLastDays(createdDate, 7)) {
      thisWeek += 1;
    }

    const recent = getLatestTimestamp(note);
    if (recent && (!latestActivity || recent > latestActivity)) {
      latestActivity = recent;
    }
  });

  return {
    total: notes.length,
    thisWeek,
    lastActivityLabel: latestActivity ? formatRelativeTime(latestActivity) : 'No activity yet',
    lastActivityExact: latestActivity ? formatExactDate(latestActivity) : null
  };
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [isFetchingNotes, setIsFetchingNotes] = useState(false);
  const [noteError, setNoteError] = useState('');
  const createNoteRef = useRef(null);
  const [noteSuccess, setNoteSuccess] = useState('');

  const stats = useMemo(() => calculateStats(notes), [notes]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const sortAndStoreNotes = useCallback((incomingNotes) => {
    if (!Array.isArray(incomingNotes)) {
      setNotes([]);
      return;
    }

    setNotes(sortNotesByRecentActivity(incomingNotes));
  }, []);

  const loadNotes = useCallback(async () => {
    setIsFetchingNotes(true);
    setNoteError('');

    try {
      const data = await noteService.getNotes();
      sortAndStoreNotes(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setNoteError('Your session has expired. Please sign in again.');
        logout();
        setNotes([]);
        return;
      }

      setNoteError(error?.message || 'Unable to load your notes right now.');
    } finally {
      setIsFetchingNotes(false);
    }
  }, [logout, sortAndStoreNotes]);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user, loadNotes]);

  useEffect(() => {
    if (location.hash === '#notes') {
      const section = document.getElementById('notes-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.noteDeleted) {
      const { title } = location.state.noteDeleted;
      const message = title ? `Deleted "${title}" successfully.` : 'Note deleted successfully.';
      setNoteSuccess(message);
      const timer = setTimeout(() => setNoteSuccess(''), 4000);
      navigate(location.pathname, { replace: true, state: {} });
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [location.pathname, location.state, navigate]);

  const handleCreateNote = useCallback(
    async ({ title, content }) => {
      setNoteError('');

      try {
        const createdNote = await noteService.createNote({ title, content });

        setNotes((previousNotes) => sortNotesByRecentActivity([createdNote, ...previousNotes]));
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setNoteError('Your session has expired. Please sign in again.');
          logout();
          setNotes([]);
          throw new Error('Your session has expired. Please sign in again.');
        }

        const message = error?.message || 'Unable to create the note right now.';
        setNoteError(message);
        throw new Error(message);
      }
    },
    [logout]
  );

  const openCreateModal = useCallback(() => {
    createNoteRef.current?.open();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6">
              <NotebookPen className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start organizing your thoughts and ideas. Create your first note or explore the features below.
            </p>

            {noteError && (
              <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {noteError}
              </div>
            )}

            {noteSuccess && (
              <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600">
                {noteSuccess}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CreateNote ref={createNoteRef} onCreateNote={handleCreateNote} />
              <Link to="/" className="btn-secondary inline-flex items-center justify-center">
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl">
                <NotebookPen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isFetchingNotes ? '...' : stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isFetchingNotes ? '...' : stats.thisWeek}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 rounded-xl">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Activity</p>
                <p
                  className="text-sm font-bold text-gray-900"
                  title={stats.lastActivityExact || undefined}
                >
                  {isFetchingNotes ? '...' : stats.lastActivityLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Navigation */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Getting Started
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Create Notes
                </h4>
                <p className="text-gray-600">
                  Start capturing your thoughts with rich text formatting and organization.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-4">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Search & Filter
                </h4>
                <p className="text-gray-600">
                  Find your notes quickly with powerful search and filtering options.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 md:col-span-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-2xl mb-4">
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Customize
                </h4>
                <p className="text-gray-600">
                  Personalize your experience with themes and preferences.
                </p>
              </div>
            </div>


          </div>
          <div id="notes-section">
            <NotesNav notes={notes} isLoading={isFetchingNotes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
