package com.noteapp.note.Notes;

import com.noteapp.note.Users.User;
import com.noteapp.note.Users.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private UserService userService;

    @PostMapping
    public Note createNote(@RequestBody Note note, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        note.setUser(user);
        return noteService.create(note);
    }

    @GetMapping
    public List<Note> getAllNotes(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        return noteService.findAllByUser(user);
    }

    @GetMapping("/{id}")
    public Note getNoteById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        Note note = noteService.findById(id);
        if (!note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: Note does not belong to user");
        }
        return note;
    }

    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note noteDetails, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        Note note = noteService.findById(id);
        if (!note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: Note does not belong to user");
        }
        return noteService.update(id, noteDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        Note note = noteService.findById(id);
        if (!note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: Note does not belong to user");
        }
        noteService.delete(id);
        return ResponseEntity.ok().build();
    }
}