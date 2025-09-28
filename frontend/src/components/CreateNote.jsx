import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';

const defaultFormState = {
	title: '',
	content: ''
};

const CreateNote = forwardRef(({ onCreateNote, showDefaultTrigger = true }, ref) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formState, setFormState] = useState(defaultFormState);
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleOpenModal = () => {
		setError('');
		setFormState(defaultFormState);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		if (isSubmitting) {
			return;
		}
		setIsModalOpen(false);
		setFormState(defaultFormState);
		setError('');
	};

	useEffect(() => {
		if (!isModalOpen) {
			return undefined;
		}

		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				handleCloseModal();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isModalOpen, isSubmitting]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormState((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const trimmedTitle = formState.title.trim();
		const trimmedContent = formState.content.trim();

		if (!trimmedTitle || !trimmedContent) {
			setError('Please provide both a title and a body for your note.');
			return;
		}

		if (typeof onCreateNote !== 'function') {
			setError('Note creation is not available right now.');
			return;
		}

		setIsSubmitting(true);

		try {
			await onCreateNote({
				title: trimmedTitle,
				content: trimmedContent
			});
			setIsModalOpen(false);
			setFormState(defaultFormState);
			setError('');
		} catch (submitError) {
			setError(submitError?.message || 'Something went wrong while creating the note.');
		} finally {
			setIsSubmitting(false);
		}
	};

	useImperativeHandle(ref, () => ({
		open: handleOpenModal,
		close: handleCloseModal
	}));

	return (
		<>
			{showDefaultTrigger && (
				<button
					type="button"
					onClick={handleOpenModal}
					className="inline-flex items-center justify-center btn-primary"
				>
					<Plus className="w-5 h-5 mr-2" />
					Create New Note
				</button>
			)}

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
					<div
						className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
						onClick={handleCloseModal}
					/>

					<div className="relative w-full max-w-xl overflow-hidden bg-white shadow-2xl rounded-2xl">
						<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
							<div>
								<h3 className="text-xl font-semibold text-gray-900">Create a new note</h3>
								<p className="text-sm text-gray-500">Capture your thoughts and ideas in seconds.</p>
							</div>
							<button
								type="button"
								onClick={handleCloseModal}
								className="p-2 text-gray-400 transition rounded-full hover:bg-gray-100 hover:text-gray-700"
								disabled={isSubmitting}
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="px-6 pt-4 pb-6">
							<div className="space-y-5">
								<label className="block">
									<span className="block mb-2 text-sm font-medium text-gray-700">Title</span>
									<input
										type="text"
										name="title"
										value={formState.title}
										onChange={handleChange}
										placeholder="e.g. Design inspiration"
										required
										autoFocus
										className="w-full px-4 py-3 text-gray-900 transition bg-white border border-gray-200 shadow-sm rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200"
									/>
								</label>

								<label className="block">
									<span className="block mb-2 text-sm font-medium text-gray-700">Body</span>
									<textarea
										name="content"
										value={formState.content}
										onChange={handleChange}
										placeholder="Start typing your note..."
										rows={6}
										required
										className="w-full px-4 py-3 text-gray-900 transition bg-white border border-gray-200 shadow-sm rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200"
									/>
								</label>

								{error && (
									<div className="px-4 py-3 text-sm text-red-600 border border-red-100 rounded-xl bg-red-50">
										{error}
									</div>
								)}
							</div>

							<div className="flex flex-col-reverse gap-3 mt-6 sm:flex-row sm:justify-end">
								<button
									type="button"
									onClick={handleCloseModal}
									className="btn-secondary"
									disabled={isSubmitting}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="inline-flex items-center justify-center btn-primary"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-5 h-5 mr-2 animate-spin" />
											Creating...
										</>
									) : (
										<>
											<Plus className="w-5 h-5 mr-2" />
											Add note
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
});

CreateNote.displayName = 'CreateNote';

export default CreateNote;
