package com.net.Notiva.services;

import com.fasterxml.jackson.annotation.JacksonInject;
import com.net.Notiva.entity.Note;
import com.net.Notiva.entity.User;
import com.net.Notiva.exception.ResourceNotFoundException;
import com.net.Notiva.repository.NoteRepository;
import com.net.Notiva.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {
    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();

        return userRepository.findByUserName(userName);
    }

    public List<Note> getUserNotes() {
        User user = getAuthenticatedUser();

        return noteRepository.findByUserId(user.getId());
    }

    public Note addNote(Note note) {
        User user = getAuthenticatedUser();

        note.setUserId(user.getId());
        return noteRepository.save(note);
    }

    public Note updateNote( Note updatedNote) {
        User user = getAuthenticatedUser();

        Note existingNote = noteRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Note not Found"+user.getId()));

        if (!existingNote.getUserId().equals(user.getId())) {
            throw new IllegalStateException("unauthorized access");
        }
        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setContent(updatedNote.getContent());
        return noteRepository.save(existingNote);
    }

    public Note deleteNote(String noteId) {
        User user = getAuthenticatedUser();
        Note existingNote = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not Found"+user.getId()));

        if (!existingNote.getUserId().equals(user.getId())) {
            throw new IllegalStateException("Unauthorized");
        }
        noteRepository.deleteById(noteId);
        return existingNote;
    }
}
