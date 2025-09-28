package com.noteapp.note.Notes.dto;

import com.noteapp.note.Notes.Note;
import com.noteapp.note.Users.User;

import java.time.LocalDateTime;

public record NoteResponse(
        Long id,
        String title,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        UserSummary user
) {

    public static NoteResponse from(Note note) {
        if (note == null) {
            return null;
        }

        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getCreatedAt(),
                note.getUpdatedAt(),
                UserSummary.from(note.getUser())
        );
    }

    public record UserSummary(
            Long id,
            String username,
            String fullName,
            String email
    ) {
        public static UserSummary from(User user) {
            if (user == null) {
                return null;
            }

            return new UserSummary(
                    user.getId(),
                    user.getUsername(),
                    user.getFullName(),
                    user.getEmail()
            );
        }
    }
}
