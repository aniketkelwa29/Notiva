package com.net.Notiva.controller;

import com.net.Notiva.entity.Note;
import com.net.Notiva.services.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/note")
public class NoteController {

    @Autowired
    private NoteService noteService;

    // GET notes of logged user
    @GetMapping
    public ResponseEntity<?> getNote() {

        List<Note> note = noteService.getUserNotes();

        if(note.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(note,HttpStatus.OK);
    }

    // CREATE note
    @PostMapping("/createNote")
    public ResponseEntity<Note> addNotes(@RequestBody Note note) {

        Note savedNotes = noteService.addNote(note);
        return new ResponseEntity<>(savedNotes, HttpStatus.CREATED);
    }

    // UPDATE note
    @PutMapping("/{noteId}")
    public ResponseEntity<Note> updateNotes(
            @PathVariable String noteId,
            @RequestBody Note updatedNotes) {

        Note updatedNote = noteService.updateNote(noteId, updatedNotes);
        return new ResponseEntity<>(updatedNote, HttpStatus.OK);
    }

    // DELETE note
    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNotes(@PathVariable String noteId){
        System.out.println("delete called");
        noteService.deleteNote(noteId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
