import React from 'react';
import { Link } from 'react-router-dom';
import { NotebookPen, Loader2 } from 'lucide-react';

const NotesNav = ({ notes = [], isLoading = false }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl">
            <NotebookPen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Notes</h3>
            <p className="text-sm text-gray-500">Jump back into any note instantly.</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading notes...
        </div>
      ) : notes.length === 0 ? (
        <div className="py-10 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl">
          No notes created yet
        </div>
      ) : (
        <ol className="space-y-3 list-decimal list-inside text-left text-gray-800">
          {notes.map((note, index) => (
            <li key={note.id} className="group">
              <Link
                to={`/notes/${note.id}`}
                state={{ from: '/dashboard' }}
                className="flex items-center justify-between rounded-xl border border-transparent px-4 py-3 transition-all duration-200 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-700"
              >
                <span className="font-medium truncate">{note.title || 'Untitled note'}</span>
                <span className="text-sm text-gray-400 group-hover:text-blue-500">Open</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default NotesNav;
