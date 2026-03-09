package com.net.Notiva.services;
import com.net.Notiva.entity.Note;
import com.net.Notiva.entity.User;
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

    public List<Note> getUserNotes() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        User user = userRepository.findByUserName(userName);

        return noteRepository.findByUserId(user.getId());
    }

    public Note addNote(Note note) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        User user = userRepository.findByUserName(userName);
        note.setUserId(user.getId());
        Note savedNote = noteRepository.save(note);
        return savedNote;
    }

    public Note updateNote(String noteId, Note updatedNote) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        User user = userRepository.findByUserName(userName);


        Note existingNote = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not Found"));

        if(!existingNote.getUserId().equals(user.getId())){
            throw new RuntimeException("unauthorized");
        }
        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setContent(updatedNote.getContent());

        return noteRepository.save(existingNote);
    }

    public Note deleteNote(String noteId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        User user = userRepository.findByUserName(userName);

        Note existingNote = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!existingNote.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        noteRepository.delete(existingNote);
        return existingNote;
    }
}
